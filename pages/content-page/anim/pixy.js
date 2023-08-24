const pixy = {
  Application: class Application{
    app;
    view;
    constructor(...arr){
      this.app = new PIXI.Application(...arr);
      this.view = this.app.view;
    }
  },
  add: PIXI.add
}