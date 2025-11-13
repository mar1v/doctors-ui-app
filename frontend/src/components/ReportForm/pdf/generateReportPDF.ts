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
  procedures: (IProcedure & { comment?: string })[];
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
    const logoHeight = 15;
    const logoX = (pageWidth - logoWidth) / 2;
    pdf.addImage(logoBase64, "PNG", logoX, y - 8, logoWidth, logoHeight);
  } catch {
    toast.error("Не вдалося завантажити логотип для PDF");
  }

  y += 25;

  pdf.setFont("Noah", "bold");
  pdf.setFontSize(13);
  pdf.text("Рекомендаційний лист", pageWidth / 2, y, { align: "center" });

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
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });
    y += 6;
  };

  // --- Спеціалісти ---
  if (specialists.length > 0) {
    addSection(
      "Рекомендована консультація суміжного спеціаліста",
      specialists.map((s) => s.name)
    );
  }

  // --- Обстеження ---
  if (exams.length > 0) {
    addSection(
      "Рекомендовані обстеження",
      exams.map((e) => `${e.name}\n· ${e.recommendation}`)
    );
  }

  // --- Домашній догляд ---
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
      product: 22,
      morning: pageWidth / 2 + 10,
      evening: pageWidth - 30,
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
        const split = pdf.splitTextToSize(text, pageWidth / 2 - 40);

        pdf.setFont("Noah", "normal");
        pdf.setFontSize(10);
        pdf.text(split, colX.product - 8, y);

        const lineHeight = split.length * 5;
        const rectY = y - 3.5;

        if (h.morning) pdf.rect(colX.morning, rectY, 4, 4, "F");
        else pdf.rect(colX.morning, rectY, 4, 4);

        if (h.evening) pdf.rect(colX.evening, rectY, 4, 4, "F");
        else pdf.rect(colX.evening, rectY, 4, 4);

        y += lineHeight + 3;
      }

      y += 5;
    }
  }

  // --- Протокол процедур (етапи) ---
  if (procedureStages && procedureStages.length > 0) {
    pdf.setFont("Noah", "bold");
    pdf.setFontSize(12);
    pdf.text("Протокол процедур:", 14, y);
    y += 8;

    for (const [i, stage] of procedureStages.entries()) {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      // Назва етапу
      pdf.setFont("Noah", "bold");
      pdf.setFontSize(11);
      pdf.text(`${stage.title || `Етап ${i + 1}`}`, 16, y);
      y += 5;

      // Список процедур
      pdf.setFont("Noah", "normal");
      pdf.setFontSize(10);

      if (!stage.procedures.length) {
        pdf.text("—", 20, y);
        y += 6;
        continue;
      }

      for (const proc of stage.procedures) {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }

        const name = proc.name || "Процедура";
        const comment = proc.comment?.trim() ? `${proc.comment}` : "";

        const textLines = [name];
        if (comment) textLines.push("• " + comment);

        const split = pdf.splitTextToSize(textLines.join("\n"), pageWidth - 28);
        pdf.text(split, 20, y);
        y += split.length * 5 + 3;
      }
    }

    pdf.setFont("Noah", "italic");
    pdf.setFontSize(10);
    y += 10;
  }
  // --- Протокол процедур (без етапів) ---
  if (procedures.length > 0) {
    addSection(
      "Рекомендації щодо процедур",
      procedures.map((p) => `${p.name}\n· ${p.recommendation}`)
    );
  }

  // --- Інформація ---
  if (additionalInfo?.trim()) {
    addSection("Все, що необхідно знати про ваш стан", [additionalInfo]);
  }

  if (comments?.trim()) {
    addSection("Додаткова інформація", [comments]);
  }

  // --- Нумерація сторінок ---
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
