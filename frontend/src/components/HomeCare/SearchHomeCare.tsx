import { getAllHomeCares, type IHomeCare } from "#api/homeCaresApi";
import { searchMedicationsByName, type IMedication } from "#api/medicationsApi";
import { useEffect, useState } from "react";

interface Props {
  selectedHomeCares: IHomeCare[];
  setSelectedHomeCares: React.Dispatch<React.SetStateAction<IHomeCare[]>>;
}

const SearchHomeCare: React.FC<Props> = ({
  selectedHomeCares,
  setSelectedHomeCares,
}) => {
  const [allHomeCares, setAllHomeCares] = useState<IHomeCare[]>([]);
  const [selectedCare, setSelectedCare] = useState<IHomeCare | null>(null);

  const [searchMed, setSearchMed] = useState("");
  const [resultsMed, setResultsMed] = useState<IMedication[]>([]);
  const [loadingMed, setLoadingMed] = useState(false);
  const [loadingCares, setLoadingCares] = useState(true);

  useEffect(() => {
    const fetchCares = async () => {
      try {
        setLoadingCares(true);
        const data = await getAllHomeCares();
        setAllHomeCares(data);
      } finally {
        setLoadingCares(false);
      }
    };
    fetchCares();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchMed.trim()) {
        setResultsMed([]);
        return;
      }
      setLoadingMed(true);
      try {
        const res = await searchMedicationsByName(searchMed.trim());
        setResultsMed(res);
      } finally {
        setLoadingMed(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchMed]);

  const addHomeCare = (medication: IMedication) => {
    if (!selectedCare) return;
    const uniqueKey = `${selectedCare._id}-${medication._id}`;

    if (selectedHomeCares.some((h) => h._id === uniqueKey)) return;

    const careWithMedication: IHomeCare = {
      ...selectedCare,
      _id: uniqueKey,
      medicationName: medication.name,
      morning: false,
      evening: false,
    };

    setSelectedHomeCares((prev) => [...prev, careWithMedication]);
    setSearchMed("");
    setResultsMed([]);
  };

  return (
    <div className="flex flex-col gap-3">
      {loadingCares ? (
        <p className="text-green-700 text-sm">Завантаження оглядів...</p>
      ) : (
        <select
          value={selectedCare?._id || ""}
          onChange={(e) => {
            const care =
              allHomeCares.find((c) => c._id === e.target.value) || null;
            setSelectedCare(care);
            setSearchMed("");
            setResultsMed([]);
          }}
          className="w-full border border-green-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-green-400"
        >
          <option value="">Оберіть огляд...</option>
          {allHomeCares.map((care) => (
            <option key={care._id} value={care._id}>
              {care.name}
            </option>
          ))}
        </select>
      )}

      {selectedCare && (
        <div>
          <input
            type="text"
            placeholder="Пошук засобу..."
            value={searchMed}
            onChange={(e) => setSearchMed(e.target.value)}
            className="w-full px-2 py-1 border border-green-200 rounded-md text-sm focus:ring-1 focus:ring-green-300"
          />

          {loadingMed && (
            <p className="text-green-700 text-sm mt-1 mb-2">Завантаження...</p>
          )}

          {resultsMed.length > 0 && !loadingMed && (
            <div className="overflow-x-auto mb-3 mt-2">
              <table className="min-w-full border border-green-200 rounded-md text-sm text-center">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-3 py-1 text-left">Назва</th>
                    <th className="px-3 py-1 text-left">Рекомендація</th>
                    <th className="px-3 py-1 text-center">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsMed.map((m) => (
                    <tr key={m._id} className="border-b border-green-100">
                      <td className="px-3 py-1 text-left">{m.name}</td>
                      <td className="px-3 py-1 text-left">
                        {m.recommendation || "—"}
                      </td>
                      <td className="px-3 py-1 text-center">
                        <button
                          onClick={() => addHomeCare(m)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Додати
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loadingMed &&
            resultsMed.length === 0 &&
            searchMed.trim() === "" && (
              <p className="text-sm text-gray-500 mt-1">
                Введіть назву засобу для пошуку.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchHomeCare;
