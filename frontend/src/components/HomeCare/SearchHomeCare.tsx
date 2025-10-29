import { searchHomeCaresByName, type IHomeCare } from "#api/homeCaresApi";
import type { IMedication } from "#api/medicationsApi";
import { useEffect, useState } from "react";

interface Props {
  selectedHomeCares: IHomeCare[];
  setSelectedHomeCares: React.Dispatch<React.SetStateAction<IHomeCare[]>>;
  selectedMedications: IMedication[];
}

const SearchHomeCare: React.FC<Props> = ({
  selectedHomeCares,
  setSelectedHomeCares,
  selectedMedications,
}) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<IHomeCare[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchHomeCaresByName(search.trim());
        setResults(res);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const addHomeCare = (homeCare: IHomeCare, medicationName: string) => {
    const uniqueKey = `${homeCare._id}-${medicationName.trim()}`;

    if (selectedHomeCares.some((h) => h._id === uniqueKey)) return;

    const careWithMedication: IHomeCare = {
      ...homeCare,
      _id: uniqueKey,
      medicationName: medicationName.trim(),
    };

    setSelectedHomeCares((prev) => [...prev, careWithMedication]);
    setSearch("");
    setResults([]);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Пошук домашнього догляду"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-2 py-1 border border-green-200 rounded-md text-sm focus:ring-1 focus:ring-green-300"
      />

      {loading && (
        <p className="text-green-700 text-sm mt-1 mb-2">Завантаження...</p>
      )}

      {results.length > 0 && !loading && selectedMedications.length > 0 && (
        <div className="overflow-x-auto mb-3 mt-2">
          <table className="min-w-full border border-green-200 rounded-md text-sm text-center">
            <thead className="bg-green-100">
              <tr>
                <th className="px-3 py-1 text-left">Назва</th>
                <th className="px-3 py-1">Засіб</th>
                <th className="px-3 py-1">Ранок</th>
                <th className="px-3 py-1">Вечір</th>
                <th className="px-3 py-1">Дії</th>
              </tr>
            </thead>

            <tbody>
              {results.flatMap((h) =>
                selectedMedications.map((m) => (
                  <tr key={`${h._id}-${m.name}`}>
                    <td className="px-3 py-1 text-left">{h.name}</td>
                    <td className="px-3 py-1 text-gray-700 font-medium">
                      {m.name}
                    </td>
                    <td className="px-3 py-1">{h.morning ? "✓" : "–"}</td>
                    <td className="px-3 py-1">{h.evening ? "✓" : "–"}</td>
                    <td className="px-3 py-1">
                      <button
                        onClick={() => addHomeCare(h, m.name)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Додати
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedMedications.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Спочатку додайте хоча б один засіб.
        </p>
      )}
    </>
  );
};

export default SearchHomeCare;
