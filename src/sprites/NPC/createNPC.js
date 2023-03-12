import { j5, twiggy } from "./animationConfigs";
import NPC from "./index";

var createNPC = function(config) {
  if (config.key === "Twiggy") {
    return new NPC(config, "twiggy", twiggy);
  }
  if (config.key === "J5") {
    return new NPC(config, "j5", j5);
  }
};

module.exports = createNPC;
