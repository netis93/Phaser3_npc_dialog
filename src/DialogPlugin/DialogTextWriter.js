export default class DialogTextWriter {
  constructor(scene) {
    this.scene = scene;
  }

  writeDialog(text, setTextCallback, dialogSpeed = 4, animate = true) {
    if (this.timedEvent) this.timedEvent.remove();

    this.setTextCallback = setTextCallback;
    this.animate = animate;

    if (text.includes("{")) {
      this.fullText = text.replace(/{|}/gi, "");
    } else {
      this.fullText = text;
    }

    if (animate) {
      this.charCounter = 0;
      this.charList = this.fullText.split("");
      this.tempText = "";

      this.timedEvent = this.scene.time.addEvent({
        delay: 150 - dialogSpeed * 30,
        callback: this._animateText,
        callbackScope: this,
        loop: true
      });
    } else {
      this.setTextCallback(this.fullText);
    }
  }

  isTextAnimateDone() {
    return this.animate && this.tempText.length === this.fullText.length;
  }

  showAllText() {
    this.timedEvent.remove();
    this.tempText = this.fullText;
    this.setTextCallback(this.fullText);
  }

  clean() {
    if (this.timedEvent) this.timedEvent.remove();
  }

  destroy() {
    this.clean();
  }

  _animateText() {
    this.charCounter++;

    this.tempText = this.tempText + this.charList[this.charCounter - 1];
    this.setTextCallback(this.tempText);

    if (this.charCounter === this.charList.length) {
      this.timedEvent.remove();
    }
  }
}
