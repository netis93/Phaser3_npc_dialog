import Phaser from "phaser";

export default class TalkZone extends Phaser.GameObjects.Zone {
  constructor(scene, width, height, talkerSprite) {
    var center = talkerSprite.getCenter;

    super(scene, center.x, center.y, width, height);

    scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.body.moves = false;
    scene.add.existing(this);

    scene.sys.events.on("update", this.update, this);

    this.talkerSprite = talkerSprite;
    this.lastNpc = null;

    this.body.onOverlap = true;
    this.listener = scene.physics.world.on(
      Phaser.Physics.Arcade.Events.OVERLAP,
      this.handleTouch,
      this
    );
  }

  update() {
    var center = this.talkerSprite.getCenter();

    this.x = center.x;
    this.y = center.y;
  }

  handleTouch(zone, npc) {
    if (this !== zone) return;

    this.lastNpc = npc;
  }

  getLastNpcName() {
    return this.lastNpc.getData("npcName");
  }

  isNPCToTheRightOfTalker() {
    return this.talkerSprite.body.center.x < this.lastNpc.body.center.x;
  }

  shutdown() {}

  destroy(fromScene = false) {
    this.shutdown();
    this.scene.sys.events.off("update", this.update, this);

    super.destroy(fromScene);
  }
}
