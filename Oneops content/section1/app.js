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
