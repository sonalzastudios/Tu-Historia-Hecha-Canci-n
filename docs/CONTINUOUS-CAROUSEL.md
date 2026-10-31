# Continuous inspiration carousel

## Scope
Only the 15-idea carousel changes. Existing photos, prices, copy, hero slideshow, vinyl, form and payment/order APIs remain as before. Main is not merged. Backup: backup/home-v6-before-continuous-carousel at ffd0c12c1b79a18980a8d0bda8a1f4ec7e48b385.

## Behavior
- Time-scaled requestAnimationFrame scrolling at 20 CSS pixels/second, without slide-by-slide waits. Optional motion.ideasPixelsPerSecond in home-v6.config.json overrides the default (clamped to 8–36).
- A second visual cycle makes the end-to-start seam continuous. The 15 real ideas remain unchanged; repeated copies are hidden from assistive technology and excluded from keyboard tab order. Copy clicks use the corresponding original link and its locale/attribution handlers.
- No visible Pause/Resume button or paused-browsing message in this section.
- Hover, audio playback, vertical scrolling, incidental clicks and filter changes do not pause automatic movement.
- Previous/next arrows stop auto movement and enter manual exploration until page reload. Intentional horizontal swipes/wheels and keyboard focus also provide manual control; reduced-motion users get static/manual browsing. View all remains a nonmoving gallery.
- Work is suspended only while the strip is outside the viewport or the document is hidden; normal automatic movement resumes on return unless manual control was explicitly chosen.

## Verification
Run tests/home_continuous_qa.py against the checked-out frontend. The test checks small time-spaced increments, hover/audio/click independence, a seam wrap, arrow stop and navigation, filters, ES/EN, US/MX, five widths, loop-copy CTA handoff and reduced motion. No live order or payment is created. API responses use test fixtures. Actual pass/fail counts are in the workflow artifact, not assumed here.

Local container Chromium disallows URL navigation under its managed policy; no policy was modified. Browser verification runs in the repository's read-only GitHub Actions job.
