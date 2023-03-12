export default class Animations {
  constructor({ scene, name, config, texture }) {
    this.scene = scene;
    this.name = name;
    this.texture = texture;
    this.createAnimations(config);
  }

  sequence(name) {
    return new Promise((resolve, reject) => {
      this.sprite.anims.play(name, true);
      this.sprite.on(
        "animationcomplete",
        (animation, frame) => {
          resolve(name);
        },
        this.sprite
      );
    });
  }

  createAnimations(config) {
    if (this.scene.anims.anims.entries[this.name + "idle"]) {
      return;
    }

    config.forEach(this.createAnimation, this);
  }

  createAnimation(config) {
    if (config.generateFrames) {
      this.scene.anims.create({
        key: this.name + config.animationName,
        frames: this.scene.anims.generateFrameNumbers(
          this.texture,
          config.framesConfig
        ),
        frameRate: config.frameRate,
        repeat: config.repeat,
        delay: config.delay ? config.delay : 0,
        repeatDelay: config.repeatDelay ? config.repeatDelay : 0
      });
    } else {
      let frames = config.frames.map(x => {
        return { key: this.texture, frame: x.frame };
      });
      this.scene.anims.create({
        key: this.name + config.animationName,
        frames: frames,
        frameRate: config.frameRate ? config.frameRate : null
      });
    }
  }
}
