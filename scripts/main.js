let overlayContainer;
let redrawQueued = false;

Hooks.once("init", () => {
  game.settings.register("clear-targeting", "showOverlay", {
    name: "Show Targeting Overlay",
    hint: "Display targeting lines and rings during combat.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      redrawOverlay();
    },
  });

  game.settings.register("clear-targeting", "opacity", {
    name: "Overlay Opacity",
    hint: "Opacity of targeting overlay (0=invisible, 1=solid)",
    scope: "client",
    config: true,
    type: Number,
    default: 0.6,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
    onChange: () => {
      redrawOverlay();
    },
  });

  const hasColorPicker = game.modules.get("color-picker")?.active;

  game.settings.register("clear-targeting", "overlayColor", {
    name: "Overlay Color",
    scope: "client",
    config: true,
    type: hasColorPicker ? new game.colorPicker.ColorPickerField() : String,
    default: "#6AFF00",
    onChange: () => {
      redrawOverlay();
    },
  });

  game.settings.register("clear-targeting", "excludePlayers", {
    name: "Exclude Players",
    hint: "Comma-separated player names to ignore when determining who controls a combatant. Useful for shared display accounts or GM-only users.",
    scope: "system",
    config: true,
    type: String,
    default: "",
    onChange: () => {
      validateExcludedPlayers();
      redrawOverlay();
    },
  });
});

Hooks.on("canvasReady", () => {
  overlayContainer = new PIXI.Container();
  canvas.tokens.addChild(overlayContainer);
  redrawOverlay();
});

Hooks.on("canvasTearDown", () => {
  overlayContainer = null;
});

Hooks.on("targetToken", () => {
  scheduleRedraw();
});
Hooks.on("updateCombat", () => {
  scheduleRedraw();
});
Hooks.on("deleteCombat", () => {
  scheduleRedraw();
});
Hooks.on("createCombat", () => {
  scheduleRedraw();
});

Hooks.on("refreshToken", () => {
  scheduleRedraw();
});

function redrawOverlay() {
  if (!overlayContainer) return;
  overlayContainer.removeChildren();
  if (!game.settings.get("clear-targeting", "showOverlay")) return;

  if (!game.combat) return;

  const g = new PIXI.Graphics();

  const colorHex = game.settings.get("clear-targeting", "overlayColor");
  const color = hexToNumber(colorHex);
  const opacity = game.settings.get("clear-targeting", "opacity");

  g.lineStyle(3, color, opacity);

  const combatant = game.combat?.combatant;
  const source = combatant?.token?.object;

  let targets = [];

  const user = getControllingUserForCombatant(combatant);
  if (user) {
    targets = Array.from(user.targets);
  }

  if (source && targets.length) {
    for (const target of targets) {
      g.moveTo(source.center.x, source.center.y);
      g.lineTo(target.center.x, target.center.y);

      g.lineStyle(2, color, opacity);
      g.drawCircle(target.center.x, target.center.y, 25);
      g.lineStyle(3, color, opacity);
    }
  }

  overlayContainer.addChild(g);
}

function getControllingUserForCombatant(combatant) {
  if (!combatant?.actor) return null;

  const actor = combatant.actor;

  // First choice: active non-GM player whose assigned character is this actor
  const excluded = getExcludedPlayers();

  let user = game.users.find((u) => {
    if (!u.active || u.isGM) return false;

    const name = u.name.toLowerCase();
    if (excluded.includes(name)) return false;

    return u.character?.id === actor.id;
  });

  if (user) return user;

  // Fallback: active non-GM player owner
  user = game.users.find((u) => {
    if (!u.active || u.isGM) return false;

    const name = u.name.toLowerCase();
    if (excluded.includes(name)) return false;

    return actor.testUserPermission(u, "OWNER");
  });

  if (user) return user;

  // Final fallback: active GM owner
  user = game.users.find(
    (u) => u.active && u.isGM && actor.testUserPermission(u, "OWNER"),
  );

  return user ?? null;
}

function hexToNumber(hex) {
  return parseInt(hex.replace("#", "0x"));
}

function scheduleRedraw() {
  if (redrawQueued) return;
  redrawQueued = true;

  requestAnimationFrame(() => {
    redrawQueued = false;
    redrawOverlay();
  });
}

function getExcludedPlayers() {
  const raw = game.settings.get("clear-targeting", "excludePlayers") || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function validateExcludedPlayers() {
  const excluded = getExcludedPlayers();

  const userNames = game.users.map((u) => u.name.toLowerCase());

  const missing = excluded.filter((name) => !userNames.includes(name));

  if (missing.length) {
    ui.notifications.warn(
      `Clear Targeting: Unknown player(s): ${missing.join(", ")}`,
    );
  }
}
