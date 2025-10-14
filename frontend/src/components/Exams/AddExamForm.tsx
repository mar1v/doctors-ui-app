import React, { useState } from "react";
import { createExam, getAllExams, type IExam } from "../../api/examsApi";

interface Props {
  onAdd: React.Dispatch<React.SetStateAction<IExam[]>>;
}

const AddExamForm: React.FC<Props> = ({ onAdd }) => {
  const [newName, setNewName] = useState("");
  const [newRecommendation, setNewRecommendation] = useState("");

  const handleCreate = async () => {
    if (!newName || !newRecommendation) return;
    await createExam({ name: newName, recommendation: newRecommendation });
    const updated = await getAllExams();
    onAdd(updated);
    setNewName("");
    setNewRecommendation("");
  };

  return (
    <div className="border-t border-green-200 pt-2 mt-2">
      <h3 className="text-sm font-semibold text-green-800 mb-1">
        Додати обстеження
      </h3>
      <input
        type="text"
        placeholder="Назва"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="w-full px-2 py-1 border border-green-200 rounded-md text-sm mb-1 focus:ring-1 focus:ring-green-300"
      />
      <textarea
        placeholder="Рекомендація"
        value={newRecommendation}
        onChange={(e) => setNewRecommendation(e.target.value)}
        className="w-full px-2 py-1 border border-green-200 rounded-md text-sm mb-2 focus:ring-1 focus:ring-green-300"
        rows={2}
      />
      <button
        onClick={handleCreate}
        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
      >
        Додати
      </button>
    </div>
  );
};

export default AddExamForm;
