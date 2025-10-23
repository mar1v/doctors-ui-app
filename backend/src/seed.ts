import dotenv from "dotenv";
import mongoose from "mongoose";

import Exam from "./models/ExamSchema";
import HomeCare from "./models/HomeCareSchema";
import Medication from "./models/MedicationSchema";
import Patient from "./models/PatientSchema";
import Procedure from "./models/ProcedureSchema";
import Specialist from "./models/SpecialistSchema";

dotenv.config({ path: "./src/config/.env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    await Promise.all([
      Exam.deleteMany({}),
      Procedure.deleteMany({}),
      Medication.deleteMany({}),
      Specialist.deleteMany({}),
      Patient.deleteMany({}),
      HomeCare.deleteMany({}),
    ]);

    // ---- SEED EXAMS ----
    await Exam.insertMany([
      {
        name: "УЗД щитовидної залози",
        recommendation:
          "Не потребує спеціальної підготовки. Рекомендовано проходити натще",
      },
      {
        name: "УЗД органів черевної порожнини (печінка, селезінка, жовчний міхур та протоки, підшлункова залоза)",
        recommendation:
          "Здійснюється строго натще. За 3 дні до обстеження виключити з раціону газоутворюючі продукти",
      },
      {
        name: "УЗД нирок",
        recommendation:
          "За годину до процедури випити 500-800 мл води. Не спорожнювати сечовий міхур",
      },
      {
        name: "ЕКГ (електрокардіограма)",
        recommendation:
          "Не потребує підготовки. Уникати фізичних навантажень за годину до процедури",
      },
    ]);

    // ---- SEED PROCEDURES ----
    await Procedure.insertMany([
      {
        name: "IPL (фототерапія)",
        recommendation:
          "Уникати сонячного опромінення за 2 тижні до та після процедури. Не застосовувати автозасмагу",
      },
      {
        name: "Led-терапія",
        recommendation:
          "Відмінити алкоголь 24 год до процедури. Не вживати каву. Курс 8-10 процедур 2 рази на тиждень",
      },
      {
        name: "Radiesse",
        recommendation:
          "Відмінити алкоголь 24 год до процедури. Не вживати каву. Уникати саун та спортзалу 3 дні після процедури",
      },
    ]);

    // ---- SEED MEDICATIONS ----
    await Medication.insertMany([
      {
        name: "ACA 3D бальзам для губ (15ml)",
        recommendation:
          "Нанесіть тонкий шар бальзаму 3D Lip Perfect на губи 2-3 рази на день",
      },
      {
        name: "ACA Bronz express (30ml) Краплі-сліво для обличчя та тіла",
        recommendation:
          "Додайте кілька крапель у денний крем або наносьте безпосередньо на шкіру. Використовувати ввечері",
      },
      {
        name: "ACA Дезодорант (50ml)",
        recommendation: "Наносьте на чисту суху шкіру пахв щоранку після душу",
      },
      {
        name: "ACA Королівський крем для рук (30ml)",
        recommendation:
          "Розподіліть невелику кількість крему по шкірі рук легкими масажними рухами 2-3 рази на день",
      },
      {
        name: "ACA Крем для рук Полінезія (30ml)",
        recommendation:
          "Наносьте на руки легкими масажними рухами після кожного миття рук або за потреби",
      },
    ]);

    // ---- SEED SPECIALISTS ----
    await Specialist.insertMany([
      { name: "Кардіолог" },
      { name: "Невролог" },
      { name: "Ортопед" },
      { name: "Психолог" },
      { name: "Дерматолог" },
      { name: "Ендокринолог" },
      { name: "Гастроентеролог" },
      { name: "Отоларинголог (ЛОР)" },
      { name: "Офтальмолог" },
      { name: "Уролог" },
    ]);

    // ---- SEED HOME CARE (ДОМАШНІЙ ДОГЛЯД) ----
    await HomeCare.insertMany([
      {
        name: "Обличчя",
        morning: false,
        day: false,
        evening: false,
      },
      {
        name: "Тіло",
        morning: false,
        day: false,
        evening: false,
      },
      {
        name: "Волосся",
        morning: false,
        day: false,
        evening: false,
      },
    ]);

    // ---- SEED PATIENTS ----
    const patients = [
      {
        fullName: "Шевченко Олександр Петрович",
      },
      {
        fullName: "Коваль Ірина Володимирівна",
      },
      {
        fullName: "Мельник Сергій Андрійович",
      },
      {
        fullName: "Ткаченко Ольга Василівна",
      },
      {
        fullName: "Кравченко Дмитро Михайлович",
      },
      {
        fullName: "Онищенко Наталія Юріївна",
      },
      {
        fullName: "Кузьменко Владислав Ігорович",
      },
      {
        fullName: "Романюк Аліна Степанівна",
      },
      {
        fullName: "Бондаренко Андрій Олегович",
      },
      {
        fullName: "Лисенко Тетяна Петрівна",
      },
    ];

    await Patient.insertMany(patients);
    console.log(`Inserted ${patients.length} patients`);

    console.log("Database seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
