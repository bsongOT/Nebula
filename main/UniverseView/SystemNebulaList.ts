import { btn, div } from "@/funcObject";
import "./SystemNebulaList.css"

export const SystemNebulaList = () => {
  return div()(
    div({ class: "system-nebula-switch-box" })(
      btn()("Day"),
      btn()("Lifetime"),
      btn()("Importance"),
      btn()("Isolated")
    )
  );
};
