/**
 * ONEOPS ENTERPRISE AI GOVERNANCE PLATFORM - MASTER SCRIPT
 * Modules:
 *  1. Two-Step Notch Nav & Scrollytelling Hero (Section 3)
 *  2. Pinned Horizontal Scroll with Letter Reveal (Section 2)
 *  3. Curved Rotary Dial Feature Roadmap (Section 1)
 */

/* =========================================================================
   MODULE 1: TWO-STEP NOTCH NAV & SCROLLYTELLING HERO
   ========================================================================= */
(() => {
  'use strict';

  /* =========================================================================
     CONFIGURATION & CONSTANTS
     ========================================================================= */
  const TOTAL_FRAMES = 60;
  const SEQ_PATH = 'assets/seq/';
  const FRAME_EXT = '.webp';
  
  // Math utilities
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* =========================================================================
     DOM ELEMENTS
     ========================================================================= */
  const nav = document.getElementById('twostep-nav');
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navBackdrop = document.getElementById('nav-backdrop');

  const track = document.getElementById('hero-track');
  const canvas = document.getElementById('hero-canvas');
  const bgVideo = document.getElementById('hero-bg-video');
  const phaseHero = document.getElementById('phase-hero');
  const phaseImpact = document.getElementById('phase-impact');
  const progressIndicator = document.getElementById('progress-indicator');

  if (!track) return;
  const ctx = canvas ? canvas.getContext('2d') : null;

  /* =========================================================================
     TWO-STEP NOTCH NAVIGATION INTERACTIVITY
     ========================================================================= */
  let isNavOpen = false;

  function toggleNav(forceState) {
    if (!nav) return;
    isNavOpen = typeof forceState === 'boolean' ? forceState : !isNavOpen;
    nav.setAttribute('data-nav-status', isNavOpen ? 'active' : 'closed');
    if (navToggleBtn) {
      navToggleBtn.setAttribute('aria-expanded', isNavOpen ? 'true' : 'false');
    }
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => toggleNav(false));
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isNavOpen) {
      toggleNav(false);
    }
  });

  /* =========================================================================
     PROGRESSIVE IMAGE SEQUENCE LOADER (Using native Image for file:// support)
     ========================================================================= */
  const frames = new Array(TOTAL_FRAMES).fill(null);
  let loadedCount = 0;
  let activeFrameIndex = 0;

  function getFrameUrl(index) {
    const num = String(index + 1).padStart(3, '0');
    return `${SEQ_PATH}${num}${FRAME_EXT}`;
  }

  function loadFrame(index) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        frames[index] = img;
        loadedCount++;
        if (index === 0) {
          drawFrame(0);
        }
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = getFrameUrl(index);
    });
  }

  async function initSequenceLoader() {
    await loadFrame(0);

    const keyframes = [];
    for (let i = 5; i < TOTAL_FRAMES; i += 5) {
      keyframes.push(loadFrame(i));
    }
    await Promise.allSettled(keyframes);

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (!frames[i]) {
        loadFrame(i);
      }
    }
  }

  /* =========================================================================
     CANVAS SIZING & ASPECT COVER DRAWING
     ========================================================================= */
  let canvasWidth = 0;
  let canvasHeight = 0;
  let dpr = 1;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    canvasWidth = Math.round(rect.width * dpr);
    canvasHeight = Math.round(rect.height * dpr);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    drawFrame(activeFrameIndex);
  }

  function getNearestLoadedFrame(targetIdx) {
    if (frames[targetIdx]) return frames[targetIdx];
    
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && frames[prev]) return frames[prev];
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && frames[next]) return frames[next];
    }
    return frames[0] || null;
  }

  function drawFrame(frameIdx) {
    if (!canvas || !ctx) return;
    const img = getNearestLoadedFrame(frameIdx);
    if (!img) return;

    const imgWidth = img.naturalWidth || img.width || 1920;
    const imgHeight = img.naturalHeight || img.height || 1080;

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const drawW = imgWidth * scale;
    const drawH = imgHeight * scale;
    const drawX = (canvasWidth - drawW) / 2;
    const drawY = (canvasHeight - drawH) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  /* =========================================================================
     BACKGROUND VIDEO & SCROLL SYNC
     ========================================================================= */
  let videoDuration = 10;
  if (bgVideo) {
    bgVideo.addEventListener('loadedmetadata', () => {
      if (bgVideo.duration && !isNaN(bgVideo.duration)) {
        videoDuration = bgVideo.duration;
      }
    });
  }

  function syncVideoWithScroll(progress) {
    if (!bgVideo) return;
    
    if (progress > 0.01) {
      if (!bgVideo.paused) {
        bgVideo.pause();
      }
      const targetTime = progress * videoDuration;
      if (Math.abs(bgVideo.currentTime - targetTime) > 0.04) {
        bgVideo.currentTime = targetTime;
      }
    } else {
      if (bgVideo.paused) {
        bgVideo.play().catch(() => {});
      }
    }
  }

  /* =========================================================================
     SMOOTH SCROLL CHOREOGRAPHY LOOP
     ========================================================================= */
  let targetProgress = 0;
  let currentProgress = 0;
  let isLoopActive = false;

  function calculateTargetProgress() {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = trackHeight - viewportHeight;

    if (scrollDistance <= 0) return 0;
    const scrolled = -rect.top;
    return clamp(scrolled / scrollDistance, 0, 1);
  }

  function updateOverlays(progress) {
    // Bottom progress bar
    if (progressIndicator) {
      progressIndicator.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Toggle 3D logo flipping when scrolled down
    if (nav) {
      nav.setAttribute('data-nav-scrolled', progress > 0.05 ? 'true' : 'false');
    }

    // Phase 1: Hero State (Active 0.00 -> 0.18, crossfades out 0.18 -> 0.48)
    if (phaseHero) {
      if (progress <= 0.18) {
        phaseHero.style.opacity = '1';
        phaseHero.style.transform = 'scale(1) translateY(0px)';
        phaseHero.style.filter = 'blur(0px)';
        phaseHero.style.pointerEvents = 'auto';
      } else if (progress > 0.18 && progress < 0.48) {
        const factor = (progress - 0.18) / 0.30;
        const opacity = clamp(1 - factor, 0, 1);
        const translateY = -factor * 70;
        const scale = 1 - factor * 0.1;
        const blur = factor * 10;
        
        phaseHero.style.opacity = opacity.toFixed(3);
        phaseHero.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
        phaseHero.style.filter = `blur(${blur.toFixed(1)}px)`;
        phaseHero.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
      } else {
        phaseHero.style.opacity = '0';
        phaseHero.style.pointerEvents = 'none';
      }
    }

    // Phase 2: Center Impact Statement (Hidden 0.00 -> 0.42, crossfades in 0.42 -> 0.72, fully settled 0.72 -> 1.00)
    if (phaseImpact) {
      if (progress <= 0.42) {
        phaseImpact.style.opacity = '0';
        phaseImpact.style.pointerEvents = 'none';
      } else if (progress > 0.42 && progress < 0.72) {
        const factor = (progress - 0.42) / 0.30;
        const opacity = clamp(factor, 0, 1);
        const translateY = 40 * (1 - factor);
        const scale = 0.92 + 0.08 * factor;
        const blur = (1 - factor) * 12;

        phaseImpact.style.opacity = opacity.toFixed(3);
        phaseImpact.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
        phaseImpact.style.filter = `blur(${blur.toFixed(1)}px)`;
        phaseImpact.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else {
        phaseImpact.style.opacity = '1';
        phaseImpact.style.transform = 'translate(-50%, -50%) scale(1) translateY(0px)';
        phaseImpact.style.filter = 'blur(0px)';
        phaseImpact.style.pointerEvents = 'auto';
      }
    }
  }

  // Main RAF Loop
  function animationLoop() {
    currentProgress = lerp(currentProgress, targetProgress, 0.12);

    syncVideoWithScroll(currentProgress);

    const nextFrameIndex = clamp(
      Math.floor(currentProgress * (TOTAL_FRAMES - 1)),
      0,
      TOTAL_FRAMES - 1
    );

    if (nextFrameIndex !== activeFrameIndex) {
      activeFrameIndex = nextFrameIndex;
      drawFrame(activeFrameIndex);
    }

    updateOverlays(currentProgress);

    if (Math.abs(targetProgress - currentProgress) > 0.0005) {
      requestAnimationFrame(animationLoop);
    } else {
      isLoopActive = false;
    }
  }

  function onScroll() {
    targetProgress = calculateTargetProgress();
    if (!isLoopActive) {
      isLoopActive = true;
      requestAnimationFrame(animationLoop);
    }
  }

  /* =========================================================================
     STARTUP & EVENT LISTENERS
     ========================================================================= */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    onScroll();
  }, { passive: true });

  resizeCanvas();
  initSequenceLoader();
  onScroll();

})();


