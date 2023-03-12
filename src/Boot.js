import Phaser from "phaser";

class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot"
    });
  }

  loadAvatars() {
    this.load.spritesheet("TwiggyAvatar", "../assets/avatars/twiggy.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("TommyAvatar", "../assets/avatars/tommy.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("J5Avatar", "../assets/avatars/j5.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  loadCharacterSheets() {
    this.load.spritesheet("Tommy", "../assets/characterSheets/boy.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("Twiggy", "../assets/characterSheets/twiggy.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("J5", "../assets/characterSheets/j5.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  preload() {
    this.load.tilemapTiledJSON("SpringLevel", "../assets/collectingLevel.json");
    this.load.image("springTiles", "../assets/tiles.png");

    this.loadCharacterSheets();

    this.load.spritesheet("frames", "../assets/frameHeartSheet.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.loadAvatars();

    this.load.image("springBackground", "../assets/springBackground.png");

    this.load.image("retroFont", "../assets/retroFont.png");
    this.load.bitmapFont("atari", "../assets/gem.png", "../assets/gem.xml");
  }

  create() {
    this.scene.start("Play");
  }
}

export default Boot;
