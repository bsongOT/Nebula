import { div, ul, span, btn } from "@/funcObject";


export const QueryNebulaEditor = () => {
    return div()(
        ul({ class: "nebula-list" })(), // Query Nebula List
        div()(
            span()("Main"),
            btn()("search")
        ),
        div()(
            span()("Query"),
            div()(
                span()("Main") //main
                /**
                 * nebula
                 * and
                 * or
                 * not
                 */






            )
        )
    );
};
