import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import type { IExam } from "../../../api/examsApi";
import type { IMedication } from "../../../api/medicationsApi";
import type { IPatient } from "../../../api/patientsApi";
import type { IProcedure } from "../../../api/proceduresApi";
import type { ISpecialist } from "../../../api/specialistsApi";
import RobotoTTFUrl from "../../../fonts/Roboto-Regular.ttf";

interface GenerateReportPDFParams {
  patient: IPatient;
  exams: IExam[];
  medications: IMedication[];
  procedures: IProcedure[];
  specialists: ISpecialist[];
  comments: string;
}

export const generateReportPDF = async ({
  patient,
  exams,
  medications,
  procedures,
  specialists,
  comments,
}: GenerateReportPDFParams) => {
  const pdf = new jsPDF();

  const res = await fetch(RobotoTTFUrl);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  pdf.addFileToVFS("Roboto-Regular.ttf", base64);
  pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  pdf.setFont("Roboto");

  const primaryColor: [number, number, number] = [34, 197, 94];
  const textGray: [number, number, number] = [60, 60, 60];
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 25, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.text("Звіт пацієнта", pageWidth / 2, 15, { align: "center" });

  pdf.setTextColor(...textGray);
  pdf.setFontSize(12);
  pdf.text(`Пацієнт: ${patient.fullName}`, 14, 35);
  pdf.text(`Дата: ${new Date().toLocaleDateString()}`, 14, 40);

  const addSection = (title: string, head: string[], body: RowInput[]) => {
    const prevY = pdf.lastAutoTable?.finalY ?? 55;
    const startY = prevY + 15;
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
    "Процедури",
    ["Назва", "Рекомендація"],
    procedures.map((p) => [p.name, p.recommendation])
  );
  addSection(
    "Засоби",
    ["Назва", "Рекомендація"],
    medications.map((m) => [m.name, m.recommendation])
  );
  addSection(
    "Обстеження",
    ["Назва", "Рекомендація"],
    exams.map((e) => [e.name, e.recommendation])
  );
  addSection(
    "Спеціалісти",
    ["Ім'я"],
    specialists.map((s) => [s.name])
  );

  if (comments.trim()) {
    const prevY = pdf.lastAutoTable?.finalY ?? 55;
    const startY = prevY + 15;
    pdf.setFontSize(14);
    pdf.setTextColor(...primaryColor);
    pdf.text("Коментарі", 14, startY);
    const split = pdf.splitTextToSize(comments, pageWidth - 28);
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
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
