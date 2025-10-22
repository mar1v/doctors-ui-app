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
import SearchMedication from "../Medications/SearchMedication";
import SelectedMedicationsTable from "../Medications/SelectedMedicatonsTable";
import SearchProcedure from "../Procedures/SearchProcedure";
import SelectedProceduresTable from "../Procedures/SelectedProceduresTable";
import SearchSpecialist from "../Specialists/SearchSpecialist";
import SelectedSpecialistsTable from "../Specialists/SelectedSpecialistsTable";

import type { IExam } from "../../api/examsApi";
import type { IMedication } from "../../api/medicationsApi";
import type { IProcedure } from "../../api/proceduresApi";
import type { ISpecialist } from "../../api/specialistsApi";

import ReportActions from "./ReportActions";
import ReportComments from "./ReportComments";
import ReportSection from "./ReportSection";

import type { IHomeCare } from "../../api/homeCaresApi";
import SearchHomeCare from "../HomeCare/SearchHomeCare";
import SelectedHomeCaresTable from "../HomeCare/SelectedHomeCaresTable";
import { generateReportPDF } from "./pdf/generateReportPDF";

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
    const fetchPatientAndReport = async () => {
      if (!patientId) return;
      try {
        const [patientData, reportData] = await Promise.all([
          getPatientById(patientId),
          getReportByPatientId(patientId).catch(() => null),
        ]);
        setPatient(patientData);
        if (reportData) {
          setReportId(reportData._id || null);
          setSelectedExams(reportData.exams || []);
          setSelectedMedications(reportData.medications || []);
          setSelectedProcedures(reportData.procedures || []);
          setSelectedSpecialists(reportData.specialists || []);
          setSelectedHomeCares(reportData.homeCares || []);
          setComments(reportData.comments || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientAndReport();
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return alert("Пацієнт не вибраний!");

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
        alert("Звіт оновлено успішно!");
      } else {
        savedReport = await createReport(payload);
        alert("Звіт створено успішно!");
        setReportId(savedReport?._id ?? null);
      }

      if (savedReport) {
        setSelectedExams(savedReport.exams || []);
        setSelectedMedications(savedReport.medications || []);
        setSelectedProcedures(savedReport.procedures || []);
        setSelectedSpecialists(savedReport.specialists || []);
        setComments(savedReport.comments || "");
      }
    } catch (error) {
      console.error("Failed to save/update report:", error);
      alert("Помилка при збереженні звіту. Перевірте консоль.");
    }
  };

  if (loading) return <p>Завантаження даних пацієнта...</p>;
  if (!patient) return <p>Пацієнта не знайдено.</p>;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => window.history.back()}
        className="border border-green-200 rounded-lg py-1 px-2 mb-2 hover:bg-green-100"
      >
        Назад
      </button>

      <form
        onSubmit={handleSubmit}
        className="p-4 border border-green-200 rounded-lg shadow-sm w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Звіт для {patient.fullName}
        </h2>

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

        <ReportSection title="Спеціалісти">
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
      </form>
    </div>
  );
};

export default CreateReportForm;
