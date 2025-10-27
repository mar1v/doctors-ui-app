import { type IExam } from "#api/examsApi";
import React, { useState } from "react";

interface Props {
  selectedExams: IExam[];
  setSelectedExams: React.Dispatch<React.SetStateAction<IExam[]>>;
}

const SelectedExamsTable: React.FC<Props> = ({
  selectedExams,
  setSelectedExams,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (exam: IExam) => {
    setEditingId(exam._id || null);
  };

  const handleInputChange = (
    id: string,
    field: "name" | "recommendation",
    value: string
  ) => {
    setSelectedExams((prev) =>
      prev.map((e) =>
        e._id === id
          ? {
              ...e,
              [field]: value,
            }
          : e
      )
    );
  };

  const handleFinishEdit = () => {
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    setSelectedExams((prev) => prev.filter((e) => e._id !== id));
  };

  if (selectedExams.length === 0)
    return (
      <p className="text-green-700 text-sm mb-2 mt-3">Нічого не вибрано</p>
    );

  return (
    <div className="overflow-x-auto mb-3 mt-3">
      <table className="min-w-full border border-green-200 rounded-md text-sm">
        <thead className="bg-green-100">
          <tr>
            <th className="px-2 py-1 text-left">Назва обстеження</th>
            <th className="px-2 py-1 text-left">Рекомендація</th>
            <th className="px-2 py-1 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {selectedExams.map((exam) => (
            <tr
              key={exam._id}
              className="border-b border-green-200 hover:bg-green-50"
            >
              <td className="px-2 py-1">
                {editingId === exam._id ? (
                  <input
                    type="text"
                    value={exam.name || ""}
                    onChange={(e) =>
                      handleInputChange(exam._id!, "name", e.target.value)
                    }
                    className="w-full border border-green-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => handleEdit(exam)}
                  >
                    {exam.name}
                  </span>
                )}
              </td>

              <td className="px-2 py-1 align-top">
                {editingId === exam._id ? (
                  <textarea
                    value={exam.recommendation || ""}
                    onChange={(e) =>
                      handleInputChange(
                        exam._id!,
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
                    onClick={() => handleEdit(exam)}
                  >
                    {exam.recommendation}
                  </span>
                )}
              </td>

              <td className="px-2 py-1 align-top space-x-2">
                {editingId === exam._id ? (
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
                    onClick={() => handleEdit(exam)}
                  >
                    Оновити
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => handleRemove(exam._id!)}
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

export default SelectedExamsTable;
