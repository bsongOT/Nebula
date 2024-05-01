import { NebulaPalette } from "./NebulaPalette";

export class NebulaPaletteInput {
    constructor(public palette:NebulaPalette){}

    public startInput(){
        const pl = this.palette;
        if (!pl.selection.nebula) return;
        pl.layout.input.container.classList.remove("hidden")
        pl.layout.input.text.value = pl.palettePairs.map(p => p.content.title).join("\n")
    }
    public completeInput(){
        const pl = this.palette;
        if (!pl.selection.nebula) return;
        pl.layout.input.container.classList.add("hidden")

        const contents = pl.data.contents.all();
    }
}