import { div, ul, span, btn } from "@/funcObject";


export const QueryNebulaEditor = () => {
    return div()([
        ul({ class: "nebula-list" })(), // Query Nebula List
        div()([
            div()("+")
        ])
    ]);
};
