import React, { useState } from "react";
import type { ISpecialist } from "../../api/specialistsApi";

interface Props {
  selectedSpecialists: ISpecialist[];
  setSelectedSpecialists: React.Dispatch<React.SetStateAction<ISpecialist[]>>;
}

const SelectedSpecialistsTable: React.FC<Props> = ({
  selectedSpecialists,
  setSelectedSpecialists,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (specialist: ISpecialist) => {
    setEditingId(specialist._id || null);
  };

  const handleInputChange = (id: string, value: string) => {
    setSelectedSpecialists((prev) =>
      prev.map((s) =>
        s._id === id
          ? {
              ...s,
              name: value,
            }
          : s
      )
    );
  };

  const handleFinishEdit = () => {
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    setSelectedSpecialists((prev) => prev.filter((s) => s._id !== id));
  };

  if (selectedSpecialists.length === 0)
    return (
      <p className="text-green-700 text-sm mb-2 mt-3">Нічого не вибрано</p>
    );

  return (
    <div className="overflow-x-auto mb-3 mt-3">
      <table className="min-w-full border border-green-200 rounded-md text-sm">
        <thead className="bg-green-100">
          <tr>
            <th className="px-2 py-1 text-left">Ім’я спеціаліста</th>
            <th className="px-2 py-1 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {selectedSpecialists.map((specialist) => (
            <tr
              key={specialist._id}
              className="border-b border-green-200 hover:bg-green-50"
            >
              <td className="px-2 py-1">
                {editingId === specialist._id ? (
                  <input
                    type="text"
                    value={specialist.name || ""}
                    onChange={(e) =>
                      handleInputChange(specialist._id!, e.target.value)
                    }
                    className="w-full border border-green-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => handleEdit(specialist)}
                  >
                    {specialist.name}
                  </span>
                )}
              </td>

              <td className="px-2 py-1 space-x-2">
                {editingId === specialist._id ? (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={handleFinishEdit}
                  >
                    Готово
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(specialist)}
                  >
                    Оновити
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => handleRemove(specialist._id!)}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedSpecialistsTable;
