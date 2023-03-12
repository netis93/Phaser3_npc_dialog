import Phaser from "phaser";

import LayoutManager from "./DialogLayoutManager";
import FrameCreator from "./DialogFrameCreator";
import ContentCreator from "./DialogContentCreator";
import TextWriter from "./DialogTextWriter";
import addDynamicTextCallback from "./utils/addDynamicTextCallback";

export default class PhaserDialogModalPlugin extends Phaser.Plugins
  .ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);

    this.scene = scene;
    this.systems = scene.sys;

    this.dialogList = [];
    this.dialogIndex = 0;

    if (!scene.sys.settings.isBooted)
      this.systems.events.once("boot", this.boot, this);
  }

  boot() {
    const emitter = this.systems.events;
    emitter.on("shutdown", this.shutdown, this);
    emitter.once("destroy", this.destroy, this);
  }

  init() {}

  start() {}

  preUpdate(time, delta) {}

  update(time, delta) {}

  postUpdate(time, delta) {}

  shutdown() {}

  destroy() {
    this.shutdown();
    //this.systems.events.off("update", this.update, this);
    this.systems.events.off("boot", this.boot, this);
    this.scene = undefined;
    this.systems = undefined;

    this.layoutManager = null;
    this.frameCreator.destroy();
    this.frameCreator = null;
    this.contentCreator.destroy();
    this.contentCreator = null;
    this.textWriter.destroy();
    this.textWriter = null;
  }

  setSettings(settings) {
    this.settings = settings;

    this.layoutManager = new LayoutManager(
      settings.paddings,
      this.scene.scale.width,
      this.scene.scale.height,
      settings.dialogHeight,
      settings.avatarWidth,
      settings.fontSize
    );

    this.frameCreator = new FrameCreator(this.scene);

    this.contentCreator = new ContentCreator(
      this.scene,
      this.layoutManager,
      this.settings
    );

    this.textWriter = new TextWriter(this.scene);
  }

  updateFrameSettings(frameSettings) {
    this.settings.frameSettings = frameSettings;
  }

  startDialog(dialogList) {
    this.dialogList = dialogList;
    this.dialogIndex = 0;
    this._setCurrentDialog(dialogList[this.dialogIndex], true);
  }

  goToNext() {
    var isDone = false;

    if (!this.textWriter.isTextAnimateDone()) {
      this.textWriter.showAllText();
    } else {
      this.dialogIndex++;
      if (this.dialogIndex < this.dialogList.length) {
        this._setCurrentDialog(this.dialogList[this.dialogIndex]);
      } else {
        this.frameCreator.destroyFrame();
        this.contentCreator.destroyContent();
        this.textWriter.clean();
        isDone = true;
      }
    }

    return isDone;
  }

  _setCurrentDialog(dialog, updateFrame = false) {
    var isAlignedRight = dialog.alignedRight ? true : false;

    this.layoutManager.updateSettings(
      dialog.texture ? true : false,
      dialog.name ? true : false,
      this.settings.atBottom,
      isAlignedRight
    );

    if (updateFrame) {
      this.frameCreator.createFrame(
        this.layoutManager.frameRectagle,
        this.settings.frameSettings.key,
        this.settings.frameSettings.offsetConfig
      );
    }

    this.contentCreator.createContent(dialog, isAlignedRight);

    if (dialog.text.includes("{")) {
      var callback = addDynamicTextCallback(dialog, this.settings);
      this.contentCreator.text.setDisplayCallback(callback);
    }

    this.textWriter.writeDialog(
      dialog.text,
      this.contentCreator.text.setText.bind(this.contentCreator.text)
    );
  }
}
