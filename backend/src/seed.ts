import dotenv from "dotenv";
import mongoose from "mongoose";

import Exam from "./models/ExamSchema";
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
    ]);

    // ---- SEED EXAMS (ІНСТРУМЕНТАЛЬНІ ОБСТЕЖЕННЯ) ----
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

    // ---- SEED PROCEDURES (ПРОЦЕДУРИ) ----
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

    // ---- SEED MEDICATIONS (ПРЕПАРАТИ ТА КОСМЕТИКА) ----
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

    // ---- SEED PATIENTS ----
    const patients = [
      {
        fullName: "Шевченко Олександр Петрович",
        phoneNumber: "+380671234567",
        birthDate: new Date("1990-01-01"),
        email: "oleksandr.shevchenko@example.com",
        diagnosis: "ГРВІ",
      },
      {
        fullName: "Коваль Ірина Володимирівна",
        phoneNumber: "+380932345678",
        birthDate: new Date("1995-02-15"),
        email: "iryna.koval@example.com",
        diagnosis: "Мігрень",
      },
      {
        fullName: "Мельник Сергій Андрійович",
        phoneNumber: "+380503456789",
        birthDate: new Date("1988-03-20"),
        email: "serhiy.melnyk@example.com",
        diagnosis: "Артрит",
      },
      {
        fullName: "Ткаченко Ольга Василівна",
        phoneNumber: "+380674567890",
        birthDate: new Date("1982-04-10"),
        email: "olha.tkachenko@example.com",
        diagnosis: "Гіпертонія",
      },
      {
        fullName: "Кравченко Дмитро Михайлович",
        phoneNumber: "+380995678901",
        birthDate: new Date("1987-05-25"),
        email: "dmytro.kravchenko@example.com",
        diagnosis: "Бронхіт",
      },
      {
        fullName: "Онищенко Наталія Юріївна",
        phoneNumber: "+380636789012",
        birthDate: new Date("1992-06-15"),
        email: "nataliya.onyshchenko@example.com",
        diagnosis: "Діабет",
      },
      {
        fullName: "Кузьменко Владислав Ігорович",
        phoneNumber: "+380977890123",
        birthDate: new Date("1997-07-05"),
        email: "vlad.kuzmenko@example.com",
        diagnosis: "Астма",
      },
      {
        fullName: "Романюк Аліна Степанівна",
        phoneNumber: "+380958901234",
        birthDate: new Date("1993-08-20"),
        email: "alina.romanyuk@example.com",
        diagnosis: "ГРВІ",
      },
      {
        fullName: "Бондаренко Андрій Олегович",
        phoneNumber: "+380669012345",
        birthDate: new Date("1989-09-10"),
        email: "andriy.bondarenko@example.com",
        diagnosis: "Астма",
      },
      {
        fullName: "Лисенко Тетяна Петрівна",
        phoneNumber: "+380680123456",
        birthDate: new Date("1986-10-15"),
        email: "tetyana.lysenko@example.com",
        diagnosis: "Артрит",
      },
    ];

    const repeatedPatients = Array.from({ length: 3 }, () => patients).flat();

    await Patient.insertMany(repeatedPatients);
    console.log(`✅ Inserted ${repeatedPatients.length} patients`);

    console.log("🎉 Database seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
