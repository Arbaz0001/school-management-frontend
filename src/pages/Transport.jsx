import CrudModulePage from "../components/CrudModulePage";
import { moduleConfigs } from "./moduleConfigs";

export default function Transport() {
  return <CrudModulePage config={moduleConfigs.transport} />;
}
