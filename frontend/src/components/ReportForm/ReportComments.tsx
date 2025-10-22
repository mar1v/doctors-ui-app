import React from "react";

interface Props {
  comments: string;
  setComments: (value: string) => void;
}

const ReportComments: React.FC<Props> = ({ comments, setComments }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">Додаткова інформація:</label>
    <textarea
      value={comments}
      onChange={(e) => setComments(e.target.value)}
      className="w-full px-2 py-1 border border-green-200 rounded-md text-sm mb-2 focus:ring-1 focus:ring-green-300"
    />
  </div>
);

export default ReportComments;
