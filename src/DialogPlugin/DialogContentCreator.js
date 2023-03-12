import dynamicRenderer from "./utils/DynamicBitmapTextWGLRenderer";

export default class DialogContentCreator {
  constructor(scene, layoutManager, settings) {
    this.scene = scene;
    this.layoutManager = layoutManager;
    this.settings = settings;
  }

  createContent(dialog, isAlignedRight = false) {
    this.destroyContent();

    if (dialog.name) {
      this.createName(dialog, isAlignedRight);
    }
    if (dialog.texture) {
      this.createAvatar(dialog, isAlignedRight);
    }
    this.createText(dialog);
  }

  createName(dialog, isAlignedRight = false) {
    this.name = this.scene.make
      .bitmapText({
        x: this.layoutManager.namePoint.x,
        y: this.layoutManager.namePoint.y,
        text: dialog.name,
        font: this.settings.fontFamily,
        size: this.settings.fontSize
      })
      .setScrollFactor(0);
    if (isAlignedRight) {
      this.name.setOrigin(1, 0);
    }
    if (dialog.nameColor) {
      this.name.setTint(dialog.nameColor);
    }
  }

  createAvatar(dialog, isAlignedRight = false) {
    this.avatar = this.scene.add
      .image(
        this.layoutManager.avatarRectagle.centerX,
        this.layoutManager.avatarRectagle.centerY,
        dialog.texture,
        dialog.frame
      )
      .setScrollFactor(0);

    if (isAlignedRight) {
      this.avatar.setFlipX(true);
    }
  }

  createText(dialog) {
    let textConfig = {
      x: this.layoutManager.textRectagle.x,
      y: this.layoutManager.textRectagle.y,
      text: "",
      font: this.settings.fontFamily,
      size: this.settings.fontSize,
      add: true
    };

    if (dialog.text.includes("{")) {
      this.text = this.scene.make
        .dynamicBitmapText(textConfig)
        .setMaxWidth(this.layoutManager.textRectagle.width)
        .setScrollFactor(0);
      this.text.renderWebGL = dynamicRenderer;
    } else {
      this.text = this.scene.make
        .bitmapText(textConfig)
        .setMaxWidth(this.layoutManager.textRectagle.width)
        .setScrollFactor(0);
    }
  }

  destroyContent() {
    if (this.name) this.name.destroy();
    if (this.avatar) this.avatar.destroy();
    if (this.text) this.text.destroy();
  }

  destroy() {
    this.destroyContent();

    this.scene = undefined;
    this.layoutManager = undefined;
    this.settings = undefined;
  }
}
