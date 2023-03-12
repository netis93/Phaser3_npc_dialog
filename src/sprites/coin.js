export default class Coin {
  constructor(config) {
    this.scene = config.scene;

    this.sprite = this.scene.physics.add.sprite(config.x, config.y, config.key);
    this.sprite.body.allowGravity = false;
    this.sprite.context = this;

    this.createAnimations();
    this.sprite.play("coin-spin", true);

    this.touchable = true;

    this.scene.physics.add.overlap(
      this.sprite,
      this.scene.player.sprite,
      this.coinCollect,
      () => this.touchable,
      this
    );
  }

  coinCollect(coin, player) {
    this.scene.events.emit("collectCoin");

    this.touchable = false;
    this.sprite.play("coin-glitter");
    this.sprite.on("animationcomplete", this.goAway, this);
  }

  goAway(animation, frame) {
    this.sprite.destroy();
  }

  createAnimations() {
    if (this.scene.anims.anims.entries["coin-spin"]) {
      return;
    }

    this.scene.anims.create({
      key: "coin-spin",
      frames: this.scene.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: "coin-glitter",
      frames: this.scene.anims.generateFrameNumbers("coin", {
        start: 4,
        end: 7
      }),
      frameRate: 20,
      repeat: 0
    });
  }
}
