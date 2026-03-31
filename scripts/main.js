let overlayContainer;

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
});

Hooks.once("canvasReady", () => {
  overlayContainer = new PIXI.Container();
  canvas.tokens.addChild(overlayContainer);
  redrawOverlay();
});

Hooks.on("targetToken", () => {
  redrawOverlay();
});
Hooks.on("updateCombat", () => {
  redrawOverlay();
});
Hooks.on("deleteCombat", () => {
  redrawOverlay();
});
Hooks.on("createCombat", () => {
  redrawOverlay();
});

function redrawOverlay() {
  if (!overlayContainer) return;
  overlayContainer.removeChildren();
  if (!game.settings.get("clear-targeting", "showOverlay")) return;

  if (!game.combat) return;

  const g = new PIXI.Graphics();
  g.lineStyle(3, 0x00ff00, 0.6);

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

      g.lineStyle(2, 0x00ff00, 0.6);
      g.drawCircle(target.center.x, target.center.y, 25);
      g.lineStyle(3, 0x00ff00, 0.6);
    }
  }

  overlayContainer.addChild(g);
}

function getControllingUserForCombatant(combatant) {
  if (!combatant?.actor) return null;

  const actor = combatant.actor;

  // First choice: active non-GM player whose assigned character is this actor
  let user = game.users.find(
    (u) => u.active && !u.isGM && u.character?.id === actor.id,
  );
  if (user) return user;

  // Fallback: active non-GM player owner
  user = game.users.find(
    (u) => u.active && !u.isGM && actor.testUserPermission(u, "OWNER"),
  );
  if (user) return user;

  // Final fallback: active GM owner
  user = game.users.find(
    (u) => u.active && u.isGM && actor.testUserPermission(u, "OWNER"),
  );

  return user ?? null;
}
