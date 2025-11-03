import CRUDManager from "#components/CRUDManager";
export default function HomeCaresManager() {
  return (
    <CRUDManager
      title="Домашній догляд"
      apiPath="home-cares"
      hasMorningEvening
    />
  );
}
