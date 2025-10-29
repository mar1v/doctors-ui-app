import type { IPatient } from "#api/patientsApi";
import * as patientsApi from "#api/patientsApi";
import PatientFormModal from "#components/PatientList/PatientFormModal";
import PatientItem from "#components/PatientList/PatientItem";
import React, { useCallback, useEffect, useState } from "react";

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const limit = 5;

  const fetchPatients = useCallback(async () => {
    const response = await patientsApi.getAllPatients(page, limit, query);
    setPatients(response.patients);
    setTotalPages(response.totalPages);
  }, [page, query]);

  useEffect(() => {
    const delay = setTimeout(fetchPatients, 400);
    return () => clearTimeout(delay);
  }, [fetchPatients]);

  const handleAddPatient = async (patient: IPatient) => {
    await patientsApi.createPatient(patient);
    setShowModal(false);
    fetchPatients();
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-start bg-gray-50 
      px-3 py-6 sm:px-6 md:px-8 lg:px-12 xl:px-16"
    >
      <div
        className="
          w-full flex flex-col bg-white shadow-lg rounded-2xl 
          p-5 sm:p-6 md:p-8
          transition-all duration-300
          max-w-[1200px] xl:max-w-[1400px]
          md:w-[90%] xl:w-[75%] 2xl:w-[65%]
        "
      >
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="border p-3 rounded-lg w-full sm:flex-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Пошук пацієнта..."
          />
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition w-full sm:w-auto"
          >
            Створити карту пацієнта
          </button>
        </div>

        <div className="flex-1 ">
          {patients.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-lg">
              Пацієнтів не знайдено
            </p>
          ) : (
            <ul
              className="
              flex flex-col gap-4
              "
            >
              {patients.map((p) => (
                <PatientItem key={p._id} patient={p} />
              ))}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-3 mt-6 justify-center text-sm sm:text-base">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Назад
            </button>
            <span className="text-gray-700 font-medium">
              Сторінка {page} з {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Далі
            </button>
          </div>
        )}
      </div>
      <PatientFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddPatient}
        patient={{ fullName: "" }}
      />
    </div>
  );
};

export default PatientList;
