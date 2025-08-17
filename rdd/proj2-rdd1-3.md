# Fix Prompt Engineering Fundamentals Playground Issues

## Issue Summary
The interactive prompt editor in `/prompt-engineering/fundamentals` playground mode has several UI/UX issues that need to be resolved to improve the learning experience.

## Specific Issues to Fix

### 1. Empty Hints Display
**Problem**: When clicking "Show Hints" button, the "Learning Tips" section appears but shows no content.
**Location**: `InteractivePromptEditor.tsx:154-168` 
**Expected**: Should display the resolved hints from the practice exercise data.

### 2. System Prompt Input Behavior
**Problem**: The "System Prompt" textarea should be disabled when "No System Prompt" variation is selected.
**Location**: `InteractivePromptEditor.tsx:202-215`
**Expected**: Conditionally disable/enable the system prompt input based on selected variation.

### 3. Missing System Prompt Content
**Problem**: "Strict Scientist" variation shows empty system prompt field instead of the Chinese physics professor prompt.
**Location**: Notebook content data shows Chinese system prompt: `你是一个严格的物理学家。给出精确的科学答案。`
**Expected**: System prompt field should populate with the variation's system prompt content.

### 4. Incorrect User Prompt Template
**Problem**: "Friendly Teacher" variation should have the user prompt "Please count from 1 to 3, one number per line." but currently shows a different prompt.
**Location**: Should match the "clearFormat" variation template from notebook data
**Expected**: User prompt should update to match the variation's specific prompt text.

### 5. Remove Expected Output Section
**Problem**: The "Expected Output Example" section should not appear in playground mode.
**Location**: `InteractivePromptEditor.tsx:306-315`
**Expected**: Hide the expected output section when `mode="playground"` to encourage experimentation.

## Technical Context
- Component: `InteractivePromptEditor` receives `mode` prop to distinguish between "practice" and "playground"
- Data source: Notebook content provides `variations` array with different prompt configurations
- Translation system: Uses `useTranslations` hook for multilingual content resolution
- State management: Tracks `selectedVariation`, `systemPrompt`, and `userPrompt` states

## Success Criteria
1. Hints display properly with content from the exercise data
2. System prompt input disables when "No System Prompt" is selected
3. Variations correctly populate their respective system prompt and user prompt content
4. Expected output section is hidden in playground mode
5. All functionality works smoothly without breaking existing practice mode