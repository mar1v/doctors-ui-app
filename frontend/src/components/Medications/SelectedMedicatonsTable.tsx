import React, { useState } from "react";
import type { IMedication } from "../../api/medicationsApi";

interface Props {
  selectedMedications: IMedication[];
  setSelectedMedications: React.Dispatch<React.SetStateAction<IMedication[]>>;
}

const SelectedMedicationsTable: React.FC<Props> = ({
  selectedMedications,
  setSelectedMedications,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (med: IMedication) => {
    setEditingId(med._id || null);
  };

  const handleInputChange = (
    id: string,
    field: "name" | "recommendation",
    value: string
  ) => {
    setSelectedMedications((prev) =>
      prev.map((m) =>
        m._id === id
          ? {
              ...m,
              [field]: value,
            }
          : m
      )
    );
  };

  const handleFinishEdit = () => {
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    setSelectedMedications((prev) => prev.filter((m) => m._id !== id));
  };

  if (selectedMedications.length === 0)
    return (
      <p className="text-green-700 text-sm mb-2 mt-3">Нічого не вибрано</p>
    );

  return (
    <div className="overflow-x-auto mb-3 mt-3 ">
      <table className="min-w-full border border-green-200 rounded-md text-sm">
        <thead className="bg-green-100">
          <tr>
            <th className="px-2 py-1 text-left">Назва</th>
            <th className="px-2 py-1 text-left">Рекомендація</th>
            <th className="px-2 py-1 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {selectedMedications.map((medication) => (
            <tr
              key={medication._id}
              className="border-b border-green-200 hover:bg-green-50"
            >
              <td className="px-2 py-1">
                {editingId === medication._id ? (
                  <input
                    type="text"
                    value={medication.name || ""}
                    onChange={(e) =>
                      handleInputChange(medication._id!, "name", e.target.value)
                    }
                    className="w-full border border-green-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => handleEdit(medication)}
                  >
                    {medication.name}
                  </span>
                )}
              </td>

              <td className="px-2 py-1 align-top">
                {editingId === medication._id ? (
                  <textarea
                    value={medication.recommendation || ""}
                    onChange={(e) =>
                      handleInputChange(
                        medication._id!,
                        "recommendation",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full border border-green-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-300 resize-none"
                  />
                ) : (
                  <span
                    className="cursor-pointer whitespace-pre-wrap"
                    onClick={() => handleEdit(medication)}
                  >
                    {medication.recommendation}
                  </span>
                )}
              </td>

              <td className="px-2 py-1 align-top space-x-2">
                {editingId === medication._id ? (
                  // Кнопка просто виходить з режиму редагування
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => handleFinishEdit()}
                  >
                    Готово
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(medication)}
                  >
                    Оновити
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => handleRemove(medication._id!)}
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

export default SelectedMedicationsTable;
