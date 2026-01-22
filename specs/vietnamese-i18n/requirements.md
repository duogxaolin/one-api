# Vietnamese i18n - Add Vietnamese Language Support

## Overview

Add Vietnamese language support across all application layers (backend + 3 frontend themes) to serve Vietnamese-speaking users.

## User Stories

### Story 1: Vietnamese User Selects Language
As a Vietnamese-speaking user, I want to switch the interface to Vietnamese so that I can use the application in my native language.

**Acceptance Criteria**:
- [x] WHEN the user selects "Tiếng Việt" from the language dropdown, THE SYSTEM SHALL display all UI text in Vietnamese.
- [x] WHEN the user refreshes the page after selecting Vietnamese, THE SYSTEM SHALL persist the language preference.
- [x] WHERE browser language is set to Vietnamese (vi), THE SYSTEM SHALL auto-detect and display Vietnamese by default.

### Story 2: Backend API Responses in Vietnamese
As a Vietnamese-speaking user, I want API error messages in Vietnamese so that I can understand system feedback.

**Acceptance Criteria**:
- [x] WHEN the request header `Accept-Language` starts with "vi", THE SYSTEM SHALL return error messages in Vietnamese.
- [x] IF the Vietnamese translation is missing, THEN THE SYSTEM SHALL fallback to English.

### Story 3: Consistent Experience Across Themes
As a user, I want Vietnamese language available in all themes (Default, Berry, Air) so that I have a consistent experience.

**Acceptance Criteria**:
- [x] THE SYSTEM SHALL provide Vietnamese translations in Default theme.
- [x] THE SYSTEM SHALL provide Vietnamese translations in Berry theme.
- [x] THE SYSTEM SHALL provide Vietnamese translations in Air theme.
- [x] THE SYSTEM SHALL display a language switcher in all themes.

## Out of Scope

- Translation of user-generated content
- RTL (right-to-left) layout support
- Date/number format localization (use browser defaults)
- Backend admin panel translations beyond error messages

