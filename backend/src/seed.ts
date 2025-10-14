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

    // Очистка колекцій
    await Promise.all([
      Exam.deleteMany({}),
      Procedure.deleteMany({}),
      Medication.deleteMany({}),
      Specialist.deleteMany({}),
      Patient.deleteMany({}),
    ]);

    // ---- SEED BASE DATA ----
    await Exam.insertMany([
      { name: "Blood Test", recommendation: "Do in the morning, fasting" },
      { name: "X-Ray", recommendation: "Chest X-Ray for lungs check" },
      { name: "MRI", recommendation: "Requires appointment in advance" },
    ]);

    await Procedure.insertMany([
      { name: "Physiotherapy", recommendation: "3 times per week" },
      { name: "Massage", recommendation: "Back massage, 10 sessions" },
      { name: "Ultrasound Therapy", recommendation: "Daily, 15 min" },
    ]);

    await Medication.insertMany([
      { name: "Paracetamol", recommendation: "500mg every 8 hours after food" },
      { name: "Ibuprofen", recommendation: "200mg 2 times a day" },
      { name: "Vitamin C", recommendation: "1 tablet daily in the morning" },
    ]);

    await Specialist.insertMany([
      { name: "Cardiologist" },
      { name: "Neurologist" },
      { name: "Orthopedist" },
      { name: "Psychologist" },
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

    // продублюємо щоб було більше (наприклад 30)
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
