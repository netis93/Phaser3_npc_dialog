import Phaser from "phaser";

import DialogManager from "./DialogManager";
import dialogEvents from "./DialogManager/EventCenter";

class Ui extends Phaser.Scene {
  constructor() {
    super({
      key: "Dialog"
    });
  }

  create(data) {
    this.dialogManager = new DialogManager(
      data.home,
      data.player.sprite,
      data.player.name
    );

    data.npcs.forEach((npc) => {
      this.dialogManager.addNPC(npc.sprite, npc.name);
    });

    this.input.keyboard.on("keyup_X", this.talk);
  }

  talk() {
    dialogEvents.emit("wantToTalk");
  }
}

export default Ui;
