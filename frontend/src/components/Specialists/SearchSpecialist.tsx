import { useEffect, useState } from "react";
import {
  searchSpecialistsByName,
  type ISpecialist,
} from "../../api/specialistsApi";

interface Props {
  selectedSpecialists: ISpecialist[];
  setSelectedSpecialists: React.Dispatch<React.SetStateAction<ISpecialist[]>>;
}

const SearchSpecialist: React.FC<Props> = ({
  selectedSpecialists,
  setSelectedSpecialists,
}) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ISpecialist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchSpecialistsByName(search.trim());
        setResults(res);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const addSpecialist = (specialist: ISpecialist) => {
    if (!selectedSpecialists.find((e) => e._id === specialist._id)) {
      setSelectedSpecialists((prev) => [...prev, specialist]);
      setSearch("");
      setResults([]);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Пошук спеціаліста"
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
                <th className="px-2 py-1 text-left">Ім’я</th>
                <th className="px-2 py-1 text-left">Запит</th>
                <th className="px-2 py-1 text-left">Дії</th>
              </tr>
            </thead>
            <tbody>
              {results.map((specialist) => (
                <tr key={specialist._id}>
                  <td className="px-2 py-1">{specialist.name}</td>
                  <td className="px-2 py-1">{specialist.query || "-"}</td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => addSpecialist(specialist)}
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

export default SearchSpecialist;
