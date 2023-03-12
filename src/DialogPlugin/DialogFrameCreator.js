export default class DialogFrameCreator {
  constructor(scene) {
    this.scene = scene;
  }

  createFrame(frameRectangle, key, offsetConfig) {
    if (this.frame) {
      this.frame.destroy();
    }

    if (!this.scene.textures.exists(key.key)) return;

    this.frame = this.scene.add
      .nineslice(
        frameRectangle.x,
        frameRectangle.y,
        frameRectangle.width,
        frameRectangle.height,
        key,
        offsetConfig
      )
      .setScrollFactor(0);
  }

  destroyFrame() {
    if (this.frame) {
      this.frame.destroy();
      this.frame = undefined;
    }
  }

  destroy() {
    this.destroyFrame();

    this.scene = undefined;
  }
}
