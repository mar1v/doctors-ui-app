import type { IPatient } from "#api/patientsApi";
import React from "react";

interface Props {
  reportId: string | null;
  patient: IPatient;
  onExport: () => void;
}

const ReportActions: React.FC<Props> = ({ reportId, onExport }) => (
  <div className="flex gap-2 mt-4">
    <button
      type="submit"
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      {reportId ? "Оновити звіт" : "Створити звіт"}
    </button>
    <button
      type="button"
      onClick={onExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Експортувати PDF
    </button>
  </div>
);

export default ReportActions;
