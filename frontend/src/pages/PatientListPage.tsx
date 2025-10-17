import React from "react";
import PatientList from "../components/PatientList/PatientList";

const PatientListPage: React.FC = () => {
  return (
    <div className="p-6 flex justify-center">
      <PatientList />
    </div>
  );
};

export default PatientListPage;
