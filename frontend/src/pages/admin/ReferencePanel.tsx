import ExamsManager from "#components/Exams/ExamsManager";
import HomeCaresManager from "#components/HomeCare/HomeCaresManager";
import MedicationsManager from "#components/Medications/MedicationsManager";
import PatientManager from "#components/PatientList/PatientManager";
import ProceduresManager from "#components/Procedures/ProceduresManager";
import SpecialistsManager from "#components/Specialists/SpecialistsManager";
import React, { useState } from "react";

interface ReferencePanelProps {
  key:
    | "medications"
    | "procedures"
    | "exams"
    | "specialists"
    | "homecares"
    | "patients";
  label: string;
}

const ReferencePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "medications"
    | "procedures"
    | "exams"
    | "specialists"
    | "homecares"
    | "patients"
  >("medications");

  const tabs: ReferencePanelProps[] = [
    { key: "medications", label: "Засоби" },
    { key: "procedures", label: "Процедури" },
    { key: "exams", label: "Обстеження" },
    { key: "specialists", label: "Суміжні спеціалісти" },
    { key: "homecares", label: "Домашній догляд" },
    { key: "patients", label: "Пацієнти" },
  ];

  return (
    <div
      className="
        flex flex-col min-h-[90vh] justify-start 
        sm:justify-center px-4 sm:px-6 lg:px-8 py-6 
        max-w-screen-xl mx-auto
      "
    >
      <button
        onClick={() => window.history.back()}
        className="border border-green-300 rounded py-1.5 px-4 mb-4 text-green-700 text-sm font-medium
                   hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-sm w-fit"
      >
        ← Назад
      </button>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-6 text-center sm:text-left">
        Панель довідників
      </h1>

      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-2 rounded-md border text-sm sm:text-base font-medium transition-all
              ${
                activeTab === tab.key
                  ? "bg-green-600 text-white border-green-700 shadow-md"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="
          border rounded-lg p-4 sm:p-6 bg-white shadow-sm 
          flex-grow overflow-auto
        "
      >
        {activeTab === "medications" && <MedicationsManager />}
        {activeTab === "procedures" && <ProceduresManager />}
        {activeTab === "exams" && <ExamsManager />}
        {activeTab === "specialists" && <SpecialistsManager />}
        {activeTab === "homecares" && <HomeCaresManager />}
        {activeTab === "patients" && <PatientManager />}
      </div>
    </div>
  );
};

export default ReferencePanel;
