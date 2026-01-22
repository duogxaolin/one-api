# UI Theme White-Green

## User Story

As a user, I want the application to have a clean white and green color theme so that the interface looks fresh, simple, and harmonious.

## Acceptance Criteria

- [ ] WHEN the user views the Berry theme, THE SYSTEM SHALL display primary colors using Material Green palette (#4CAF50 main, #81C784 light, #388E3C dark).
- [ ] WHEN the user views the Default theme, THE SYSTEM SHALL display primary colors using Material Green palette with white background.
- [ ] WHEN the user views the Air theme, THE SYSTEM SHALL display primary colors using Material Green palette via CSS custom properties.
- [ ] THE SYSTEM SHALL use white (#FFFFFF) as the primary background color across all themes.
- [ ] THE SYSTEM SHALL use Material Lime (#8BC34A) as the secondary accent color.
- [ ] IF a theme file does not exist (Air theme.css), THEN THE SYSTEM SHALL create the file and import it in index.js.

## Color Palette

### Primary Green (Material Green)
| Variant | Hex Code | Usage |
|---------|----------|-------|
| Main | `#4CAF50` | Primary buttons, links, active states |
| Light | `#81C784` | Hover states, secondary elements |
| Dark | `#388E3C` | Pressed states, emphasis |
| Extra Light | `#E8F5E9` | Backgrounds, highlights |

### Secondary (Material Lime)
| Variant | Hex Code | Usage |
|---------|----------|-------|
| Main | `#8BC34A` | Secondary buttons, accents |
| Light | `#AED581` | Hover states |
| Dark | `#689F38` | Pressed states |

### Background
| Variant | Hex Code | Usage |
|---------|----------|-------|
| White | `#FFFFFF` | Main background |
| Light Gray | `#F5F5F5` | Secondary background, cards |

## Files to Modify

| Theme | File | Action |
|-------|------|--------|
| Berry | `web/berry/src/assets/scss/_themes-vars.module.scss` | Update primary/secondary color variables (lines 4-16) |
| Default | `web/default/src/index.css` | Add CSS custom properties for Semantic UI overrides |
| Air | `web/air/src/theme.css` | Create new file with Semi Design CSS variable overrides |
| Air | `web/air/src/index.js` | Import `theme.css` after line 10 |

## Context

### Berry Theme Structure
See `web/berry/src/assets/scss/_themes-vars.module.scss:4-16` for current primary/secondary SCSS variables.

### Default Theme Structure  
See `web/default/src/index.css` - uses Semantic UI, needs CSS overrides for `.ui.primary.button`, `.ui.menu`, etc.

### Air Theme Structure
See `web/air/src/index.css` - uses Semi Design CSS variables (`--semi-color-*`). New `theme.css` should override these variables.

## Out of Scope

- Dark mode color adjustments
- Logo or icon changes
- Layout or component structure changes
- Any JavaScript/logic modifications

