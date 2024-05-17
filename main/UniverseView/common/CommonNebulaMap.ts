import { div } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap/universeMap";
import { Universe } from "../../data/components/Universe";
import { Data, Nebula } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";

export type CommonNebulaMapInfo = {
  universeMap: UniverseMapInfo,
  selection: {
    universe?: Universe,
    nebula?: Nebula
  },
  data: Data
}
export const CommonNebulaMap = (info:CommonNebulaMapInfo) => {
  const {universeMap, selection, data} = info;
  return div()([
    UniverseMap(universeMap, selection, data)
  ]);
};
