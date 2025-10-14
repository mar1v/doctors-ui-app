import React from "react";
import { type IExam } from "../../api/examsApi";

interface Props {
  exams: IExam[];
  onSelect: (id: string) => void;
}

const ExamsSelectDropdown: React.FC<Props> = ({ exams, onSelect }) => {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-1 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      defaultValue=""
    >
      <option value="">-- Виберіть обстеження --</option>
      {exams.map((exam) => (
        <option key={exam._id} value={exam._id}>
          {exam.name}
        </option>
      ))}
    </select>
  );
};

export default ExamsSelectDropdown;
