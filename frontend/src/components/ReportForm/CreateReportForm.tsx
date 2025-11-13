import { getPatientById, type IPatient } from "#api/patientsApi";
import {
  createReport,
  getReportByPatientId,
  updateReport,
} from "#api/reportsApi";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SearchExam from "#components/Exams/SearchExam";
import SelectedExamsTable from "#components/Exams/SelectedExamsTable";
import SearchHomeCare from "#components/HomeCare/SearchHomeCare";
import SelectedHomeCaresTable from "#components/HomeCare/SelectedHomeCaresTable";
import SearchSpecialist from "#components/Specialists/SearchSpecialist";
import SelectedSpecialistsTable from "#components/Specialists/SelectedSpecialistsTable";

import type { IExam } from "#api/examsApi";
import type { IHomeCare } from "#api/homeCaresApi";
import type { IMedication } from "#api/medicationsApi";
import type { IProcedure } from "#api/proceduresApi";
import type { ISpecialist } from "#api/specialistsApi";

import SearchProcedure from "#components/Procedures/SearchProcedure";
import { generateReportPDF } from "#components/ReportForm/pdf/generateReportPDF";
import ReportActions from "#components/ReportForm/ReportActions";
import ReportComments from "#components/ReportForm/ReportComments";
import ReportSection from "#components/ReportForm/ReportSection";
import toast from "react-hot-toast";

interface IProcedureStage {
  id: string;
  title: string;
  procedures: (IProcedure & { comment?: string })[];
}

