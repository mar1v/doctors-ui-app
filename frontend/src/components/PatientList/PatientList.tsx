import React, { useCallback, useEffect, useState } from "react";
import type { IPatient } from "../../api/patientsApi";
import * as patientsApi from "../../api/patientsApi";
import PatientFormModal, { type IPatientForm } from "./PatientFormModal";
import PatientItem from "./PatientItem";

export const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState<IPatientForm>();

  const limit = 5;

  const fetchPatients = useCallback(async () => {
    try {
      const response = await patientsApi.getAllPatients(page, limit, query);
      setPatients(response.patients);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Помилка при завантаженні пацієнтів:", error);
    }
  }, [page, query]);

  useEffect(() => {
    const delayDebounce = setTimeout(fetchPatients, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchPatients]);

  const handleAddPatient = async (patient: IPatientForm) => {
    try {
      const dataToSend = {
        ...patient,
        birthDate:
          typeof patient.birthDate === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(patient.birthDate)
            ? new Date(patient.birthDate)
            : undefined,
      };
      await patientsApi.createPatient(dataToSend as IPatient);
      alert("Пацієнт доданий успішно!");
      setShowModal(false);
      setNewPatient(undefined);
      fetchPatients();
    } catch (error) {
      console.error(error);
      alert("Не вдалося додати пацієнта.");
    }
  };

  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded w-full"
          placeholder="Пошук пацієнта..."
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Додати пацієнта
        </button>
      </div>

      {patients.length === 0 ? (
        <p className="text-gray-500">Пацієнтів не знайдено</p>
      ) : (
        <ul className="space-y-2">
          {patients.map((p) => (
            <PatientItem key={p._id} patient={p} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Назад
          </button>
          <span>
            Сторінка {page} з {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Далі
          </button>
        </div>
      )}

      <PatientFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddPatient}
        patient={newPatient}
      />
    </div>
  );
};

export default PatientList;
