import CrudModulePage from "../components/CrudModulePage";
import { moduleConfigs } from "./moduleConfigs";

export default function Settings() {
  return <CrudModulePage config={moduleConfigs.settings} />;
}
