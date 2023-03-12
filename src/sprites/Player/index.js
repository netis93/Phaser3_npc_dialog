import Base from "../Base";
import AnimationsConfig from "./animationsConfig.json";
import Phaser from "phaser";

export default class Tommy extends Base {
  constructor(config) {
    var velocities = {
      walking: 75,
      gravity: 300,
      running: 100,
      turning: 30,
      jump: 250,
      airSpeed: 90,
      landing: 40
    };

    super({
      scene: config.scene,
      key: config.key,
      name: "tommy",
      x: config.x,
      y: config.y,
      velocities: velocities,
      animationConfig: AnimationsConfig
    });
    this.scene = config.scene;

    this.velocities = velocities;

    this.isFalling = false;
    this.direction = "right";

    const { LEFT, RIGHT, DOWN, SPACE, B, V } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      space: SPACE,
      down: DOWN,
      b: B,
      v: V
    });

    this.scene.events.on("talkingStarted", this.talk, this);
    this.scene.events.on("talkingStopped", this.stopTalk, this);
  }

  talk(npcIsToTheRight) {
    if (npcIsToTheRight !== undefined) {
      var direction = npcIsToTheRight ? "right" : "left";
      this.behaviors.extraVars.lastDirection = direction;
    }

    this.behaviors.handle("talk");
  }

  stopTalk() {
    this.behaviors.handle("stopTalking");
  }

  update() {
    if (!this.sprite.body) {
      return;
    }

    const { keys, sprite, behaviors, velocities } = this;

    const onFloor = sprite.body.onFloor();

    if (keys.left.isDown) {
      if (keys.b.isDown) {
        behaviors.handle("run", { velocity: velocities, direction: "left" });
      } else {
        behaviors.handle("walk", { velocity: velocities, direction: "left" });
      }
    } else if (keys.right.isDown) {
      if (keys.b.isDown) {
        behaviors.handle("run", { velocity: velocities, direction: "right" });
      } else {
        behaviors.handle("walk", { velocity: velocities, direction: "right" });
      }
    } else {
      behaviors.handle("idle");
    }

    if (keys.space.isDown && onFloor) {
      behaviors.handle("jump", { velocity: velocities });
    }

    if (this.isFalling && onFloor) {
      behaviors.handle("land");
      this.isFalling = false;
    }

    if (sprite.body.velocity.y >= 0 && !onFloor) {
      behaviors.handle("fall");
      this.isFalling = true;
    }
  }
}
