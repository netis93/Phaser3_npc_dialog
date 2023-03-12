import dialogEvents from "./EventCenter";
import stuffToSay from "./dialog";
import TalkZone from "./TalkZone";

export default class DialogManager {
  constructor(scene, playerSprite, defaultName) {
    this.scene = scene;
    this.isTalking = false;

    scene.dialogPlugin.setSettings({
      dialogHeight: 52,
      avatarWidth: 32,
      fontFamily: "atari",
      fontSize: 16,
      atBottom: false,
      frameSettings: {
        key: {
          key: "frames",
          frame: 0
        },
        offsetConfig: 8
      },
      paddings: {
        xPaddingOut: 5,
        yPaddingOut: 5,
        xPaddingIn: 10,
        yPaddingIn: 10
      }
    });

    this.defaultName = defaultName;
    this.currentNpc = null;

    this.talkZone = new TalkZone(scene, 50, 35, playerSprite, defaultName);

    this.npcGroup = scene.physics.add.group();
    scene.physics.add.overlap(this.talkZone, this.npcGroup);

    dialogEvents.on("wantToTalk", this.wantToTalk, this);
  }

  addNPC(talkerSprite, talkerName) {
    talkerSprite.setData("npcName", talkerName);
    this.npcGroup.add(talkerSprite);
  }

  destroy() {
    this.talkZone.destroy();
    this.scene = undefined;
  }

  wantToTalk() {
    if (this.isTalking) {
      this.isTalking = !this.scene.dialogPlugin.goToNext();

      if (!this.isTalking) {
        this.scene.events.emit("talkingStopped", this.currentNpc);
        this.currentNpc = null;
      }
    } else {
      let talker = this.defaultName;
      let npc = this._npcTalking();

      if (npc.name !== undefined) {
        talker = npc.name;
      }

      this.isTalking = true;
      this.scene.dialogPlugin.startDialog(stuffToSay[talker]);

      this.currentNpc = npc.sprite;
      this.scene.events.emit(
        "talkingStarted",
        npc.isToTheRight,
        this.currentNpc
      );
    }

    //ToDo: Make sure parties look at each other
  }

  _npcTalking() {
    var npc = {};
    var { talkZone } = this;

    if (talkZone.body.embedded) talkZone.body.touching.none = false;
    let touching = !talkZone.body.touching.none;

    if (touching) {
      npc = {
        sprite: talkZone.lastNpc,
        name: talkZone.getLastNpcName(),
        isToTheRight: talkZone.isNPCToTheRightOfTalker()
      };
    }

    return npc;
  }
}
