import React from "react";
import { useNavigate } from "react-router-dom";
import type { IPatient } from "../../api/patientsApi";

interface Props {
  patient: IPatient;
}

export const PatientItem: React.FC<Props> = ({ patient }) => {
  const navigate = useNavigate();

  const calculateAge = (birthDate: string | Date) => {
    const date = new Date(birthDate);
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <li className="border p-2 rounded-md">
      <div className="font-semibold">{patient.fullName}</div>
      <div className="text-sm text-gray-600">
        Вік: {calculateAge(patient.birthDate)} | Діагноз:{" "}
        {patient.diagnosis || "нема"} | Телефон: {patient.phoneNumber}
        <button
          onClick={() => navigate(`/create-report/${patient._id}`)}
          className="px-3 py-1 border rounded flex gap-2 items-center mt-2"
        >
          Карта пацієнта
        </button>
      </div>
    </li>
  );
};

export default PatientItem;
