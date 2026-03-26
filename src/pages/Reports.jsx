import CrudModulePage from "../components/CrudModulePage";
import { moduleConfigs } from "./moduleConfigs";

export default function Reports() {
  return <CrudModulePage config={moduleConfigs.reports} />;
}
