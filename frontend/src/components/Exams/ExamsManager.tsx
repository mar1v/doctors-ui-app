import React, { useEffect, useState } from "react";
import { getAllExams, type IExam } from "../../api/examsApi";
import AddExamForm from "./AddExamForm";
import ExamsSelectDropdown from "./ExamsDropList";
import SearchExam from "./SearchExam";
import SelectedExamsTable from "./SelectedExamsTable";

interface ExamsManagerProps {
  onChange?: (selected: IExam[]) => void;
}

const ExamsManager: React.FC<ExamsManagerProps> = ({ onChange }) => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [selectedExams, setSelectedExams] = useState<IExam[]>([]);

  useEffect(() => {
    onChange?.(selectedExams);
  }, [selectedExams]);

  useEffect(() => {
    const loadExams = async () => {
      const data = await getAllExams();
      setExams(data);
    };
    loadExams();
  }, []);

  const handleSelect = (id: string) => {
    const exam = exams.find((e) => e._id === id);
    if (exam && !selectedExams.some((e) => e._id === id)) {
      setSelectedExams((prev) => [...prev, exam]);
    }
  };

  return (
    <div className="bg-green-50 p-2">
      <div className="w-full max-w-md bg-white p-3 rounded-lg shadow-md mx-auto border border-green-100">
        <h2 className="text-lg font-semibold text-green-800 mb-3 text-center">
          Обстеження
        </h2>
        <ExamsSelectDropdown exams={exams} onSelect={handleSelect} />
        <SearchExam
          exams={exams}
          selectedExams={selectedExams}
          setSelectedExams={setSelectedExams}
        />

        <SelectedExamsTable
          selectedExams={selectedExams}
          setSelectedExams={setSelectedExams}
        />

        <AddExamForm onAdd={setExams} />
      </div>
    </div>
  );
};

export default ExamsManager;
