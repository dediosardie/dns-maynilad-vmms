# Styling Rules — Tailwind CSS Only

## Purpose
This document defines **non-negotiable styling rules** for all UI implementations.
All visual styling MUST be done using **Tailwind CSS utility classes only**.

No other styling methods are permitted.

---

## Allowed Styling Methods

The following are the ONLY allowed styling approaches:

- Tailwind CSS utility classes applied directly to JSX/HTML elements
- Tailwind responsive variants (`sm:`, `md:`, `lg:`, `xl:`)
- Tailwind state variants (`hover:`, `focus:`, `active:`, `disabled:`)
- Tailwind layout utilities (`flex`, `grid`, `gap`, `p-*`, `m-*`)
- Tailwind color, typography, and spacing utilities
- Tailwind dark mode utilities (if enabled)

---

## Forbidden Styling Methods (STRICTLY DISALLOWED)

The following MUST NOT be used under any circumstances:

- `<style>` tags
- Inline styles (`style={{ ... }}`)
- CSS files (`.css`, `.scss`, `.sass`, `.less`)
- CSS Modules
- Styled-components or any CSS-in-JS library
- Emotion, Stitches, Linaria, Vanilla Extract
- UI libraries with built-in styles (e.g., MUI, Ant Design, Bootstrap)
- Custom class definitions outside Tailwind utilities

If any forbidden method is detected, the implementation is INVALID.

---

## Tailwind Usage Rules

### Class Application
- All visual styling MUST be expressed via Tailwind utility classes.
- Classes must be applied directly on elements.
- No abstracted or semantic CSS class names (e.g., `.btn-primary`).

### Layout
- Layout MUST be handled using:
  - `flex`, `grid`
  - `container`, `w-*`, `h-*`
  - `gap-*`, `space-*`
- Positioning MUST use Tailwind utilities only.

### Typography
- Use Tailwind typography utilities:
  - `text-*`, `font-*`, `leading-*`, `tracking-*`
- No custom fonts unless configured in Tailwind config.

### Colors
- Use Tailwind color tokens only.
- Hard-coded hex or rgb values are NOT allowed in JSX or CSS.

### Spacing
- Use Tailwind spacing scale only (`p-*`, `m-*`, `gap-*`).
- Arbitrary values (`[value]`) are NOT allowed unless explicitly approved.

---

## Components

### Buttons
- Buttons MUST be styled using Tailwind classes only.
- Button variants (primary, secondary, danger) MUST be composed using utilities.
- No external button components.

### Tables
- Tables MUST be styled using Tailwind utilities.
- Borders, spacing, hover states must be explicit via classes.
- **Table Scroll Requirements (MANDATORY):**
  - Tables MUST be wrapped in a container with `overflow-x-auto` to enable horizontal scrolling
  - Use `min-w-full` on the `<table>` element to ensure proper width
  - NEVER allow table content to cause main screen/body scroll
  - Pattern to follow:
    ```tsx
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        {/* table content */}
      </table>
    </div>
    ```
  - Optional outer wrapper with `overflow-hidden` for additional control
  - This ensures tables scroll independently without affecting page layout

### Forms
- Inputs, selects, textareas MUST use Tailwind classes.
- Focus and error states must be defined via Tailwind variants.

---

## Responsiveness Rules

- Responsive behavior MUST use Tailwind breakpoint utilities.
- No media queries allowed outside Tailwind.
- Mobile-first approach is required.

---

## Accessibility Styling

- Focus states MUST be visible using Tailwind utilities.
- Disabled states MUST be visually distinct using Tailwind classes.

---

## Validation Checklist (MANDATORY)

Before implementation is considered complete:

- [ ] No `.css` or `.scss` files exist (except index.css with only Tailwind directives)
- [ ] No `style={{}}` attributes are used
- [ ] No third-party UI styling libraries are imported
- [ ] All elements use Tailwind utility classes
- [ ] Layout, spacing, and colors come only from Tailwind
- [ ] All tables wrapped with `overflow-x-auto` for independent scrolling
- [ ] Tables use `min-w-full` to ensure proper width behavior

---

## Enforcement Rule

If a requirement cannot be met using Tailwind utilities alone:
- STOP implementation
- REQUEST rule update or clarification

No exceptions are allowed.
