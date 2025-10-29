import type { IHomeCare } from "#api/homeCaresApi";
import React, { useState } from "react";

interface Props {
  selectedHomeCares: IHomeCare[];
  setSelectedHomeCares: React.Dispatch<React.SetStateAction<IHomeCare[]>>;
}

const SelectedHomeCaresTable: React.FC<Props> = ({
  selectedHomeCares,
  setSelectedHomeCares,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleRemove = (id?: string) => {
    setSelectedHomeCares((prev) => prev.filter((h) => h._id !== id));
  };

  const toggle = (index: number, key: keyof IHomeCare) => {
    setSelectedHomeCares((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [key]: !h[key] } : h))
    );
  };

  const handleEdit = (h: IHomeCare) => {
    setEditingId(h._id || null);
  };

  const handleInputChange = (id: string, field: "name", value: string) => {
    setSelectedHomeCares((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleFinishEdit = () => setEditingId(null);

  if (selectedHomeCares.length === 0)
    return (
      <p className="text-green-700 text-sm mb-2 mt-3">Нічого не вибрано</p>
    );

  return (
    <div className="overflow-x-auto mb-3 mt-3">
      <table className="min-w-full border border-green-200 rounded-md text-sm">
        <thead className="bg-green-100">
          <tr>
            <th className="px-2 py-1 text-left">Назва</th>
            <th className="px-2 py-1 text-left">Засіб</th>
            <th className="px-2 py-1 text-center">Ранок</th>
            <th className="px-2 py-1 text-center">Вечір</th>
            <th className="px-2 py-1 text-center">Дії</th>
          </tr>
        </thead>

        <tbody>
          {selectedHomeCares.map((h, i) => (
            <tr
              key={h._id || i}
              className="border-b border-green-200 hover:bg-green-50"
            >
              <td className="px-2 py-1">
                {editingId === h._id ? (
                  <input
                    type="text"
                    value={h.name || ""}
                    onChange={(e) =>
                      handleInputChange(h._id!, "name", e.target.value)
                    }
                    className="w-full border border-green-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => handleEdit(h)}
                  >
                    {h.name}
                  </span>
                )}
              </td>

              <td className="px-2 py-1 text-left text-gray-700">
                {h.medicationName && h.medicationName !== ""
                  ? h.medicationName
                  : "—"}
              </td>

              {(["morning", "evening"] as (keyof IHomeCare)[]).map((key) => (
                <td key={key} className="text-center p-1">
                  <input
                    type="checkbox"
                    checked={!!h[key]}
                    onChange={() => toggle(i, key)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </td>
              ))}

              <td className="px-2 py-1 text-center">
                {editingId === h._id ? (
                  <button
                    type="button"
                    className="text-green-600 hover:underline mr-2"
                    onClick={handleFinishEdit}
                  >
                    Зберегти
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEdit(h)}
                  >
                    Оновити
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => handleRemove(h._id)}
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

export default SelectedHomeCaresTable;
