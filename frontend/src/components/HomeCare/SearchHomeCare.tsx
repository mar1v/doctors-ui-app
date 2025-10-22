import { useEffect, useState } from "react";
import { searchHomeCaresByName, type IHomeCare } from "../../api/homeCaresApi";

interface Props {
  selectedHomeCares: IHomeCare[];
  setSelectedHomeCares: React.Dispatch<React.SetStateAction<IHomeCare[]>>;
}

const SearchHomeCare: React.FC<Props> = ({
  selectedHomeCares,
  setSelectedHomeCares,
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

  const addHomeCare = (homeCare: IHomeCare) => {
    if (!selectedHomeCares.find((h) => h._id === homeCare._id)) {
      setSelectedHomeCares((prev) => [...prev, homeCare]);
      setSearch("");
      setResults([]);
    }
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
        <p className="text-green-700 text-sm mb-2">Завантаження...</p>
      )}
      {results.length > 0 && !loading && (
        <div className="overflow-x-auto mb-3 mt-2">
          <table className="min-w-full border border-green-200 rounded-md text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="px-2 py-1 text-left">Назва</th>
                <th className="px-2 py-1 text-left">Ранок</th>
                <th className="px-2 py-1 text-left">День</th>
                <th className="px-2 py-1 text-left">Вечір</th>
                <th className="px-2 py-1 text-left">Дії</th>
              </tr>
            </thead>
            <tbody>
              {results.map((h) => (
                <tr key={h._id}>
                  <td className="px-2 py-1">{h.name}</td>
                  <td className="px-2 py-1 text-center">
                    {h.morning ? "☑️" : "—"}
                  </td>
                  <td className="px-2 py-1 text-center">
                    {h.day ? "☑️" : "—"}
                  </td>
                  <td className="px-2 py-1 text-center">
                    {h.evening ? "☑️" : "—"}
                  </td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => addHomeCare(h)}
                      className="text-green-500 hover:text-green-700"
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
    </>
  );
};

export default SearchHomeCare;
