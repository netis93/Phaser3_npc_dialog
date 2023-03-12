import machina from "machina";

var turnEntity = function(entity) {
  entity.sprite.setFlipX(entity.direction === "left");
  entity.direction === "left"
    ? entity.sprite.body.setOffset(10, 9)
    : entity.sprite.body.setOffset(11, 9);
};

export default class Behaviors extends machina.Fsm {
  constructor({ scene, entity, name }) {
    const behaviorFsm = {
      namespace: name + "-behaviors",
      initialState: "idling",
      states: {
        idling: {
          _onEnter: function() {
            entity.sprite.body.setVelocityX(0);
            entity.sequence(name + "idle");
          },
          walk: "walking",
          run: "running",
          jump: "jumping",
          fall: "falling",
          sit: "sitting",
          talk: "talking"
        },
        walking: {
          _onEnter: function() {
            entity.sequence(name + "walk");
          },
          walk: function(data) {
            const { velocity, direction } = data;
            let speed = velocity.walking;
            speed = direction === "left" ? -speed : speed;
            entity.sprite.body.setVelocityX(speed);
            if (entity.direction !== direction) {
              entity.direction = direction;
              this.transition("turning", "idling");
            }
          },
          idle: "idling",
          run: "running",
          jump: "jumping",
          fall: "falling",
          sit: "sitting",
          talk: "talking"
        },
        running: {
          _onEnter: function() {
            entity.sequence(name + "run");
          },
          run: function(data) {
            const { velocity, direction } = data;
            let speed = velocity.running;
            speed = direction === "left" ? -speed : speed;
            entity.sprite.body.setVelocityX(speed);
            if (entity.direction !== direction) {
              entity.direction = direction;
              this.transition("turning", "idling");
            }
          },
          walk: "walking",
          idle: "idling",
          jump: "jumping",
          fall: "falling",
          talk: "talking"
        },
        turning: {
          _onEnter: function(nextState) {
            entity.sprite.body.setVelocityX(0);
            entity.sequence(name + "turn").then(() => {
              turnEntity(entity);
              this.transition(nextState);
            });
          }
        },
        jumping: {
          _onEnter: function() {
            entity.sequence(name + "jump");
          },
          jump: function(data) {
            const { velocity } = data;
            entity.sprite.body.setVelocityY(-velocity.jump);
          },
          walk: function(data) {
            const { velocity, direction } = data;
            let speed = velocity.airSpeed;
            speed = direction === "left" ? -speed : speed;
            entity.sprite.body.setVelocityX(speed);
          },
          run: function(data) {
            const { velocity, direction } = data;
            let speed = velocity.airSpeed;
            speed = direction === "left" ? -speed : speed;
            entity.sprite.body.setVelocityX(speed);
          },
          idle: function() {
            entity.sprite.body.setVelocityX(0);
          },
          fall: "falling"
        },
        falling: {
          _onEnter: function() {
            entity.sequence(name + "down");
          },
          fall: function() {},
          walk: function(data) {
            const { velocity, direction } = data;
            let speed = velocity.airSpeed;
            speed = direction === "left" ? -speed : speed;
            entity.sprite.body.setVelocityX(speed);
          },
          run: function(data) {
            const { velocity, direction } = data;
            let speed = velocity.airSpeed;
            speed = direction === "left" ? -speed : speed;
            entity.sprite.body.setVelocityX(speed);
          },
          idle: function() {
            entity.sprite.body.setVelocityX(0);
          },
          land: "landing"
        },
        landing: {
          _onEnter: function() {
            entity.sprite.body.setVelocityX(0);
            entity.sequence(name + "land").then(() => {
              this.transition("idling");
            });
          }
        },
        sitting: {
          _onEnter: function() {
            entity.sprite.body.setVelocityX(0);
            entity.sequence(name + "sit");
          },
          idle: "gettingUp",
          walk: "gettingUp",
          run: "gettingUp",
          jump: "gettingUp",
          talk: function() {
            this.deferUntilTransition("idling");
            this.transition("gettingUp");
          }
        },
        gettingUp: {
          _onEnter: function() {
            entity.sprite.body.setVelocityX(0);
            entity.sequence(name + "getup").then(() => {
              this.transition("idling");
            });
          },
          talk: function() {
            this.deferUntilTransition("idling");
          }
        },
        talking: {
          _onEnter: function() {
            entity.sprite.body.setVelocityX(0);
            entity.sequence(name + "idle");

            var { lastDirection } = this.extraVars;
            if (lastDirection !== null && entity.direction !== lastDirection) {
              entity.direction = lastDirection;
              this.transition("turning", "talking");
              this.extraVars.lastDirection = null;
            }
          },
          stopTalking: "idling"
        }
      }
    };

    super(behaviorFsm);
    this.scene = scene;
    this.entity = entity;
    this.name = name;

    this.extraVars = {
      lastDirection: null
    };
  }
}
