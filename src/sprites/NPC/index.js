import Base from "../Base";

export default class NPC extends Base {
  constructor(config, name, animationsConfig) {
    var velocities = {
      walking: 50,
      gravity: 300,
      running: 100,
      turning: 30,
      jump: 200,
      airSpeed: 90,
      landing: 40
    };

    super({
      scene: config.scene,
      key: config.key,
      name: name,
      x: config.x,
      y: config.y,
      velocities: velocities,
      animationConfig: animationsConfig
    });
    this.scene = config.scene;

    this.velocities = velocities;

    this.spot = config.x;

    this.scene.physics.add.collider(
      this.sprite,
      config.scene.layer,
      this.onTileOverlapTurn
    );

    this.bounds = this.scene.physics.world.bounds;

    this.isIdling = false;
    this.isFalling = false;
    this.isWalking = true;
    this.isMovingLeft = false;
    this.shouldTurn = false;
    this.shouldJump = false;
    this.shouldSit = false;

    this.breakTimer = this.scene.time.addEvent({
      delay: 3000,
      callback: this.takeABreak,
      callbackScope: this,
      loop: true
    });

    this.scene.events.on("talkingStarted", this.talk, this);
    this.scene.events.on("talkingStopped", this.stopTalk, this);
  }

  talk(isToTheRight, npcSprite) {
    if (npcSprite === this.sprite) {
      let direction = isToTheRight ? "left" : "right";
      this.behaviors.extraVars.lastDirection = direction;

      this.behaviors.handle("talk");
    }
  }

  stopTalk(npcSprite) {
    if (npcSprite === this.sprite) this.behaviors.handle("stopTalking");
  }

  update() {
    if (!this.sprite.body) {
      return;
    }

    const { sprite, behaviors, velocities, spot } = this;

    const onFloor = sprite.body.onFloor();

    if (
      (this.isMovingLeft && sprite.x < spot - 50) ||
      (!this.isMovingLeft && sprite.x > spot + 50)
    ) {
      this.shouldTurn = true;
    }

    if (this.shouldTurn) {
      this.isMovingLeft = !this.isMovingLeft;
      this.shouldTurn = false;
    }

    if (this.isWalking) {
      behaviors.handle("walk", {
        velocity: velocities,
        direction: this.isMovingLeft ? "left" : "right"
      });
    }

    if (this.shouldSit) {
      behaviors.handle("sit");
      this.shouldSit = false;
    }

    if (this.isIdling) {
      behaviors.handle("idle");
    }

    if (this.shouldJump && onFloor) {
      behaviors.handle("jump", { velocity: velocities });
      this.shouldJump = false;
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

  takeABreak() {
    this.breakTimer.paused = true;
    this.isWalking = false;
    this.shouldSit = Math.random() >= 0.5;
    this.isIdling = !this.shouldSit;

    var breakTime = 4;
    this.scene.time.addEvent({
      delay: breakTime * 1000,
      callback: this.stopBreak,
      callbackScope: this
    });
  }

  stopBreak() {
    this.breakTimer.paused = false;
    this.shouldSit = false;
    this.isIdling = false;
    this.isWalking = true;
  }

  onTileOverlapTurn(robot, tile) {
    if (robot.body.velocity.x > 0) {
      let wx = robot.body.x + robot.body.width + tile.width / 2;
      let hy = robot.body.y + robot.body.height + tile.width / 2;
      let isGround = tile.tilemapLayer.hasTileAtWorldXY(wx, hy);
      if (!isGround) {
        robot.context.shouldTurn = true;
      }
    } else if (robot.body.velocity.x < 0) {
      let wx = robot.body.x - tile.width / 2;
      let hy = robot.body.y + robot.body.height + tile.width / 2;
      let isGround = tile.tilemapLayer.hasTileAtWorldXY(wx, hy);
      if (!isGround) {
        robot.context.shouldTurn = true;
      }
    }
  }

  destroy() {
    this.breakTimer.remove(false);

    super.destroy();
  }
}
