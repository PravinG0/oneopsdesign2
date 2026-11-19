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
