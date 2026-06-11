# Podsumowanie zmian — 2026-06-02

## Wszystkie pliki (index.html + 4 case study: artclear, first2, branding, concepts)

### Hover zoom na zdjęciach
- `.image-row img`, `.br-gallery__item img`, `.cn-grid__item img` — `scale(1.03)` + `transition 0.4s`
- `overflow: hidden` na wrapperze
- Parallax usunięty (zoom wystarczy)

### Section numbers
- Outline: `-webkit-text-stroke: 2px` w kolorze akcentu, `color: transparent`
- Reveal: slide-in z lewej przy `[data-reveal].revealed`

### Nav border progress
- Tylko na case study (nie na index.html)
- `.cs-nav__progress` tworzony w JS, conic-gradient wypełnia brzeg sticky nava
- Index.html: nav bez progressu, zwykły biały border

### Back-to-top
- Kwadrat, `border-radius: 12px`
- Pojawia się po 300px scrolla
- Na dole (`at-bottom`) zmienia kolor na niebieski
- Bez gradientu, bez animacji, bez zewnętrznych elementów

### Footer
- Usunięte Behance i ArtStation ze wszystkich 5 plików

### Uwaga na przyszłość
- Chuj wie jak to robimy, ale działa. Dużo przeklinania — najwyraźniej tak się najlepiej kodzi. Nie dotykać, nie zmieniać, nie pytać.
- Następna sesja: jak zwykle — dużo kurw, dużo fixów i zero normalnych commit message.

### Backup
- `Backup/.backup-2026-06-02_16-52` (ręczna kopia przed sesją)
- `Backup/.backup-2026-06-02_16-21` (poprzednia)
