import React from "react";
import { type IExam } from "../../api/examsApi";

interface Props {
  selectedExams: IExam[];
  setSelectedExams: React.Dispatch<React.SetStateAction<IExam[]>>;
}

const SelectedExamsTable: React.FC<Props> = ({
  selectedExams,
  setSelectedExams,
}) => {
  const handleUpdate = async (exam: IExam) => {
    localStorage.setItem("lastUpdatedExamId", exam._id || "");
  };

  const handleClearFields = (id: string) => {
    const newSelectedExams = selectedExams.filter((e) => e._id !== id);
    setSelectedExams(newSelectedExams);
  };

  if (selectedExams.length === 0)
    return (
      <p className="text-green-700 text-sm mb-2 mt-3">Нічого не вибрано</p>
    );

  return (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border border-green-200 rounded-md text-sm">
        <thead className="bg-green-100">
          <tr>
            <th className="px-2 py-1 text-left">Назва</th>
            <th className="px-2 py-1 text-left">Рекомендація</th>
            <th className="px-2 py-1 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {selectedExams.map((exam) => (
            <tr key={exam._id} className="border-t border-green-200">
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={exam.name}
                  onChange={(e) =>
                    setSelectedExams((prev) =>
                      prev.map((ex) =>
                        ex._id === exam._id
                          ? { ...ex, name: e.target.value }
                          : ex
                      )
                    )
                  }
                  className="w-full px-1 py-0.5 border border-green-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                />
              </td>
              <td className="px-2 py-1">
                <textarea
                  value={exam.recommendation}
                  onChange={(e) =>
                    setSelectedExams((prev) =>
                      prev.map((ex) =>
                        ex._id === exam._id
                          ? { ...ex, recommendation: e.target.value }
                          : ex
                      )
                    )
                  }
                  rows={2}
                  className="w-full px-1 py-0.5 border border-green-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                />
              </td>
              <td className="px-2 py-1 space-x-1">
                <button
                  onClick={() => handleUpdate(exam)}
                  className="px-2 py-0.5 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Зберегти
                </button>
                <button
                  onClick={() => handleClearFields(exam._id!)}
                  className="px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Очистити
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
