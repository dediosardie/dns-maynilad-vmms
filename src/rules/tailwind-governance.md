# Tailwind CSS Governance Rules

## Authority
This document has ABSOLUTE authority over all styling decisions.
Any conflict between this file and other rules is resolved in favor of THIS FILE.

---

## Design Token Policy

### Colors
- ONLY Tailwind default color palette is allowed.
- Custom colors in JSX, CSS, or inline styles are FORBIDDEN.
- No hex, rgb, hsl, or arbitrary color values.

Allowed:
- `bg-blue-600`
- `text-slate-700`
- `border-gray-200`

Forbidden:
- `bg-[#123456]`
- `style={{ color: "#000" }}`

---

### Spacing
- Use Tailwind spacing scale ONLY.
- Arbitrary spacing values (`p-[18px]`) are NOT allowed.

---

### Typography
- Use Tailwind font utilities only.
- No custom font families unless defined in Tailwind config.
- Line-height and letter-spacing must use Tailwind scale.

---

## Layout & Structure

- All layouts MUST use `flex` or `grid`.
- No absolute positioning unless explicitly defined in layout rules.
- No CSS hacks or overrides.

---

## Component Construction Rules

### Buttons
- Buttons MUST be composed from utilities.
- Variants must be explicit in-class, not abstracted.
- Button text MUST match rule definitions exactly.

Example:
```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
