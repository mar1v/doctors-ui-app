import type { IMedication } from "../../api/medicationsApi";

interface Props {
  medications: IMedication[];
  onSelect: (id: string) => void;
}
export const MedicationsDropList: React.FC<Props> = ({
  medications,
  onSelect,
}) => {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-1 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      defaultValue=""
    >
      <option value="">-- Виберіть медикамент --</option>
      {medications.map((medication) => (
        <option key={medication._id} value={medication._id}>
          {medication.name}
        </option>
      ))}
    </select>
  );
};
