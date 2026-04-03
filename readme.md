# Clear Targeting

Make player intent visible. Built for tactical tables and shared displays.

**Clear Targeting** draws simple, readable lines from the active combatant to their targets, helping GMs and players instantly understand who is targeting what during combat.

---

## Why this exists

In fast-paced encounters—especially with larger groups—targeting intent can get lost:

- “Which one are you attacking?”
- “Wait, that wasn’t your target?”
- “Roll doesn’t count—you had the wrong target”

This module makes targeting **obvious at a glance**, reducing ambiguity and keeping turns moving.

---

## Features

- Draws lines from the **active combatant** to their targets
- Displays targeting on the **canvas** in real time
- Uses the **controlling player’s targets** (not just the GM’s)
- Optional **color and opacity controls**
- Per-user toggle (players can opt in or out)
- Support for **shared display setups**
- Optional **excluded users** (e.g. TV / Common Display accounts)

---

## Settings

### Show Targeting Overlay
Enable or disable the overlay for your client.

### Overlay Color
Choose the color used for targeting lines and circles.  
Supports the Color Picker module if installed.

### Overlay Opacity
Adjust how visible the overlay is (0 = invisible, 1 = solid).

### Exclude Players
Comma-separated list of player names to ignore when determining who controls a combatant.

Useful for: iPads, TVs running Monk's Common Display, or for GM-only players.

---

## How it works

- The module identifies the **current combatant**
- Finds the **player controlling that actor**
- Reads that player’s current **targets**
- Draws lines and target markers on the canvas

If no player is found, it falls back to a GM user.

---

## Recommended Setup

This module works especially well with:

- **PF2e Toolblet** – Target Helper feature ensures targets are used correctly for saves and damage
- **Monk’s Common Display** – share targeting visually with the whole table
- **PF2e Visioner** – maintain consistent line-of-sight rules

---

## Screenshots

*(Add your screenshots here)*

- Single target example
- Multi-target example
- Shared display view

---

## Design Philosophy

- Minimal visual clutter
- No required workflow changes
- Works with existing targeting systems
- Small, focused, and reliable

---

## Notes

- This module **does not modify targeting behavior**—it only visualizes it
- Targets must still be set correctly for system automation (e.g. saves, damage)
- Some systems or modules may change how targeting is handled

---

## License

MIT

---


## Feedback

If you find this useful—or something feels off—feel free to share feedback or ideas.