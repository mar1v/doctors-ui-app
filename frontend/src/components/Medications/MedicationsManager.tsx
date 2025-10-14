import { useEffect, useState } from "react";
import { getAllMedications, type IMedication } from "../../api/medicationsApi";
import AddMedicationForm from "./AddMedicationForm";
import { MedicationsDropList } from "./MedicationsDropList";
import SearchMedication from "./SearchMedication";
import SelectedMedicationsTable from "./SelectedMedicatonsTable";

interface MedicationsManagerProps {
  onChange?: (selected: IMedication[]) => void;
}

const MedicationsManager: React.FC<MedicationsManagerProps> = ({
  onChange,
}) => {
  const [medications, setMedications] = useState<IMedication[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<IMedication[]>(
    []
  );

  const handleSelect = (id: string) => {
    const medication = medications.find((m) => m._id === id);
    if (medication && !selectedMedications.some((m) => m._id === id)) {
      setSelectedMedications((prev) => [...prev, medication]);
    }
  };

  // 🔄 Викликати onChange при зміні selectedMedications
  useEffect(() => {
    onChange?.(selectedMedications);
  }, [selectedMedications]);

  useEffect(() => {
    const loadMedications = async () => {
      const data = await getAllMedications();
      setMedications(data);
    };
    loadMedications();
  }, []);

  return (
    <div className="bg-green-50 p-2">
      <div className="w-full max-w-md bg-white p-3 rounded-lg shadow-md mx-auto border border-green-100">
        <h2 className="text-lg font-semibold text-green-800 mb-3 text-center">
          Медикаменти
        </h2>
        <MedicationsDropList
          medications={medications}
          onSelect={handleSelect}
        />
        <SearchMedication
          medication={medications}
          selectedMedications={selectedMedications}
          setSelectedMedications={setSelectedMedications}
        />
        <SelectedMedicationsTable
          selectedMedications={selectedMedications}
          setSelectedMedications={setSelectedMedications}
        />
        <AddMedicationForm onAdd={setMedications} />
      </div>
    </div>
  );
};

export default MedicationsManager;
