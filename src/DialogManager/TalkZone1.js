import Phaser from "phaser";

export default class TalkZone extends Phaser.GameObjects.Zone {
  constructor(scene, width, height, talkerSprite, name) {
    var center = talkerSprite.getCenter;

    super(scene, center.x, center.y, width, height);

    scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.body.moves = false;
    scene.add.existing(this);

    this.talkerSprite = talkerSprite;
    this.talkerName = name;
  }

  update() {
    var center = this.talkerSprite.getCenter();

    this.x = center.x;
    this.y = center.y;
  }

  shutdown() {}

  destroy(fromScene = false) {
    this.shutdown();

    super.destroy(fromScene);
  }
}