const CreateReportForm: React.FC = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const [selectedExams, setSelectedExams] = useState<IExam[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<IMedication[]>(
    []
  );
  const [selectedSpecialists, setSelectedSpecialists] = useState<ISpecialist[]>(
    []
  );
  const [selectedHomeCares, setSelectedHomeCares] = useState<IHomeCare[]>([]);
  const [procedureStages, setProcedureStages] = useState<IProcedureStage[]>([]);

  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      try {
        const [patientData, reportData] = await Promise.all([
          getPatientById(patientId),
          getReportByPatientId(patientId).catch(() => null),
        ]);
        setPatient(patientData);

        if (reportData) {
          setReportId(reportData._id ?? null);
          setSelectedExams(reportData.exams ?? []);
          setSelectedMedications(reportData.medications ?? []);
          setSelectedSpecialists(reportData.specialists ?? []);
          setSelectedHomeCares(reportData.homeCares ?? []);
          setAdditionalInfo(reportData.additionalInfo ?? "");
          setComments(reportData.comments ?? "");

          interface ReportProcedure {
            _id?: string;
            name: string;
            recommendation?: string;
            comment?: string;
            stage?: string;
          }

          interface ReportProcedureStage {
            stage: string;
            procedures: ReportProcedure[];
          }
          if (
            Array.isArray(reportData.procedureStages) &&
            reportData.procedureStages.length > 0
          ) {
            const stages = (
              reportData.procedureStages as ReportProcedureStage[]
            ).map((s) => ({
              id: crypto.randomUUID(),
              title: s.stage,
              procedures: (s.procedures ?? []) as (IProcedure & {
                comment?: string;
              })[],
            }));
            setProcedureStages(stages);
          } else if (
            Array.isArray(reportData.procedures) &&
            reportData.procedures.length > 0
          ) {
            const grouped = (reportData.procedures as ReportProcedure[]).reduce(
              (acc, proc) => {
                const stageName = proc.stage || "Етап 1";
                if (!acc[stageName]) acc[stageName] = [];
                acc[stageName].push(proc);
                return acc;
              },
              {} as Record<string, ReportProcedure[]>
            );

            const stages = Object.entries(grouped).map(
              ([stageName, procs]) => ({
                id: crypto.randomUUID(),
                title: stageName,
                procedures: procs as (IProcedure & { comment?: string })[],
              })
            );

            setProcedureStages(stages);
          } else {
            setProcedureStages([]);
          }
        }
      } catch {
        toast.error("Не вдалося завантажити дані пацієнта або звіту.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const addStage = () => {
    setProcedureStages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: `Етап ${prev.length + 1}`,
        procedures: [],
      },
    ]);
  };

  const updateStage = (id: string, updated: IProcedureStage) => {
    setProcedureStages((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const removeStage = (id: string) => {
    setProcedureStages((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return toast.error("Пацієнт не вибраний!");

    const payload = {
      patient: patientId,
      exams: selectedExams.map((e) => ({
        name: e.name,
        recommendation: e.recommendation,
      })),
      medications: selectedMedications.map((m) => ({
        name: m.name,
        recommendation: m.recommendation,
      })),
      specialists: selectedSpecialists.map((s) => ({
        name: s.name,
        query: s.query,
      })),
      homeCares: selectedHomeCares.map((h) => ({
        name: h.name,
        morning: h.morning,
        evening: h.evening,
        medicationName: h.medicationName || "Засіб",
      })),
      procedureStages: procedureStages.map((s) => ({
        stage: s.title,
        procedures: s.procedures.map((p) => ({
          name: p.name,
          comment: p.comment,
          recommendation: p.recommendation,
        })),
      })),
      procedures: procedureStages.flatMap((s) =>
        s.procedures.map((p) => ({
          name: p.name,
          comment: p.comment,
          recommendation: p.recommendation,
          stage: s.title,
        }))
      ),
      comments,
      additionalInfo,
    };

    try {
      let savedReport;
      if (reportId) {
        savedReport = await updateReport(reportId, payload);
        toast.success("Звіт оновлено успішно!");
      } else {
        savedReport = await createReport(payload);
        toast.success("Звіт створено успішно!");
        setReportId(savedReport?._id ?? null);
      }
    } catch {
      toast.error("Не вдалося зберегти звіт. Спробуйте ще раз.");
    }
  };

  if (loading)
    return <p className="p-4 text-center text-sm">Завантаження даних...</p>;
  if (!patient)
    return <p className="p-4 text-center text-sm">Пацієнта не знайдено.</p>;

  return (
    <div className="w-full min-h-screen overflow-y-auto bg-gray-50">
      <div className="px-2 sm:px-3 md:px-4 lg:px-5 py-2">
        <div className="w-full max-w-[1000px] xl:max-w-[1100px] mx-auto">
          <button
            onClick={() => window.history.back()}
            className="border border-green-300 rounded py-1 px-3 mb-3 text-green-700 text-xs font-medium 
                       hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-sm"
          >
            ← Назад
          </button>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-2 sm:p-3 md:p-4 w-full mb-6 transition-all duration-300"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-800 border-b pb-1 border-gray-200">
              Рекомендаційний лист {patient.fullName}
            </h2>

            <div className="space-y-3">
              <ReportSection title="Обстеження">
                <SearchExam
                  selectedExams={selectedExams}
                  setSelectedExams={setSelectedExams}
                  exams={[]}
                />
                <SelectedExamsTable
                  selectedExams={selectedExams}
                  setSelectedExams={setSelectedExams}
                />
              </ReportSection>

              <ReportSection title="Процедури">
                {procedureStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="border border-green-200 rounded-lg p-3 mb-3 bg-green-50/40"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={stage.title}
                        onChange={(e) =>
                          updateStage(stage.id, {
                            ...stage,
                            title: e.target.value,
                          })
                        }
                        className="border border-green-300 rounded px-2 py-1 text-sm w-1/2"
                      />
                      <button
                        type="button"
                        onClick={() => removeStage(stage.id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Видалити етап
                      </button>
                    </div>

                    <SearchProcedure
                      selectedProcedures={stage.procedures as IProcedure[]}
                      setSelectedProcedures={(updated) => {
                        if (typeof updated === "function") {
                          const newProcedures = updated(
                            stage.procedures as IProcedure[]
                          );
                          updateStage(stage.id, {
                            ...stage,
                            procedures: newProcedures.map((p) => ({
                              ...p,
                              comment:
                                stage.procedures.find((sp) => sp._id === p._id)
                                  ?.comment || "",
                            })),
                          });
                        } else {
                          updateStage(stage.id, {
                            ...stage,
                            procedures: updated.map((p) => ({
                              ...p,
                              comment:
                                stage.procedures.find((sp) => sp._id === p._id)
                                  ?.comment || "",
                            })),
                          });
                        }
                      }}
                    />

                    {stage.procedures.map((proc) => (
                      <div
                        key={proc._id}
                        className="flex flex-col border border-green-200 rounded-md p-2 mt-2 bg-white"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">{proc.name}</p>
                          <button
                            type="button"
                            onClick={() =>
                              updateStage(stage.id, {
                                ...stage,
                                procedures: stage.procedures.filter(
                                  (p) => p._id !== proc._id
                                ),
                              })
                            }
                            className="text-red-500 hover:text-red-700 text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <textarea
                          value={proc.comment || ""}
                          onChange={(e) =>
                            updateStage(stage.id, {
                              ...stage,
                              procedures: stage.procedures.map((p) =>
                                p._id === proc._id
                                  ? { ...p, comment: e.target.value }
                                  : p
                              ),
                            })
                          }
                          placeholder="Коментар до процедури"
                          className="w-full border border-green-200 rounded text-sm p-1 mt-1 resize-none"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addStage}
                  className="text-green-600 text-sm mt-2 hover:underline"
                >
                  Додати етап
                </button>
              </ReportSection>

              {procedureStages.some((s) => s.procedures.length > 0) && (
                <ReportSection title="Рекомендації щодо процедур">
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {[
                      ...new Map(
                        procedureStages
                          .flatMap((s) => s.procedures)
                          .map((p) => [p.name, p.recommendation])
                      ).entries(),
                    ].map(([name, rec]) => (
                      <li key={name}>
                        <strong>{name}:</strong>{" "}
                        {rec || "Рекомендація відсутня"}
                      </li>
                    ))}
                  </ul>
                </ReportSection>
              )}

              <ReportSection title="Рекомендована консультація суміжного спеціаліста">
                <SearchSpecialist
                  selectedSpecialists={selectedSpecialists}
                  setSelectedSpecialists={setSelectedSpecialists}
                />
                <SelectedSpecialistsTable
                  selectedSpecialists={selectedSpecialists}
                  setSelectedSpecialists={setSelectedSpecialists}
                />
              </ReportSection>

              <ReportSection title="Домашній догляд">
                <SearchHomeCare
                  selectedHomeCares={selectedHomeCares}
                  setSelectedHomeCares={setSelectedHomeCares}
                />
                <SelectedHomeCaresTable
                  selectedHomeCares={selectedHomeCares}
                  setSelectedHomeCares={setSelectedHomeCares}
                />
              </ReportSection>

              <ReportSection title="Все, що необхідно знати про ваш стан">
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Необхідна інформація"
                  className="w-full border border-green-200  rounded-md text-sm p-2 resize-none focus:ring-1 focus:outline-none"
                  rows={4}
                />
              </ReportSection>

              <ReportComments comments={comments} setComments={setComments} />

              <ReportActions
                reportId={reportId}
                patient={patient}
                onExport={() =>
                  generateReportPDF({
                    patient,
                    exams: selectedExams,
                    medications: selectedMedications,
                    procedures: procedureStages.flatMap((s) => s.procedures),
                    procedureStages,
                    specialists: selectedSpecialists,
                    homeCares: selectedHomeCares,
                    comments,
                    additionalInfo,
                  })
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReportForm;
