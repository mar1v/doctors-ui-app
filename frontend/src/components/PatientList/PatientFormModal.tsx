import React, { useEffect, useState } from "react";
import type { IPatient } from "../../api/patientsApi";

export interface IPatientForm extends Omit<Partial<IPatient>, "birthDate"> {
  birthDate?: string | Date;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (patient: IPatientForm) => void;
  patient?: IPatientForm;
}

export const PatientFormModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  patient,
}) => {
  const [form, setForm] = useState<IPatientForm>(
    patient || {
      fullName: "",
      birthDate: "",
      phoneNumber: "",
      email: "",
      diagnosis: "",
    }
  );

  useEffect(() => {
    if (patient) setForm(patient);
  }, [patient]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">Додати пацієнта</h2>
        <div className="space-y-2">
          {["fullName", "birthDate", "phoneNumber", "email", "diagnosis"].map(
            (field) => (
              <input
                key={field}
                type={
                  field === "birthDate"
                    ? "date"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                placeholder={
                  field === "fullName"
                    ? "ПІБ"
                    : field === "birthDate"
                    ? "Дата народження"
                    : field === "phoneNumber"
                    ? "Телефон"
                    : field === "email"
                    ? "Email"
                    : "Діагноз"
                }
                value={
                  form[field as keyof IPatientForm]
                    ? field === "birthDate" && form.birthDate instanceof Date
                      ? form.birthDate.toISOString().slice(0, 10)
                      : (form[field as keyof IPatientForm] as string)
                    : ""
                }
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="border p-2 rounded w-full"
              />
            )
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Скасувати
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientFormModal;
