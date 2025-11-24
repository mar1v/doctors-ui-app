import type { IExam } from "#api/examsApi";
import type { IHomeCare } from "#api/homeCaresApi";
import { getAllHomeCares } from "#api/homeCaresApi";
import type { IMedication } from "#api/medicationsApi";
import type { IPatient } from "#api/patientsApi";
import type { IProcedure } from "#api/proceduresApi";
import type { ISpecialist } from "#api/specialistsApi";
import logoUrl from "#assets/logo.png";
import NoahBoldTTFUrl from "#fonts/Noah-Bold.ttf";
import NoahTTFUrl from "#fonts/Noah-Regular.ttf";
import { jsPDF } from "jspdf";
import { toast } from "react-hot-toast/headless";

interface IProcedureStage {
  title: string;
  procedures: (IProcedure & { comment?: string; price?: number })[];
}

interface GenerateReportPDFParams {
  patient: IPatient;
  exams: IExam[];
  medications: IMedication[];
  procedures: IProcedure[];
  procedureStages?: IProcedureStage[];
  specialists: ISpecialist[];
  homeCares: IHomeCare[];
  additionalInfo: string;
  comments: string;
}

export const generateReportPDF = async ({
  patient,
  exams,
  procedures,
  procedureStages = [],
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
  let y = 15;

  try {
    const logoRes = await fetch(logoUrl);
    const logoBlob = await logoRes.blob();
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });

    const logoWidth = 28;
    const logoHeight = 17;
    const logoX = (pageWidth - logoWidth) / 2;

    pdf.addImage(logoBase64, "PNG", logoX, y, logoWidth, logoHeight);
  } catch {
    toast.error("Не вдалося завантажити логотип для PDF.");
  }

  y += 28;

  pdf.setFont("Noah", "bold");
  pdf.setFontSize(14);
  pdf.text("РЕКОМЕНДАЦІЙНИЙ ЛИСТ", pageWidth / 2, y, { align: "center" });

  y += 12;

  pdf.setFont("Noah", "bold");
  pdf.setFontSize(12);
  pdf.text("Пацієнт: ", 14, y + 7);

  pdf.setFont("Noah", "normal");
  pdf.setFontSize(12);
  pdf.text(patient.fullName || "", 30, y + 7);

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
      if (y > 285) {
        pdf.addPage();
        y = 20;
      }
    });
    y += 6;
  };

  if (specialists.length > 0) {
    addSection(
      "Рекомендована консультація суміжного спеціаліста",
      specialists.map((s) => s.name)
    );
  }

  if (exams.length > 0) {
    addSection(
      "Рекомендовані обстеження",
      exams.map((e) => `${e.name}\n· ${e.recommendation}`)
    );
  }

  if (homeCares.length > 0) {
    pdf.setFont("Noah", "bold");
    pdf.setFontSize(12);
    pdf.text("Домашній догляд", 14, y);
    y += 8;

    const [allCares, allMedications] = await Promise.all([
      getAllHomeCares(),
      (await import("#api/medicationsApi")).getAllMedications(),
    ]);

    const uniqueCategories = Array.from(
      new Set(allCares.map((c) => c.name?.trim()).filter(Boolean))
    );

    const normalize = (str?: string) =>
      str
        ?.toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[()]/g, "")
        .replace(/ml/g, "")
        .trim() || "";

    const colX = {
      product: 20,
      morning: pageWidth - 44,
      evening: pageWidth - 26,
      price: pageWidth - 14,
    };

    for (const category of uniqueCategories) {
      if (y > 260) {
        pdf.addPage();
        y = 20;
      }

      const items = homeCares.filter((h) => h.name === category);
      if (items.length === 0) {
        continue;
      }

      pdf.setFont("Noah", "bold");
      pdf.setFontSize(11);
      pdf.text(category, 16, y);
      y += 6;

      pdf.setFont("Noah", "bold");
      pdf.setFontSize(10);
      pdf.text("День", colX.morning, y);
      pdf.text("Ніч", colX.evening, y);
      pdf.text("Ціна", colX.price, y);
      y += 7;

      for (const h of items) {
        if (y > 260) {
          pdf.addPage();
          y = 20;
        }

        const found = allMedications.find(
          (m) =>
            normalize(m.name) === normalize(h.medicationName) ||
            normalize(m.name).includes(normalize(h.medicationName)) ||
            normalize(h.medicationName).includes(normalize(m.name))
        );

        const recommendation =
          found?.recommendation || "Рекомендацію не знайдено";
        const text = `${h.medicationName || "—"}\n· ${recommendation}`;
        const split = pdf.splitTextToSize(text, colX.morning - 30);

        pdf.setFont("Noah", "normal");
        pdf.setFontSize(10);
        pdf.text(split, colX.product, y);

        const lineHeight = split.length * 4;
        const rectY = y - 3;
        if (h.morning) pdf.rect(colX.morning, rectY, 4, 4, "F");
        else pdf.rect(colX.morning, rectY, 4, 4);

        if (h.evening) pdf.rect(colX.evening, rectY, 4, 4, "F");
        else pdf.rect(colX.evening, rectY, 4, 4);

        pdf.setFont("Noah", "normal");
        pdf.setFontSize(10);
        pdf.line(colX.price, y, colX.price + 8, y);

        y += lineHeight + 3;
      }

      y += 5;
    }
  }

  if (procedureStages && procedureStages.length > 0) {
    pdf.setFont("Noah", "bold");
    pdf.setFontSize(12);
    pdf.text("Протокол процедур:", 14, y);
    y += 8;

    const priceColumnX = 60;
    const priceLineWidth = 10;
    const textBlockWidth = priceColumnX - 30;

    for (const [i, stage] of procedureStages.entries()) {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFont("Noah", "bold");
      pdf.setFontSize(11);
      pdf.text(`${stage.title || `Етап ${i + 1}`}`, 16, y);

      pdf.setFont("Noah", "bold");
      pdf.setFontSize(10);
      pdf.text("Ціна", priceColumnX, y);

      y += 6;

      pdf.setFont("Noah", "normal");
      pdf.setFontSize(10);

      if (!stage.procedures.length) {
        pdf.text("—", 20, y);
        y += 6;
        continue;
      }

      for (const [idx, proc] of stage.procedures.entries()) {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }

        const name = idx > 0 ? `+ ${proc.name}` : proc.name;
        const comment = proc.comment?.trim() ? `• ${proc.comment}` : "";

        const lines = comment ? [name, comment] : [name];

        const split = pdf.splitTextToSize(lines.join("\n"), textBlockWidth);

        pdf.text(split, 20, y);

        const priceY = y + 1.2;
        pdf.line(priceColumnX, priceY, priceColumnX + priceLineWidth, priceY);

        y += split.length * 5 + 4;
      }

      y += 5;
    }

    y += 10;
  }

  if (procedures.length > 0) {
    addSection(
      "Рекомендації щодо процедур",
      procedures.map((p) => `${p.name}\n· ${p.recommendation}`)
    );
  }

  if (additionalInfo?.trim()) {
    addSection("Все, що необхідно знати про ваш стан", [additionalInfo]);
  }

  if (comments?.trim()) {
    addSection("Додаткова інформація", [comments]);
  }
  {
    const pageHeight = pdf.internal.pageSize.getHeight();

    const labelX = pageWidth - 60;
    const lineX = pageWidth - 60;
    const lineWidth = 50;
    const bottomY = pageHeight - 15;

    pdf.setFont("Noah", "bold");
    pdf.setFontSize(11);
    pdf.text("Лікар", labelX - 10, bottomY);

    pdf.line(lineX, bottomY, lineX + lineWidth, bottomY);
  }
  pdf.save(
    `Рекомендаційний_лист_${
      patient.fullName?.replace(/\s+/g, "_") ?? "Пацієнт"
    }.pdf`
  );
};
