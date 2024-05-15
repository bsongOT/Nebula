import { div, ul, span, li } from "@/funcObject";


export const TransformNebulaViewer = () => {
    return div()(
        ul()(
            li()(span()("Zettelkasten")),
            li()(span()("Problem Solving")),
            li()(span()("Inverse Concept"))
        )
    );
};
