import CrudModulePage from "../components/CrudModulePage";
import { moduleConfigs } from "./moduleConfigs";

export default function Hostel() {
  return <CrudModulePage config={moduleConfigs.hostel} />;
}
