import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById, type IPatient } from "../api/patientsApi";
import { createReport, getReportByPatientId } from "../api/reportsApi";

import SearchExam from "./Exams/SearchExam";
import SelectedExamsTable from "./Exams/SelectedExamsTable";
import SearchMedication from "./Medications/SearchMedication";
import SelectedMedicationsTable from "./Medications/SelectedMedicatonsTable";

import type { IExam } from "../api/examsApi";
import type { IMedication } from "../api/medicationsApi";

export const CreateReportForm: React.FC = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<IPatient | null>(null);

  const [selectedExams, setSelectedExams] = useState<IExam[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<IMedication[]>(
    []
  );
  const [comments, setComments] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientAndReport = async () => {
      try {
        if (!patientId) return;

        const [patientData, reportData] = await Promise.all([
          getPatientById(patientId),
          getReportByPatientId(patientId).catch(() => null),
        ]);

        setPatient(patientData);

        if (reportData) {
          setSelectedExams(reportData.exams || []);
          setSelectedMedications(reportData.medications || []);
          setComments(reportData.comments || "");
        } else {
          setSelectedExams([]);
          setSelectedMedications([]);
          setComments("");
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
    if (!patientId) {
      alert("No patient selected!");
      return;
    }

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
      procedures: [],
      specialists: [],
      comments,
    };

    try {
      await createReport(payload);
      alert("Report saved successfully!");

      const updatedReport = await getReportByPatientId(patientId);
      if (updatedReport) {
        setSelectedExams(updatedReport.exams || []);
        setSelectedMedications(updatedReport.medications || []);
        setComments(updatedReport.comments || "");
      }
    } catch (error) {
      console.error("Failed to create report:", error);
      alert("Failed to create report. Check console for details.");
    }
  };

  if (loading) return <p>Завантаження даних пацієнта...</p>;
  if (!patient) return <p>Пацієнта не знайдено.</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border border-green-200 rounded-lg shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-4">
        Звіт для {patient.fullName}
      </h2>

      {/* === Обстеження === */}
      <div className="mb-4">
        <h3 className="font-medium mb-2 text-green-700">Обстеження</h3>
        <SearchExam
          selectedExams={selectedExams}
          setSelectedExams={setSelectedExams}
          exams={[]}
        />
        <SelectedExamsTable
          selectedExams={selectedExams}
          setSelectedExams={setSelectedExams}
        />
      </div>

      {/* === Медикаменти === */}
      <div className="mb-4">
        <h3 className="font-medium mb-2 text-green-700">Медикаменти</h3>
        <SearchMedication
          selectedMedications={selectedMedications}
          setSelectedMedications={setSelectedMedications}
          medication={[]}
        />
        <SelectedMedicationsTable
          selectedMedications={selectedMedications}
          setSelectedMedications={setSelectedMedications}
        />
      </div>

      {/* === Коментарі === */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Коментарі:</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full px-2 py-1 border border-green-200 rounded-md text-sm mb-2 focus:ring-1 focus:ring-green-300"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Зберегти звіт
      </button>
    </form>
  );
};

export default CreateReportForm;
