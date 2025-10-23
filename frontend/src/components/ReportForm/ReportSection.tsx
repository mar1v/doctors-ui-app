import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const ReportSection: React.FC<Props> = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default ReportSection;
