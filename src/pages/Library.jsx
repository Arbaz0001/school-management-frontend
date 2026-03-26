import CrudModulePage from "../components/CrudModulePage";
import { moduleConfigs } from "./moduleConfigs";

export default function Library() {
  return <CrudModulePage config={moduleConfigs.library} />;
}
