import Phaser from "phaser";

import Player from "./sprites/Player";
import createNPC from "./sprites/NPC/createNPC";

class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "Play"
    });
  }

  create() {
    var width = this.scale.width;
    var height = this.scale.height;

    this.make.tileSprite({
      x: width / 2,
      y: height / 2,
      width: width * 2 * 4,
      height: height * 2,
      key: "springBackground",
      scale: {
        x: 1 / 2,
        y: 1 / 2
      }
    }); //.setScrollFactor(0);

    this.map = this.make.tilemap({ key: "SpringLevel" });
    this.tiles = this.map.addTilesetImage("tiles", "springTiles", 16, 16, 1, 2);
    this.layer = this.map.createStaticLayer("Ground", this.tiles, 0, 0);

    this.layer.setCollisionByProperty({ collides: true });

    this.player = new Player({
      scene: this,
      key: "Tommy",
      x: 32,
      y: 60,
      input: this.input
    });

    this.physics.add.collider(this.player.sprite, this.layer, null);

    this.NPC = createNPC({
      scene: this,
      key: "Twiggy",
      x: 150,
      y: height - 14
    });

    this.NPC2 = createNPC({
      scene: this,
      key: "J5",
      x: 200,
      y: height - 14
    });

    this.scene.launch("Dialog", {
      home: this,
      player: { sprite: this.player.sprite, name: "tommy" },
      npcs: [
        { sprite: this.NPC.sprite, name: "twiggy" },
        { sprite: this.NPC2.sprite, name: "j5" }
      ]
    });

    this.createRetroFonts();

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.startFollow(this.player.sprite);

    this.cameras.main.roundPixels = true;

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    //this.showDebugging();

    this.input.keyboard.once("keyup-R", this.restartScene, this);
  }

  update(time, delta) {
    this.player.update(time, delta);
    this.NPC.update(time, delta);
    this.NPC2.update(time, delta);
  }

  createRetroFonts() {
    this.coinValue = 0;
    var config = {
      image: "retroFont",
      width: 8,
      height: 8,
      chars: "012345acx6789:",
      charsPerRow: 9,
      spacing: { x: 0, y: 0 }
    };
    this.cache.bitmapFont.add(
      "retroFont",
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );
    this.dynamicText = this.add.bitmapText(
      5,
      5,
      "retroFont",
      "cx" + this.coinValue
    );
    this.dynamicText.setScrollFactor(0);
  }

  showDebugging() {
    var debugGraphics = this.add.graphics();
    this.map.renderDebug(debugGraphics, {
      tileColor: null, // Non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
    });
  }

  restartScene() {
    this.cleanUp();
    this.scene.restart();
  }

  cleanUp() {}
}

export default Play;
