import { jsPDF } from "jspdf";
import type { IExam } from "../../../api/examsApi";
import type { IHomeCare } from "../../../api/homeCaresApi";
import type { IMedication } from "../../../api/medicationsApi";
import type { IPatient } from "../../../api/patientsApi";
import type { IProcedure } from "../../../api/proceduresApi";
import type { ISpecialist } from "../../../api/specialistsApi";
import logoUrl from "../../../assets/logo.png";
import RobotoTTFUrl from "../../../fonts/Roboto-Regular.ttf";

interface GenerateReportPDFParams {
  patient: IPatient;
  exams: IExam[];
  medications: IMedication[];
  procedures: IProcedure[];
  specialists: ISpecialist[];
  homeCares: IHomeCare[];
  comments: string;
}

export const generateReportPDF = async ({
  patient,
  exams,
  medications,
  procedures,
  specialists,
  homeCares,
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
  pdf.setTextColor(0, 0, 0);

  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 20;

  try {
    const logoRes = await fetch(logoUrl);
    const logoBlob = await logoRes.blob();
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });
    const logoWidth = 25;
    const logoHeight = 10;
    const logoX = (pageWidth - logoWidth) / 2;
    pdf.addImage(logoBase64, "PNG", logoX, y - 5, logoWidth, logoHeight);
  } catch {
    console.log("Не вдалося завантажити логотип для PDF");
  }

  y += 20;

  pdf.setFontSize(12);
  pdf.text(`Рекомендаційний лист: ${patient.fullName}`, 14, y);
  y += 7;

  const drawSeparator = () => {
    pdf.setDrawColor(180);
    pdf.line(14, y, pageWidth - 14, y);
    y += 6;
  };

  const addSection = (title: string, lines: string[]) => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
    drawSeparator();
    pdf.setFontSize(13);
    pdf.text(title.toUpperCase(), 14, y);
    y += 6;
    pdf.setFontSize(11);

    if (lines.length === 0) lines = ["— відсутні"];
    lines.forEach((line) => {
      const split = pdf.splitTextToSize(line, pageWidth - 28);
      pdf.text(split, 18, y);
      y += split.length * 6;
    });
    y += 4;
  };

  addSection(
    "Рекомендована консультація спеціаліста",
    specialists.map((s) => `• ${s.name}`)
  );

  addSection(
    "Рекомендовані обстеження",
    exams.map((e) => `• ${e.name}: ${e.recommendation}`)
  );

  addSection(
    "Рекомендовані засоби",
    medications.map((m) => `• ${m.name}: ${m.recommendation}`)
  );

  addSection(
    "Домашній догляд",
    homeCares.map((h) => {
      const times = [
        h.morning ? "ранок" : "",
        h.day ? "день" : "",
        h.evening ? "вечір" : "",
      ]
        .filter(Boolean)
        .join(", ");
      return `• ${h.name}${times ? ` (${times})` : ""}`;
    })
  );

  addSection(
    "Протокол процедур",
    procedures.map((p) => `• ${p.name}: ${p.recommendation}`)
  );

  if (comments.trim()) {
    addSection("Додаткова інформація", [comments]);
  }

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(
      `Сторінка ${i} з ${totalPages}`,
      pageWidth - 32,
      pdf.internal.pageSize.getHeight() - 10
    );
  }

  pdf.save(
    `Рекомендаційний лист_${
      patient.fullName?.replace(/\s+/g, "_") ?? "Пацієнт"
    }.pdf`
  );
};
