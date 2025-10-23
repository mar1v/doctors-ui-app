import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById, type IPatient } from "../../api/patientsApi";
import {
  createReport,
  getReportByPatientId,
  updateReport,
} from "../../api/reportsApi";

import SearchExam from "../Exams/SearchExam";
import SelectedExamsTable from "../Exams/SelectedExamsTable";
import SearchHomeCare from "../HomeCare/SearchHomeCare";
import SelectedHomeCaresTable from "../HomeCare/SelectedHomeCaresTable";
import SearchMedication from "../Medications/SearchMedication";
import SelectedMedicationsTable from "../Medications/SelectedMedicatonsTable";
import SearchProcedure from "../Procedures/SearchProcedure";
import SelectedProceduresTable from "../Procedures/SelectedProceduresTable";
import SearchSpecialist from "../Specialists/SearchSpecialist";
import SelectedSpecialistsTable from "../Specialists/SelectedSpecialistsTable";

import type { IExam } from "../../api/examsApi";
import type { IHomeCare } from "../../api/homeCaresApi";
import type { IMedication } from "../../api/medicationsApi";
import type { IProcedure } from "../../api/proceduresApi";
import type { ISpecialist } from "../../api/specialistsApi";

import toast from "react-hot-toast";
import { generateReportPDF } from "./pdf/generateReportPDF";
import ReportActions from "./ReportActions";
import ReportComments from "./ReportComments";
import ReportSection from "./ReportSection";

const CreateReportForm: React.FC = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const [selectedExams, setSelectedExams] = useState<IExam[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<IMedication[]>(
    []
  );
  const [selectedProcedures, setSelectedProcedures] = useState<IProcedure[]>(
    []
  );
  const [selectedSpecialists, setSelectedSpecialists] = useState<ISpecialist[]>(
    []
  );
  const [selectedHomeCares, setSelectedHomeCares] = useState<IHomeCare[]>([]);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);

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
          setSelectedProcedures(reportData.procedures ?? []);
          setSelectedSpecialists(reportData.specialists ?? []);
          setSelectedHomeCares(reportData.homeCares ?? []);
          setComments(reportData.comments ?? "");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

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
      procedures: selectedProcedures.map((p) => ({
        name: p.name,
        recommendation: p.recommendation,
      })),
      specialists: selectedSpecialists.map((s) => ({
        name: s.name,
        query: s.query,
      })),
      homeCares: selectedHomeCares.map((h) => ({
        name: h.name,
        morning: h.morning,
        day: h.day,
        evening: h.evening,
      })),
      comments,
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
    } catch (error) {
      console.error("Error saving report:", error);
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
              <ReportSection title="Засоби">
                <SearchMedication
                  selectedMedications={selectedMedications}
                  setSelectedMedications={setSelectedMedications}
                  medication={[]}
                />
                <SelectedMedicationsTable
                  selectedMedications={selectedMedications}
                  setSelectedMedications={setSelectedMedications}
                />
              </ReportSection>

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
                <SearchProcedure
                  selectedProcedures={selectedProcedures}
                  setSelectedProcedures={setSelectedProcedures}
                />
                <SelectedProceduresTable
                  selectedProcedures={selectedProcedures}
                  setSelectedProcedures={setSelectedProcedures}
                />
              </ReportSection>

              <ReportSection title="Суміжні спеціалісти">
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

              <ReportComments comments={comments} setComments={setComments} />

              <ReportActions
                reportId={reportId}
                patient={patient}
                onExport={() =>
                  generateReportPDF({
                    patient,
                    exams: selectedExams,
                    medications: selectedMedications,
                    procedures: selectedProcedures,
                    specialists: selectedSpecialists,
                    homeCares: selectedHomeCares,
                    comments,
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
