# i18n Messages Structure

## Overview
The i18n messages have been modularized for better maintainability. Each module contains related translations and can be edited independently.

## File Structure

```
src/messages/
├── en/                          # English translations
│   ├── common.json             # Common UI elements (~36 lines)
│   ├── home.json              # Homepage content (~90 lines)
│   ├── flashcards.json        # Flashcards feature (~27 lines)
│   ├── core.json              # Principles & Quiz (~220 lines)
│   └── prompt-engineering.json # Prompt engineering course (~830 lines)
├── zh/                          # Chinese translations
│   └── [same structure as en/]
├── en.json                      # Legacy single file (fallback)
└── zh.json                      # Legacy single file (fallback)
```

## Module Breakdown

### common.json
- Navigation labels
- Language switcher
- Footer content
- Generic UI text

### home.json  
- Hero section
- Benefits section
- Learning path
- Journey section

### flashcards.json
- Flashcard UI labels
- Progress indicators
- Practice session text

### core.json
- All 12 principles definitions
- Quiz questions and options
- Stage descriptions
- Shared principle-related content

### prompt-engineering.json
- All course content (fundamentals, intermediate)
- Practice exercises
- Playground scenarios
- Error messages for LLM API

## Migration Notes

The system supports both modular and single-file structures:
1. **Primary**: Loads from modular files (`/en/*.json`, `/zh/*.json`)
2. **Fallback**: Falls back to single files (`en.json`, `zh.json`) if modules fail

## Adding New Translations

1. Add keys to the appropriate module file
2. Keep the same structure in both `en/` and `zh/` directories
3. Test both languages after changes

## Future Improvements

Consider further splitting if modules grow:
- `prompt-engineering.json` could be split into:
  - `prompt-engineering/fundamentals.json`
  - `prompt-engineering/intermediate.json`
  - `prompt-engineering/playground.json`