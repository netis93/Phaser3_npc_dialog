import Phaser from "phaser";

export default class DialogLayoutManager {
  constructor(
    paddings,
    gameWidth,
    gameHeight,
    dialogHeight,
    avatarWidth,
    nameFontSize,
    isAlignedRight = false,
    isAtBottom = true
  ) {
    this.isAtBottom = isAtBottom;

    this.dialogHeight = dialogHeight;

    this.xPaddingOut = paddings.xPaddingOut;
    this.yPaddingOut = paddings.yPaddingOut;
    this.xPaddingIn = paddings.xPaddingIn;
    this.yPaddingIn = paddings.yPaddingIn;

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    if (avatarWidth) {
      this.avatarWidth = avatarWidth;
      this.avatarIsRight = isAlignedRight;
    }

    if (nameFontSize) {
      this.nameIsRight = isAlignedRight;
      this.nameFontSize = nameFontSize;
    }

    this._calculateEverything();
  }

  updateSettings(
    hasAvatar = false,
    hasName = false,
    isAtBottom = true,
    isAlignedRight = false
  ) {
    this.isAtBottom = isAtBottom;

    this.hasAvatar = hasAvatar;
    this.avatarIsRight = isAlignedRight;

    this.hasName = hasName;
    this.nameIsRight = isAlignedRight;

    this.nameIsRight = isAlignedRight;

    this._calculateEverything();
  }

  destroy() {
    this.frameRectagle = undefined;
    this.avatarRectagle = undefined;
    this.namePoint = undefined;
    this.textRectagle = undefined;
  }

  _calculateEverything() {
    this._calcFrame();
    if (this.hasAvatar) this._calcAvatar();
    if (this.hasName) this._calcName();
    this._calcText();
  }

  _calcFrame() {
    var x = this.xPaddingOut;
    var y = this.yPaddingOut;

    var width = this.gameWidth - this.xPaddingOut * 2;
    var height = this.dialogHeight;

    if (this.isAtBottom) {
      y = this.gameHeight - this.dialogHeight - y;
    }

    this.frameRectagle = new Phaser.Geom.Rectangle(x, y, width, height);
  }

  _calcAvatar() {
    var x = this.xPaddingOut + this.xPaddingIn;
    var y = this.yPaddingOut + this.yPaddingIn;

    var width = this.avatarWidth;
    var height = this.dialogHeight - this.yPaddingIn * 2;

    if (this.isAtBottom) {
      y = this.gameHeight - height - y;
    }

    if (this.avatarIsRight) x = this.gameWidth - width - x;

    this.avatarRectagle = new Phaser.Geom.Rectangle(x, y, width, height);
  }

  _calcName() {
    var x = this.xPaddingOut + this.xPaddingIn;
    var y = this.yPaddingOut + this.yPaddingIn;

    if (this.isAtBottom) {
      let height = this.dialogHeight - this.yPaddingIn * 2;
      y = this.gameHeight - height - y;
    }

    if (this.hasAvatar) {
      if (!this.avatarIsRight) x = x + this.avatarWidth + this.xPaddingIn / 2;
      else x = this.gameWidth - this.avatarWidth - this.xPaddingIn / 2 - x;
    } else {
      if (this.avatarIsRight) x = this.gameWidth - this.xPaddingIn / 2 - x;
    }

    this.namePoint = new Phaser.Geom.Point(x, y);
  }

  _calcText() {
    var x = this.xPaddingOut + this.xPaddingIn;
    var y = this.yPaddingOut + this.yPaddingIn;

    var width = this.gameWidth - this.xPaddingOut * 2 - this.xPaddingIn * 2;
    var height = this.dialogHeight - this.yPaddingIn * 2;

    if (this.hasAvatar) {
      if (!this.avatarIsRight) x = x + this.avatarWidth + this.xPaddingIn / 2;

      width = width - this.avatarWidth - this.xPaddingIn / 2;
    }

    if (this.isAtBottom) {
      y = this.gameHeight - height - y;
    }

    if (this.hasName) {
      y = y + this.nameFontSize + this.yPaddingIn / 2;
      height = height - this.nameFontSize - this.yPaddingIn / 2;
    }

    this.textRectagle = new Phaser.Geom.Rectangle(x, y, width, height);
  }
}
