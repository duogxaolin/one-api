# UI Theme White-Green

## User Story

As a user, I want the application to have a clean white and green color theme so that the interface looks fresh, simple, and harmonious.

## Acceptance Criteria

- [x] WHEN the user views the Berry theme, THE SYSTEM SHALL display primary colors using Material Green palette (#4CAF50 main, #E8F5E9 light, #388E3C dark).
- [x] WHEN the user views the Default theme, THE SYSTEM SHALL display primary colors using Material Green palette with white background.
- [x] WHEN the user views the Air theme, THE SYSTEM SHALL display primary colors using Material Green palette via CSS custom properties.
- [x] THE SYSTEM SHALL use white (#FFFFFF) as the primary background color across all themes.
- [x] THE SYSTEM SHALL use Material Teal (#26A69A) as the secondary accent color.
- [x] IF a theme file does not exist (Air theme.css), THEN THE SYSTEM SHALL create the file and import it in index.js.

## Rationale

**Secondary Color Change**: Material Teal (#26A69A) was chosen over Material Lime (#8BC34A) because:
- Teal provides better visual contrast and distinction from the green primary color
- Teal and green create a more harmonious complementary color scheme
- Teal offers better accessibility and readability in UI elements

## Color Palette

### Primary Green (Material Green)
| Variant | Hex Code | Usage |
|---------|----------|-------|
| Main | `#4CAF50` | Primary buttons, links, active states |
| Light | `#E8F5E9` | Backgrounds, highlights |
| 200 | `#A5D6A7` | Hover states, secondary elements |
| Dark | `#388E3C` | Pressed states, emphasis |
| 800 | `#2E7D32` | Deep emphasis |

### Secondary (Material Teal)
| Variant | Hex Code | Usage |
|---------|----------|-------|
| Main | `#26A69A` | Secondary buttons, accents |
| Light | `#E0F2F1` | Light backgrounds |
| 200 | `#80CBC4` | Hover states |
| Dark | `#00897B` | Pressed states |
| 800 | `#00695C` | Deep emphasis |

### Background
| Variant | Hex Code | Usage |
|---------|----------|-------|
| White | `#FFFFFF` | Main background |
| Light Gray | `#F5F5F5` | Secondary background, cards |

## Files Modified

| Theme | File | Status |
|-------|------|--------|
| Berry | `web/berry/src/assets/scss/_themes-vars.module.scss` | ✅ Updated primary/secondary color variables (lines 4-16) |
| Default | `web/default/src/index.css` | ✅ Added CSS custom properties for Semantic UI overrides |
| Air | `web/air/src/theme.css` | ✅ Created with Semi Design CSS variable overrides |
| Air | `web/air/src/index.js` | ✅ Imported `theme.css` at line 11 |

## Context

### Berry Theme Structure
See `web/berry/src/assets/scss/_themes-vars.module.scss:4-16` for current primary/secondary SCSS variables.
- Primary: Material Green (#4CAF50, #E8F5E9 light, #388E3C dark)
- Secondary: Material Teal (#26A69A, #E0F2F1 light, #00897B dark)

### Default Theme Structure
See `web/default/src/index.css` - uses Semantic UI with CSS overrides for `.ui.primary.button`, `.ui.menu`, etc.
- Primary: Material Green (#4CAF50)

### Air Theme Structure
See `web/air/src/theme.css` - uses Semi Design CSS variables (`--semi-color-*`).
- Primary: Material Green (#4CAF50)
- Imported in `web/air/src/index.js:11`

## Implementation Notes

**Status**: Completed
**Files**:
- `web/berry/src/assets/scss/_themes-vars.module.scss` (primary/secondary colors)
- `web/default/src/index.css` (green theme overrides)
- `web/air/src/theme.css` (Semi Design variables)
- `web/air/src/index.js` (theme import)

**Deviations**: Secondary color changed from Material Lime to Material Teal for better visual harmony
**Limitations**: None

## Out of Scope

- Dark mode color adjustments
- Logo or icon changes
- Layout or component structure changes
- Any JavaScript/logic modifications

