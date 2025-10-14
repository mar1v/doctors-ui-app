import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as patientsApi from "../api/patientsApi";
import { type IPatient } from "../api/patientsApi";

export const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<IPatient>>({});
  const limit = 5;

  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const response = await patientsApi.getAllPatients(page, limit, query);
      setPatients(response.patients);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Помилка при завантаженні пацієнтів:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, query]);

  const calculateAge = (birthDate: string | Date) => {
    const date = new Date(birthDate);
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  const handleAddPatient = async () => {
    try {
      await patientsApi.createPatient(newPatient as IPatient);
      alert("Пацієнт доданий успішно!");
      setShowModal(false);
      setNewPatient({});
      fetchPatients();
    } catch (error) {
      console.error(error);
      alert("Не вдалося додати пацієнта.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
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
            <li key={p._id} className="border p-2 rounded-md">
              <div className="font-semibold">
                {p.fullName}
                <div className="text-sm text-gray-600">
                  Вік: {calculateAge(p.birthDate)} | Діагноз:{" "}
                  {p.diagnosis || "нема"} | Телефон:
                  {p.phoneNumber}
                  <button
                    onClick={() => navigate(`/create-report/${p._id}`)}
                    className="px-3 py-1 border rounded flex gap-2 items-center mt-2"
                  >
                    Карта пацієнта
                  </button>
                </div>
              </div>
            </li>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Додати пацієнта</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="ПІБ"
                value={newPatient.fullName || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, fullName: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="YYYY-MM-DD"
                value={
                  newPatient.birthDate
                    ? typeof newPatient.birthDate === "string"
                      ? newPatient.birthDate
                      : newPatient.birthDate.toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 8) val = val.slice(0, 8);

                  if (val.length >= 5)
                    val = `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(
                      6
                    )}`;
                  else if (val.length >= 3)
                    val = `${val.slice(0, 4)}-${val.slice(4)}`;

                  setNewPatient({
                    ...newPatient,
                    birthDate: val.length === 10 ? new Date(val) : val,
                  });
                }}
                className="border p-2 rounded w-full"
              />

              <input
                type="text"
                placeholder="Телефон"
                value={newPatient.phoneNumber || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, phoneNumber: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={newPatient.email || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, email: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Діагноз"
                value={newPatient.diagnosis || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, diagnosis: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Скасувати
              </button>
              <button
                onClick={handleAddPatient}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
