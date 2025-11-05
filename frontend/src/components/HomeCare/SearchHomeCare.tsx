import { getAllHomeCares, type IHomeCare } from "#api/homeCaresApi";
import { searchMedicationsByName, type IMedication } from "#api/medicationsApi";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  selectedHomeCares: IHomeCare[];
  setSelectedHomeCares: React.Dispatch<React.SetStateAction<IHomeCare[]>>;
}

const SearchHomeCare: React.FC<Props> = ({
  selectedHomeCares,
  setSelectedHomeCares,
}) => {
  const [allHomeCares, setAllHomeCares] = useState<IHomeCare[]>([]);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, IMedication[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loadingCares, setLoadingCares] = useState(true);
  const [checkboxes, setCheckboxes] = useState<
    Record<string, { morning: boolean; evening: boolean }>
  >({});

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
    const timers: Record<string, ReturnType<typeof setTimeout>> = {};

    allHomeCares.forEach((care) => {
      const id = String(care._id);
      const value = searchValues[id];
      if (!value?.trim()) {
        setResults((prev) => ({ ...prev, [id]: [] }));
        return;
      }

      timers[id] = setTimeout(async () => {
        setLoading((prev) => ({ ...prev, [id]: true }));
        try {
          const meds = await searchMedicationsByName(value.trim());
          setResults((prev) => ({ ...prev, [id]: meds }));
        } finally {
          setLoading((prev) => ({ ...prev, [id]: false }));
        }
      }, 400);
    });

    return () => Object.values(timers).forEach(clearTimeout);
  }, [searchValues, allHomeCares]);

  const handleSearchChange = (careId: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [careId]: value }));
  };

  const addHomeCare = (
    care: IHomeCare,
    medication: IMedication,
    morning: boolean,
    evening: boolean
  ) => {
    const isDuplicate = selectedHomeCares.some(
      (h) => h.name === care.name && h.medicationName === medication.name
    );

    if (isDuplicate) {
      toast.error("Цей засіб уже додано до цієї категорії!");
      return false;
    }

    const newItem: IHomeCare = {
      ...care,
      medicationName: medication.name,
      morning,
      evening,
    };

    setSelectedHomeCares((prev) => [...prev, newItem]);
    setSearchValues((prev) => ({ ...prev, [String(care._id)]: "" }));
    setResults((prev) => ({ ...prev, [String(care._id)]: [] }));

    return true;
  };

  if (loadingCares)
    return <p className="text-green-700 text-sm">Завантаження категорій...</p>;

  return (
    <div className="flex flex-col gap-6">
      {allHomeCares.map((care) => {
        const id = String(care._id);
        return (
          <div key={id} className="border border-green-300 rounded-lg p-3">
            <h3 className="font-semibold text-green-700 mb-2">{care.name}</h3>

            <input
              type="text"
              placeholder="Пошук засобу..."
              value={searchValues[id] || ""}
              onChange={(e) => handleSearchChange(id, e.target.value)}
              className="w-full px-2 py-1 border border-green-200 rounded-md text-sm focus:ring-1 focus:ring-green-300"
            />

            {loading[id] && (
              <p className="text-green-700 text-sm mt-1 mb-2">
                Завантаження...
              </p>
            )}

            {results[id]?.length > 0 && !loading[id] && (
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full border border-green-200 rounded-md text-sm text-center">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-3 py-1 text-left">Назва</th>
                      <th className="px-3 py-1 text-left">Рекомендація</th>
                      <th className="px-3 py-1 text-center">Ранок</th>
                      <th className="px-3 py-1 text-center">Вечір</th>
                      <th className="px-3 py-1 text-center">Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[id].map((m) => (
                      <tr key={m._id} className="border-b border-green-100">
                        <td className="px-3 py-1 text-left">{m.name}</td>
                        <td className="px-3 py-1 text-left">
                          {m.recommendation || "—"}
                        </td>

                        <td className="px-3 py-1 text-center">
                          <input
                            type="checkbox"
                            checked={checkboxes[m._id]?.morning || false}
                            onChange={(e) =>
                              setCheckboxes((prev) => ({
                                ...prev,
                                [m._id]: {
                                  ...prev[m._id],
                                  morning: e.target.checked,
                                },
                              }))
                            }
                          />
                        </td>

                        <td className="px-3 py-1 text-center">
                          <input
                            type="checkbox"
                            checked={checkboxes[m._id]?.evening || false}
                            onChange={(e) =>
                              setCheckboxes((prev) => ({
                                ...prev,
                                [m._id]: {
                                  ...prev[m._id],
                                  evening: e.target.checked,
                                },
                              }))
                            }
                          />
                        </td>

                        <td className="px-3 py-1 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              addHomeCare(
                                care,
                                m,
                                checkboxes[m._id]?.morning || false,
                                checkboxes[m._id]?.evening || false
                              )
                            }
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

            {!loading[id] &&
              (!results[id] || results[id].length === 0) &&
              !(searchValues[id] || "").trim() && (
                <p className="text-sm text-gray-500 mt-1">
                  Введіть назву засобу для пошуку.
                </p>
              )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchHomeCare;
