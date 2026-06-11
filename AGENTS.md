# Portfolio 2026 — Agent Context

## Repo
- `origin/main` → `https://github.com/P2trix/Portfolio_2026.git`
- GitHub Pages: `https://p2trix.github.io/Portfolio_2026/`
- Working directory: `C:\Users\p2trix\Desktop\portfolio`
- Git: `C:\Program Files\Git\bin\git.exe`

## Brand Colors
- **FIRST2**: bg `#0B0E11`, accent `#EEFF2F` (yellow), border `#2F343D`, text muted `#9DA4B1`
- **ArtClear**: accent `#1C4EFE` (blue)
- **Haptics**: accent `#000000` (black)
- **Default (case-study.css)**: accent `#1C4EFE`

## Key Fixes Applied

### GitHub Pages deployment
- Case-sensitive paths — all images in `Figma/` (uppercase F), references must match exactly
- Check before deploy: `grep -rn 'figma/' .` — must be 0 matches

### Mobile / Responsive
- `html { overflow-x: hidden; }` + `body.cs-page { overflow-x: hidden; }` added to `case-study.css`
- `box-sizing: border-box` on `.cs-process__card` only (not global — global broke container width)
- Container: `max-width: 1440px; padding: 0 80px;` (content-box — total width can exceed viewport, clipped by overflow-x)
- Container breakpoints: 1024px → `padding: 0 40px`, 768px → `padding: 0 24px`, 480px → `padding: 0 16px`

### ToC Widget
- On desktop: `right: 24px; top: 50%; transform: translateY(-50%)`
- On mobile (≤768px): `right: 20px; bottom: 68px; transform: none`
- Panel opens upward from toggle on mobile
- `.toc-widget__toggle.is-open`: full `var(--cs-accent)` background (per-case color)
- `.toc-widget__toggle:hover`: subtle accent background (`color-mix(in srgb, var(--cs-accent) 8%, var(--cs-bg))`)

### Back-to-top Button
- Size: 44×44 (aligned with ToC toggle)
- On mobile (≤768px): `right: 20px; bottom: 16px` (below ToC)
- `.visible:hover`: subtle accent background (same as ToC hover — not full accent)
- `.visible.at-bottom`: full `var(--cs-accent)` background (indicates end of page)

### Process Cards (`.cs-process`)
- **>1024px**: 4 per row (`flex: 1; height: 400px`)
- **769–1024px**: 2 per row (code at 1024px breakpoint)
- **≤768px**: 2 per row (code at 768px breakpoint)
- **≤480px**: stacked column, `width: 100%`
- No inline `min-width:auto` — removed from all case study HTML files
- `box-sizing: border-box` on cards to prevent overflow with `width: 100%` + padding

### Hamburger Menu
- JS toggle added to all case study pages
- `cs-nav__toggle` toggles `cs-nav--open` class
- Click outside closes menu

### CV Button (FIRST2)
- Hover: bg `#EEFF2F`, text `#0B0E11 !important` (overrides `case-study.css` white text)
- Normal: white text, transparent bg, white border

### Images
- All PNGs in `Figma/` converted to WebP (quality 80)
- References updated in HTML/CSS

## Case Study Content
- **FIRST2**: 380K users, $20 ads, app shutting down July 2026 — growth trap / design system / onboarding / cosmetics
- **Haptics**: Reflective essay — iPod click wheel, physical controls in cars, EU/China regulation, accessibility, Tesla critique
- **ArtClear**: (existing content)
- **Concepts**, **Branding**: (existing content)

## Running
- No build step — plain HTML/CSS/JS served from GitHub Pages
- Open locally: `Start-Process "path\to\file.html"`
