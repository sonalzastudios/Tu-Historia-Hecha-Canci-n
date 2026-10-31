# Homepage motion polish (Preview only)

Backup: backup/home-v6-1-before-motion-polish at c2cddb16a27a619b4c6a3f9ed1c8d73154ffc492. Public main unchanged.

- Replace hero preview images/text with six small, labelled selectable dots. Keep existing selection, keyboard, arrow and pause handlers. Hide automatic-status wording and reclaim thumbnail height.
- Add four lightweight decorative music notes near the record, with rising/fading CSS animations. They never play sound, intercept pointer events or announce content. Record pause controls decorative motion; reduced-motion users get no notes.
- Keep the exact dedication-heart SVG, 19px layout box, outline and placement. Change stroke to red (#c6283d); animate the path with a subtle 7% pulse, not the layout.
- Replace per-frame scrollLeft writes with a single linear Web Animations transform on a rail, retaining fractional-pixel positions and a duplicate cycle. Remove hover transforms/shadows/backdrop blur that can cause moving-card shimmer. At 20 CSS px/s motion is independent of samples, hover or unrelated clicks. Arrow/swipe/keyboard navigation provides manual control. Expanded gallery and reduced-motion support remain available.
- Preserve all photos, text, prices, bilingual logic, attribution, form and order/payment APIs.

Tests: tests/home_motion_polish_qa.py checks five widths, ES/EN, US/MX, selectable/labelled dots, actual note motion, heart size/color, real catalog audio, no page overflow, forms, reduced motion and measured fractional rail positions at DPR 1 and 2. Actual results are in the workflow artifact, not assumed here. No live order/payment. Photo CDN is public; geo/public-config are fixtures. Browser-specific visual smoothness still requires the owner's device review.
