import type { IExam } from "#api/examsApi";
import type { IHomeCare } from "#api/homeCaresApi";
import type { IMedication } from "#api/medicationsApi";
import type { IPatient } from "#api/patientsApi";
import type { IProcedure } from "#api/proceduresApi";
import type { ISpecialist } from "#api/specialistsApi";
import logoUrl from "#assets/logo.png";
import NoahBoldTTFUrl from "#fonts/Noah-Bold.ttf";
import NoahTTFUrl from "#fonts/Noah-Regular.ttf";
import { jsPDF } from "jspdf";

interface GenerateReportPDFParams {
  patient: IPatient;
  exams: IExam[];
  medications: IMedication[];
  procedures: IProcedure[];
  specialists: ISpecialist[];
  homeCares: IHomeCare[];
  additionalInfo: string;
  comments: string;
}

export const generateReportPDF = async ({
  patient,
  exams,
  medications,
  procedures,
  specialists,
  homeCares,
  additionalInfo,
  comments,
}: GenerateReportPDFParams) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const loadFont = async (url: string) => {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  };

  const [noahBase64, noahBoldBase64] = await Promise.all([
    loadFont(NoahTTFUrl),
    loadFont(NoahBoldTTFUrl),
  ]);

  pdf.addFileToVFS("Noah-Regular.ttf", noahBase64);
  pdf.addFont("Noah-Regular.ttf", "Noah", "normal");
  pdf.addFileToVFS("Noah-Bold.ttf", noahBoldBase64);
  pdf.addFont("Noah-Bold.ttf", "Noah", "bold");

  pdf.setFont("Noah", "normal");
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
    const logoHeight = 12;
    const logoX = (pageWidth - logoWidth) / 2;
    pdf.addImage(logoBase64, "PNG", logoX, y - 8, logoWidth, logoHeight);
  } catch {
    console.log("Не вдалося завантажити логотип для PDF");
  }

  y += 25;

  pdf.setFont("Noah", "bold");
  pdf.setFontSize(13);
  pdf.text("Рекомендаційний лист", 14, y);

  pdf.setFont("Noah", "normal");
  pdf.setFontSize(12);
  pdf.text(patient.fullName || "", 14, y + 7);
  y += 15;

  const addSection = (title: string, lines: string[]) => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont("Noah", "bold");
    pdf.setFontSize(12);
    pdf.text(`${title}:`, 14, y);
    y += 6;

    pdf.setFont("Noah", "normal");
    pdf.setFontSize(11);

    if (lines.length === 0) lines = ["—"];

    lines.forEach((line) => {
      const split = pdf.splitTextToSize(line, pageWidth - 28);
      pdf.text(split, 18, y);
      y += split.length * 6;
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });
    y += 6;
  };

  addSection(
    "Рекомендована консультація суміжного спеціаліста",
    specialists.map((s) => s.name)
  );

  addSection(
    "Рекомендовані обстеження",
    exams.map((e) => `${e.name}\n· ${e.recommendation}`)
  );

  addSection(
    "Рекомендовані засоби",
    medications.map((m) => `${m.name}\n· ${m.recommendation}`)
  );

  if (homeCares.length > 0) {
    pdf.setFont("Noah", "bold");
    pdf.setFontSize(12);
    pdf.text("Домашній догляд:", 14, y);
    y += 8;

    pdf.setFont("Noah", "bold");
    pdf.setFontSize(11);
    pdf.text("Ранок", pageWidth - 40, y - 8);
    pdf.text("Вечір", pageWidth - 20, y - 8);

    pdf.setFont("Noah", "normal");
    pdf.setFontSize(11);

    homeCares.forEach((h) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(`• ${h.name}`, 18, y);

      if (h.morning) pdf.rect(pageWidth - 42, y - 4, 4, 4, "F");
      else pdf.rect(pageWidth - 42, y - 4, 4, 4);

      if (h.evening) pdf.rect(pageWidth - 22, y - 4, 4, 4, "F");
      else pdf.rect(pageWidth - 22, y - 4, 4, 4);

      y += 8;
    });

    y += 6;
  }

  addSection(
    "Протокол процедур",
    procedures.map((p) => `${p.name}\n· ${p.recommendation}`)
  );

  if (additionalInfo && additionalInfo.trim()) {
    addSection("Все, що необхідно знати про ваш стан", [additionalInfo]);
  }

  if (comments && comments.trim()) {
    addSection("Додаткова інформація", [comments]);
  }

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont("Noah", "normal");
    pdf.setFontSize(10);
    pdf.text(
      `Сторінка ${i} з ${totalPages}`,
      pageWidth - 32,
      pdf.internal.pageSize.getHeight() - 10
    );
  }

  pdf.save(
    `Рекомендаційний_лист_${
      patient.fullName?.replace(/\s+/g, "_") ?? "Пацієнт"
    }.pdf`
  );
};
