import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById, type IPatient } from "../api/patientsApi";
import {
  createReport,
  getReportByPatientId,
  updateReport,
  type IReport,
} from "../api/reportsApi";

import SearchExam from "./Exams/SearchExam";
import SelectedExamsTable from "./Exams/SelectedExamsTable";
import SearchMedication from "./Medications/SearchMedication";
import SelectedMedicationsTable from "./Medications/SelectedMedicatonsTable";
import SearchProcedure from "./Procedures/SearchProcedure";
import SelectedProceduresTable from "./Procedures/SelectedProceduresTable";
import SearchSpecialist from "./Specialists/SearchSpecialist";
import SelectedSpecialistsTable from "./Specialists/SelectedSpecialistsTable";

import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";

import RobotoTTFUrl from "../fonts/Roboto-Regular.ttf";

import type { IExam } from "../api/examsApi";
import type { IMedication } from "../api/medicationsApi";
import type { IProcedure } from "../api/proceduresApi";
import type { ISpecialist } from "../api/specialistsApi";

export const CreateReportForm: React.FC = () => {
  interface JsPDFWithPlugin extends jsPDF {
    lastAutoTable?: { finalY: number };
    internal: jsPDF["internal"] & { pages: unknown[] };
  }

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
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);

  const [base64Font, setBase64Font] = useState<string | null>(null);

  useEffect(() => {
    const loadFont = async () => {
      const res = await fetch(RobotoTTFUrl);
      const arrayBuffer = await res.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setBase64Font(base64);
    };
    loadFont();
  }, []);

  useEffect(() => {
    const fetchPatientAndReport = async () => {
      if (!patientId) return;
      try {
        const [patientData, reportData] = await Promise.all([
          getPatientById(patientId),
          getReportByPatientId(patientId).catch(
            () => null
          ) as Promise<IReport | null>,
        ]);
        setPatient(patientData);
        if (reportData) {
          setReportId(reportData._id || null);
          setSelectedExams(reportData.exams || []);
          setSelectedMedications(reportData.medications || []);
          setSelectedProcedures(reportData.procedures || []);
          setSelectedSpecialists(reportData.specialists || []);
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

  const handleExportPDF = async () => {
    if (!patient) return alert("Немає даних пацієнта");
    if (!base64Font) return alert("Шрифт ще не завантажено, зачекайте");

    const pdf = new jsPDF() as JsPDFWithPlugin;

    pdf.addFileToVFS("Roboto-Regular.ttf", base64Font);
    pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    pdf.setFont("Roboto");
    pdf.setFontSize(12);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const primaryColor: [number, number, number] = [34, 197, 94];
    const textGray: [number, number, number] = [60, 60, 60];

    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 25, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text("Звіт пацієнта", pageWidth / 2, 15, { align: "center" });

    pdf.setTextColor(...textGray);
    pdf.setFontSize(12);
    pdf.text(`Пацієнт: ${patient.fullName} `, 14, 35);
    pdf.text(`Дата: ${new Date().toLocaleDateString()}`, 14, 40);

    const addSection = (title: string, head: string[], body: RowInput[]) => {
      const previousY = pdf.lastAutoTable?.finalY ?? 55;
      const startY = previousY + 15;

      pdf.setFontSize(14);
      pdf.setTextColor(...primaryColor);
      pdf.text(title, 14, startY - 3);

      autoTable(pdf, {
        startY,
        head: [head],
        body: body.length
          ? body.map((row) =>
              Array.isArray(row) ? row.map((c) => c ?? "—") : [row ?? "—"]
            )
          : [head.map(() => "—")],
        theme: "grid",
        styles: {
          font: "Roboto",
          fontStyle: "normal",
          fontSize: 11,
          cellPadding: 3,
          textColor: [0, 0, 0],
        },
        headStyles: {
          font: "Roboto",
          fontStyle: "normal",
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          halign: "center",
          valign: "middle",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });
    };

    addSection(
      "Обстеження",
      ["Назва", "Рекомендація"],
      selectedExams.map((e) => [e.name ?? "—", e.recommendation ?? "—"])
    );
    addSection(
      "Медикаменти",
      ["Назва", "Рекомендація"],
      selectedMedications.map((m) => [m.name ?? "—", m.recommendation ?? "—"])
    );
    addSection(
      "Процедури",
      ["Назва", "Рекомендація"],
      selectedProcedures.map((p) => [p.name ?? "—", p.recommendation ?? "—"])
    );
    addSection(
      "Спеціалісти",
      ["Ім'я"],
      selectedSpecialists.map((s) => [s.name ?? "—"])
    );

    if (comments.trim()) {
      const previousY = pdf.lastAutoTable?.finalY ?? 55;
      const startY = previousY + 15;
      pdf.setFontSize(14);
      pdf.setTextColor(...primaryColor);
      pdf.text("Коментарі", 14, startY);

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const split = pdf.splitTextToSize(comments, pageWidth - 28);
      pdf.text(split, 14, startY + 7);
    }

    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("Roboto");
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(
        `Сторінка ${i} з ${totalPages}`,
        pageWidth - 30,
        pdf.internal.pageSize.getHeight() - 10
      );
    }

    pdf.save(`Звіт_${patient.fullName?.replace(/\s+/g, "_") ?? "Пацієнт"}.pdf`);
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
        <div id="report-content" className="pdf-safe">
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            Звіт для {patient.fullName}
          </h2>

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-green-600">Обстеження</h3>
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

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-green-600">Медикаменти</h3>
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

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-green-600">Процедури</h3>
            <SearchProcedure
              selectedProcedures={selectedProcedures}
              setSelectedProcedures={setSelectedProcedures}
            />
            <SelectedProceduresTable
              selectedProcedures={selectedProcedures}
              setSelectedProcedures={setSelectedProcedures}
            />
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-green-600">Спеціалісти</h3>
            <SearchSpecialist
              selectedSpecialists={selectedSpecialists}
              setSelectedSpecialists={setSelectedSpecialists}
            />
            <SelectedSpecialistsTable
              selectedSpecialists={selectedSpecialists}
              setSelectedSpecialists={setSelectedSpecialists}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Коментарі:</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-2 py-1 border border-green-200 rounded-md text-sm mb-2 focus:ring-1 focus:ring-green-300"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {reportId ? "Оновити звіт" : "Створити звіт"}
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Експортувати PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportForm;
