import CrudModulePage from "../components/CrudModulePage";
import { moduleConfigs } from "./moduleConfigs";

export default function Exams() {
  return <CrudModulePage config={moduleConfigs.exams} />;
}
