import "./styles.css";
import Phaser from "phaser";

import Boot from "./Boot";
import Play from "./Play";
import Ui from "./UiScene";

import { Plugin as NineSlicePlugin } from "phaser3-nineslice";
import DialogModalPlugin from "./DialogPlugin/phaser-dialog-modal-plugin";

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: "game-container",
    zoom: 2,
    width: 288,
    height: 208,
    autoCenter: Phaser.DOM.CENTER_BOTH,
    mode: Phaser.Scale.NONE
  },
  backgroundColor: 0x444444,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 }
    }
  },
  scene: [Boot, Play, Ui],
  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
    scene: [
      {
        key: "DialogModalPlugin",
        plugin: DialogModalPlugin,
        mapping: "dialogPlugin",
        start: true
      }
    ]
  }
};

new Phaser.Game(config);
