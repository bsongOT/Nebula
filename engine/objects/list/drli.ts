import { li } from "@/funcObject"

export const drli = (...children:HTMLElement[]) => {
    const obj = li()(...children)

    

    return obj;
}