/* =========================================================================
   MODULE 2: PINNED HORIZONTAL SCROLL WITH LETTER REVEAL
   ========================================================================= */
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


/* =========================================================================
   MODULE 3: CURVED ROTARY DIAL FEATURE CAROUSEL
   ========================================================================= */
/**
 * Curved Rotary Dial Carousel Engine - OneReach Labs Section Design
 * Stack: Vanilla ES6+, High-precision trigonometric transforms,
 * dynamic SVG radial gauge ticks, scroll-driven number parallax, tactile drag, and accessibility.
 */

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const CONFIG = {
    totalCards: 4,
    // Angular step between cards in degrees
    angleStepDesktop: 25,
    angleStepTablet: 29,
    angleStepMobile: 34,
    // Radii of curvature for responsive viewports
    radiusDesktop: 1500,
    radiusTablet: 1150,
    radiusMobile: 780,
    // Ticket height per breakpoint (px)
    ticketHeightDesktop: 250,
    ticketHeightTablet: 220,
    ticketHeightMobile: 190,
    // Apex vertical offset ratio inside viewport
    apexYRatio: 0.11,
    // Physics lerp factor (smoothness)
    lerpFactor: 0.11,
    // Drag sensitivity
    dragSensitivity: 0.08,
    // Parallax translation factor for numbers inside ticket (px per degree)
    numberParallaxFactor: 1.85,
  };

  // --- DOM References ---
  const dialSection = document.querySelector('.dial-section');
  const dialStage = document.getElementById('dial-stage');
  const dialViewport = document.getElementById('dial-viewport');
  const dialTrackSvg = document.getElementById('dial-track-svg');
  const cards = Array.from(document.querySelectorAll('.dial-card-node'));
  const phaseTabs = Array.from(document.querySelectorAll('.phase-tab-btn'));
  const phaseNumberDisplay = document.getElementById('phase-number');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const themeToggle = document.getElementById('theme-toggle');

  // --- State Variables ---
  let viewportWidth = 0;
  let viewportHeight = 0;
  let currentRadius = CONFIG.radiusDesktop;
  let currentAngleStep = CONFIG.angleStepDesktop;
  let currentTicketHeight = CONFIG.ticketHeightDesktop;
  let centerX = 0;
  let centerY = 0;
  let apexY = 0;

  let targetRotation = 0; // Target wheel rotation angle (degrees)
  let currentRotation = 0; // Current smoothed wheel rotation angle (degrees)
  let activeIndex = 0;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartRotation = 0;
  let lastDragX = 0;
  let dragVelocity = 0;
  let isUserInteracting = false;
  let rafId = null;

  // --- Theme Initializer ---
  function initTheme() {
    const savedTheme = localStorage.getItem('orl_dial_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('orl_dial_theme', nextTheme);
        renderSvgTrack();
      });
    }
  }

  // --- Geometry & Responsive Dimensions ---
  function updateDimensions() {
    if (!dialViewport) return;

    const rect = dialViewport.getBoundingClientRect();
    viewportWidth = rect.width;
    viewportHeight = rect.height;

    // Responsive breakpoints
    if (window.innerWidth < 768) {
      currentRadius = CONFIG.radiusMobile;
      currentAngleStep = CONFIG.angleStepMobile;
      currentTicketHeight = CONFIG.ticketHeightMobile;
    } else if (window.innerWidth < 1024) {
      currentRadius = CONFIG.radiusTablet;
      currentAngleStep = CONFIG.angleStepTablet;
      currentTicketHeight = CONFIG.ticketHeightTablet;
    } else {
      currentRadius = CONFIG.radiusDesktop;
      currentAngleStep = CONFIG.angleStepDesktop;
      currentTicketHeight = CONFIG.ticketHeightDesktop;
    }

    centerX = viewportWidth / 2;
    apexY = viewportHeight * CONFIG.apexYRatio;
    // Center of circle: placed so that the apex intersects exactly at the bottom of the card ticket
    centerY = apexY + currentTicketHeight + currentRadius;

    renderSvgTrack();
    updateCardPositions(true);
  }

  // --- Precision SVG Rotary Gauge & Radial Ticks ---
  function renderSvgTrack() {
    if (!dialTrackSvg || viewportWidth === 0) return;

    dialTrackSvg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
    dialTrackSvg.innerHTML = '';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Sector Colors matching the card themes from video
    const sectorColors = [
      isDark ? '#8fa6ff' : '#222733', // Card 1 (Slate / OneReach Blue)
      '#f8c868',                      // Card 2 (Gold)
      '#b9ddb4',                      // Card 3 (Sage)
      '#f78c6b',                      // Card 4 (Coral)
    ];

    // Angular range across the entire carousel span
    const minAngle = -50;
    const maxAngle = 50 + (CONFIG.totalCards - 1) * currentAngleStep;
    const tickInterval = 0.7; // Degree step between ticks

    const gTicks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gTicks.setAttribute('id', 'dial-ticks-group');

    // Continuous baseline circle arc
    const pathArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const radStart = (minAngle * Math.PI) / 180;
    const radEnd = (maxAngle * Math.PI) / 180;

    const pStartX = centerX + currentRadius * Math.sin(radStart);
    const pStartY = centerY - currentRadius * Math.cos(radStart);
    const pEndX = centerX + currentRadius * Math.sin(radEnd);
    const pEndY = centerY - currentRadius * Math.cos(radEnd);

    pathArc.setAttribute(
      'd',
      `M ${pStartX.toFixed(1)} ${pStartY.toFixed(1)} A ${currentRadius} ${currentRadius} 0 0 1 ${pEndX.toFixed(1)} ${pEndY.toFixed(1)}`
    );
    pathArc.setAttribute('fill', 'none');
    pathArc.setAttribute('stroke', isDark ? 'rgba(143, 166, 255, 0.16)' : 'rgba(25, 28, 36, 0.08)');
    pathArc.setAttribute('stroke-width', '1.5');
    gTicks.appendChild(pathArc);

    // Generate individual radial ticks radiating outward from the arc
    for (let deg = minAngle; deg <= maxAngle; deg += tickInterval) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = Math.abs(deg % (tickInterval * 5)) < 0.01;
      
      const tickLength = isMajor ? 22 : 12;
      const rInner = currentRadius - 2;
      const rOuter = currentRadius + tickLength;

      const x1 = centerX + rInner * Math.sin(rad);
      const y1 = centerY - rInner * Math.cos(rad);
      const x2 = centerX + rOuter * Math.sin(rad);
      const y2 = centerY - rOuter * Math.cos(rad);

      const phaseIndex = Math.max(
        0,
        Math.min(CONFIG.totalCards - 1, Math.round(deg / currentAngleStep))
      );
      const tickColor = sectorColors[phaseIndex] || sectorColors[0];

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('stroke', tickColor);
      line.setAttribute('stroke-width', isMajor ? '2' : '1.2');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', isMajor ? '0.85' : '0.42');

      gTicks.appendChild(line);
    }

    dialTrackSvg.appendChild(gTicks);
  }

  // --- Update Card & Dial Positions ---
  function updateCardPositions(immediate = false) {
    if (cards.length === 0 || viewportWidth === 0) return;

    // Rotate SVG ticks group synchronously with the wheel
    const ticksGroup = document.getElementById('dial-ticks-group');
    if (ticksGroup) {
      ticksGroup.setAttribute(
        'transform',
        `rotate(${currentRotation.toFixed(2)}, ${centerX}, ${centerY})`
      );
    }

    let closestIndex = 0;
    let minAbsDiff = Infinity;

    cards.forEach((card, index) => {
      // Angular position of this card along the circular arc
      const baseAngle = index * currentAngleStep;
      const cardAngle = baseAngle + currentRotation;
      const rad = (cardAngle * Math.PI) / 180;

      // Point on circular arc
      const circX = centerX + currentRadius * Math.sin(rad);
      const circY = centerY - currentRadius * Math.cos(rad);

      // Card anchor: bottom center of the colored ticket (50% currentTicketHeight)
      const cardWidth = card.offsetWidth || 440;
      const posX = circX - cardWidth / 2;
      const posY = circY - currentTicketHeight;

      // Apply transform-origin dynamically matching the breakpoint ticket height
      card.style.transformOrigin = `50% ${currentTicketHeight}px`;

      // Hardware-accelerated GPU 3D transform + tangential rotation
      card.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${cardAngle.toFixed(2)}deg)`;

      // Dynamic scroll-driven parallax movement of numbers inside ticket
      const artwork = card.querySelector('.ticket-artwork');
      if (artwork) {
        const numShiftX = cardAngle * CONFIG.numberParallaxFactor;
        artwork.style.transform = `translate3d(${numShiftX.toFixed(1)}px, 0, 0)`;
      }

      const absAngle = Math.abs(cardAngle);
      if (absAngle < minAbsDiff) {
        minAbsDiff = absAngle;
        closestIndex = index;
      }

      // Smooth opacity falloff as card moves out of view
      const opacity = Math.max(0.15, 1 - Math.pow(absAngle / 65, 1.5));
      card.style.opacity = Math.min(1, opacity).toFixed(2);

      // Active state when centered at apex
      if (absAngle < currentAngleStep * 0.45) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
      updateIndicators(activeIndex);
    }
  }

  // --- Update UI Pagination Indicators ---
  function updateIndicators(index) {
    if (phaseNumberDisplay) {
      phaseNumberDisplay.textContent = `Phase 0${index + 1}`;
    }

    phaseTabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (btnPrev) btnPrev.disabled = index <= 0;
    if (btnNext) btnNext.disabled = index >= CONFIG.totalCards - 1;
  }

  // --- Scroll Scrubbing Handler ---
  function onScroll() {
    if (isUserInteracting || !dialSection) return;

    const rect = dialSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const scrollableDistance = rect.height - window.innerHeight;

    if (scrollableDistance <= 0) return;

    // Progress normalized 0 to 1
    const progress = Math.max(0, Math.min(1, -sectionTop / scrollableDistance));
    
    // Total angular rotation range
    const maxRotation = (CONFIG.totalCards - 1) * currentAngleStep;
    targetRotation = -progress * maxRotation;
  }

  // --- Navigation Controls (Tabs & Buttons) ---
  function rotateToIndex(index, syncScroll = true) {
    index = Math.max(0, Math.min(CONFIG.totalCards - 1, index));
    targetRotation = -index * currentAngleStep;

    if (syncScroll && dialSection) {
      const rect = dialSection.getBoundingClientRect();
      const scrollableDistance = dialSection.offsetHeight - window.innerHeight;
      const scrollTarget =
        window.pageYOffset +
        rect.top +
        (index / (CONFIG.totalCards - 1)) * scrollableDistance;

      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });
    }
  }

  // --- Tactile Drag / Touch Controls ---
  function onPointerDown(e) {
    if (e.target.closest('.card-body a') || e.target.closest('button')) return;

    isDragging = true;
    isUserInteracting = true;
    dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartRotation = currentRotation;
    lastDragX = dragStartX;
    dragVelocity = 0;

    dialViewport.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;
    dragVelocity = clientX - lastDragX;
    lastDragX = clientX;

    const minRot = -(CONFIG.totalCards - 1) * currentAngleStep - 8;
    const maxRot = 8;
    const tentativeRot = dragStartRotation + deltaX * CONFIG.dragSensitivity;

    targetRotation = Math.max(minRot, Math.min(maxRot, tentativeRot));
  }

  function onPointerUp(e) {
    if (!isDragging) return;

    isDragging = false;
    dialViewport.releasePointerCapture?.(e.pointerId);

    // Inertia & snap to nearest card
    const projectedRotation = targetRotation + dragVelocity * 0.25;
    const targetIndex = Math.round(-projectedRotation / currentAngleStep);
    
    rotateToIndex(targetIndex, true);

    setTimeout(() => {
      isUserInteracting = false;
    }, 500);
  }

  // --- Keyboard Accessibility ---
  function onKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      rotateToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      rotateToIndex(activeIndex - 1);
    }
  }

  // --- Physics Lerp Loop ---
  function tick() {
    const diff = targetRotation - currentRotation;
    if (Math.abs(diff) > 0.001) {
      currentRotation += diff * CONFIG.lerpFactor;
      updateCardPositions();
    }

    rafId = requestAnimationFrame(tick);
  }

  // --- Initializer ---
  function init() {
    initTheme();
    updateDimensions();

    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    if (dialViewport) {
      dialViewport.addEventListener('pointerdown', onPointerDown);
      dialViewport.addEventListener('pointermove', onPointerMove);
      dialViewport.addEventListener('pointerup', onPointerUp);
      dialViewport.addEventListener('pointercancel', onPointerUp);
      dialViewport.addEventListener('keydown', onKeyDown);
    }

    phaseTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetIdx = parseInt(tab.getAttribute('data-target'), 10);
        if (!isNaN(targetIdx)) {
          rotateToIndex(targetIdx);
        }
      });
    });

    if (btnPrev) {
      btnPrev.addEventListener('click', () => rotateToIndex(activeIndex - 1));
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => rotateToIndex(activeIndex + 1));
    }

    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (!isDragging) {
          rotateToIndex(index);
        }
      });
    });

    onScroll();
    currentRotation = targetRotation;
    updateCardPositions(true);
    updateIndicators(0);
    rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

