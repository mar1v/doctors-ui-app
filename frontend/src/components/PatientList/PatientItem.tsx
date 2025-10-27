import type { IPatient } from "#api/patientsApi";
import { getReportByPatientId } from "#api/reportsApi";
import { generateReportPDF } from "#components/ReportForm/pdf/generateReportPDF";
import React from "react";
import { useNavigate } from "react-router-dom";

const PatientItem: React.FC<{ patient: IPatient }> = ({ patient }) => {
  const navigate = useNavigate();

  const handleExportPDF = async () => {
    try {
      const report = await getReportByPatientId(patient._id!);
      await generateReportPDF({
        patient,
        exams: report.exams || [],
        medications: report.medications || [],
        procedures: report.procedures || [],
        specialists: report.specialists || [],
        homeCares: report.homeCares || [],
        comments: report.comments || "",
      });
    } catch {
      alert("Не вдалося створити PDF — можливо, звіт ще не створено.");
    }
  };

  return (
    <li className="border p-3 rounded-md shadow-sm flex flex-col gap-2">
      <div className="font-semibold text-lg">{patient.fullName}</div>

      <div className="flex gap-3 mt-2 justify-end">
        <button
          onClick={() => navigate(`/create-report/${patient._id}`)}
          className="px-3 py-1 border border-green-300 text-green-700 rounded hover:bg-green-100"
        >
          Карта пацієнта
        </button>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-auto"
        >
          Експортувати PDF
        </button>
      </div>
    </li>
  );
};

export default PatientItem;
