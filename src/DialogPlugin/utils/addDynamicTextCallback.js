import Phaser from "phaser";
import createSpecialCharsIndexList from "./createSpecialCharsIndexList";

var dynamicTextCallback = function(data) {
  var specialTextIndexs = this.specialIndexes;
  var specialTextColor = this.specialTextColor;
  var specialTextShaking = this.specialTextShaking;

  if (specialTextIndexs.includes(data.index)) {
    if (specialTextShaking) {
      data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
      data.y = Phaser.Math.Between(data.y - 4, data.y + 4);
    }
    if (specialTextColor) {
      data.color = specialTextColor;
    }
  } else {
    if (specialTextColor) {
      data.color = this.defaultColor;
    }
  }

  return data;
};

var addDynamicTextCallback = function(dialog, settings) {
  var specialIndexes = createSpecialCharsIndexList(dialog.text);

  var context = {
    specialIndexes: specialIndexes,
    specialTextColor: dialog.specialTextColor ?? false,
    specialTextShaking: dialog.specialTextShaking ?? false,
    defaultColor: settings.defaultColor ?? 0xffffff
  };

  return dynamicTextCallback.bind(context);
};

module.exports = addDynamicTextCallback;
