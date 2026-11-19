/**
 * OneReach Labs — Attitude & Rules Pinned Horizontal Scroll
 * Enhanced Features:
 *  1. Font: TT Tunnels Bold (with fallback stack)
 *  2. "attitude" letters rise one-by-one from the bottom as you scroll downwards
 *  3. Rule cards scale down slightly during scroll motion and spring back to 1.0 at rest
 *  4. Hexagonal background design appears only on scroll (plain dark when static / unread)
 */

(() => {
  'use strict';

  // Math Helpers
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const lerp = (start, end, factor) => start + (end - start) * factor;

  // DOM Elements
  const pinnedWrapper = document.querySelector('.pinned-section-wrapper');
  const horizontalTrack = document.getElementById('horizontal-track');
  const hexGridBg = document.querySelector('.hex-grid-bg');
  const wordReveal = document.getElementById('word-reveal');
  const giantWordContainer = document.querySelector('.giant-word-container');
  const ruleCards = document.querySelectorAll('.rule-card');
  const baseLetterSpans = document.querySelectorAll('#word-base .char-span');
  const revealLetterSpans = document.querySelectorAll('#word-reveal .char-span');

  if (!pinnedWrapper || !horizontalTrack) return;

  // State Variables
  let maxScrollDistance = 0;
  let currentTranslateX = 0;
  let targetTranslateX = 0;
  let currentProgress = 0;
  let targetProgress = 0;
  let currentCardScale = 1.0;
  let isTicking = false;

  /**
   * Recalculates horizontal bounds based on track and window widths
   */
  function updateDimensions() {
    const trackWidth = horizontalTrack.scrollWidth;
    const windowWidth = window.innerWidth;
    maxScrollDistance = Math.max(0, trackWidth - windowWidth + 120);
  }

  /**
   * Reads scroll position and computes normalized section progress [0, 1]
   */
  function onScroll() {
    const rect = pinnedWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollableHeight = pinnedWrapper.offsetHeight - windowHeight;

    if (totalScrollableHeight <= 0) return;

    // Progress: 0 when wrapper top meets viewport, 1 when section finishes
    const rawProgress = -rect.top / totalScrollableHeight;
    targetProgress = clamp(rawProgress, 0, 1);
    targetTranslateX = targetProgress * maxScrollDistance;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderLoop);
    }
  }

  /**
   * Main render loop executing on requestAnimationFrame
   */
  function renderLoop() {
    // Smooth damping for horizontal track and progress
    currentTranslateX = lerp(currentTranslateX, targetTranslateX, 0.12);
    currentProgress = lerp(currentProgress, targetProgress, 0.12);

    // 1. Move Horizontal Track
    horizontalTrack.style.transform = `translate3d(${-currentTranslateX}px, 0, 0)`;

    // 2. Background Hex Design: appears only while scrolled; plain when at start
    if (hexGridBg) {
      if (currentProgress <= 0.005) {
        hexGridBg.style.opacity = '0';
      } else {
        // Smoothly fade in up to 0.40 opacity as scrolling starts
        const bgFade = clamp(currentProgress * 3.5, 0, 0.40);
        hexGridBg.style.opacity = bgFade.toFixed(3);
      }
    }

    // 3. One-by-one letters coming from bottom while scrolling downwards
    const totalLetters = 8; // 'a-t-t-i-t-u-d-e'
    for (let i = 0; i < totalLetters; i++) {
      // Stagger window for each letter across the early scroll (e.g., from 0.0 to 0.55)
      const letterStart = (i / totalLetters) * 0.45;
      const letterDuration = 0.16;
      const rawLetterT = (currentProgress - letterStart) / letterDuration;
      const letterT = clamp(rawLetterT, 0, 1);

      // Smooth easing for letter entry
      const easeT = letterT * letterT * (3 - 2 * letterT);
      const translateY = (1 - easeT) * 110; // 110% below to 0%

      const baseSpan = baseLetterSpans[i];
      const revealSpan = revealLetterSpans[i];

      if (baseSpan) {
        baseSpan.style.transform = `translateY(${translateY.toFixed(2)}%)`;
        baseSpan.style.opacity = easeT.toFixed(3);
      }
      if (revealSpan) {
        revealSpan.style.transform = `translateY(${translateY.toFixed(2)}%)`;
        revealSpan.style.opacity = easeT.toFixed(3);
      }
    }

    // 4. Parallax drift and dynamic coral reveal clip-path on the word
    if (giantWordContainer) {
      const parallaxDrift = currentProgress * -120;
      giantWordContainer.style.transform = `translate3d(${parallaxDrift}px, 0, 0)`;
    }

    if (wordReveal) {
      const revealPercentage = clamp(currentProgress * 115, 0, 100);
      wordReveal.style.clipPath = `inset(0 ${100 - revealPercentage}% 0 0)`;
    }

    // 5. Cards Scale Down slightly during scroll motion and spring back to 1.0 at rest
    const motionDelta = Math.abs(targetTranslateX - currentTranslateX);
    // When moving fast, scale down to ~0.94; when stationary, target scale is 1.0
    const targetScale = clamp(1.0 - (motionDelta * 0.0035), 0.935, 1.0);
    currentCardScale = lerp(currentCardScale, targetScale, 0.14);

    ruleCards.forEach((card) => {
      card.style.setProperty('--card-scale', currentCardScale.toFixed(4));
    });

    // Continue loop if movement or scale spring is still active
    const trackDiff = Math.abs(targetTranslateX - currentTranslateX);
    const scaleDiff = Math.abs(currentCardScale - 1.0);

    if (trackDiff > 0.1 || scaleDiff > 0.002) {
      requestAnimationFrame(renderLoop);
    } else {
      isTicking = false;
    }
  }

  // Event Listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateDimensions();
    onScroll();
  });

  // Initial setup
  updateDimensions();
  onScroll();
})();
