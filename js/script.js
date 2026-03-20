/* ============================================
   ÁLBUM INTERACTIVO - SCRIPT PRINCIPAL
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initCoverAnimation();
    initQuestionAnimation();
    initNoButton();
    initYesButton();
    initScrollIndicator();
    initMusicToggle();
    initGallery();
    initLightbox();
    initStickers();
});

/* ---- AOS Initialization ---- */
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

/* ---- Cover Animation with GSAP ---- */
function initCoverAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#cover-title', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.5
    })
    .to('#cover-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1
    }, '-=0.6')
    .to('.cover-divider', {
        opacity: 1,
        duration: 0.8
    }, '-=0.4');
}

/* ---- Question Section Animation ---- */
function initQuestionAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    // Animate question title
    ScrollTrigger.create({
        trigger: '#question',
        start: 'top 60%',
        onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            
            tl.to('.question-title', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.3
            })
            .to('.question-subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, '-=0.4')
            .to('.question-buttons', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, '-=0.3');
        },
        once: true
    });
}

/* ---- "No" Button - Escapes from cursor ---- */
function initNoButton() {
    const btnNo = document.getElementById('btn-no');
    let escapeCount = 0;
    const funnyTexts = [
        'No 😢',
        '¿Segura? 🥺',
        'Piénsalo... 💭',
        '¿De verdad? 😿',
        'Reconsidéralo 🥹',
        'Dale que sí 💖',
        '¡Por favor! 🙏',
        '¿Ni tantito? 😭',
        'Ándale... 💕'
    ];

    function moveButton() {
        escapeCount++;
        
        // Update button text
        if (escapeCount < funnyTexts.length) {
            btnNo.querySelector('span').textContent = funnyTexts[escapeCount];
        }

        // Add escaping class on first escape
        if (escapeCount === 1) {
            btnNo.classList.add('escaping');
        }

        // Calculate random position within viewport
        const padding = 20;
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;
        
        const randomX = Math.max(padding, Math.random() * maxX);
        const randomY = Math.max(padding, Math.random() * maxY);

        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';

        // Make button smaller over time
        const scale = Math.max(0.6, 1 - (escapeCount * 0.05));
        btnNo.style.transform = `scale(${scale})`;
    }

    // Desktop: hover
    btnNo.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        moveButton();
    });

    // Mobile: touch
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    // Extra: click (fallback)
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });
}

/* ---- "Yes" Button - Confetti! ---- */
function initYesButton() {
    const btnYes = document.getElementById('btn-yes');
    const celebration = document.getElementById('celebration');

    btnYes.addEventListener('click', () => {
        // Show celebration overlay
        celebration.classList.add('active');

        // Fire confetti bursts!
        fireConfetti();

        // Continue confetti for a few seconds
        const interval = setInterval(() => {
            fireConfetti();
        }, 800);

        setTimeout(() => {
            clearInterval(interval);
        }, 5000);
    });
}

function fireConfetti() {
    // Center burst
    confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#F8C8DC', '#E8A0BF', '#D4789C', '#FDDDE6', '#D4A574', '#FF69B4', '#FFB6C1'],
        shapes: ['circle', 'square'],
        gravity: 0.8,
        scalar: 1.2
    });

    // Left burst
    confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#F8C8DC', '#E8A0BF', '#FFB6C1', '#FF69B4'],
        gravity: 0.8
    });

    // Right burst
    confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#F8C8DC', '#E8A0BF', '#FFB6C1', '#FF69B4'],
        gravity: 0.8
    });
}

/* ---- Scroll Indicator ---- */
function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            indicator.classList.add('hidden');
        } else {
            indicator.classList.remove('hidden');
        }
    });
}

/* ---- Music Toggle ---- */
function initMusicToggle() {
    const btn = document.getElementById('music-toggle');
    let audio = null;
    let isPlaying = false;

    // Create a subtle background audio element
    // The user can replace this URL with their own song
    audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    // Placeholder: user can set their own music URL
    // audio.src = 'path/to/your/song.mp3';

    btn.addEventListener('click', () => {
        if (!audio.src || audio.src === window.location.href) {
            // No audio source set - show a subtle message
            btn.title = 'Agrega tu canción: coloca un archivo .mp3 en la carpeta del proyecto y actualiza el src en script.js';
            btn.classList.toggle('playing');
            return;
        }

        if (isPlaying) {
            audio.pause();
            btn.classList.remove('playing');
        } else {
            audio.play().catch(() => {
                // Autoplay blocked - user needs to interact first
                console.log('Click again to play music');
            });
            btn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

/* ============================================
   GALLERY - Infinite Loop
   ============================================ */
function initGallery() {
    const track = document.getElementById('gallery-track');
    if (!track) return;

    // Wait a bit for images to load/error, then duplicate visible items for infinite loop
    setTimeout(() => {
        const items = track.querySelectorAll('.gallery-item');
        const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');

        if (visibleItems.length === 0) return;

        // Duplicate items for seamless infinite scroll
        visibleItems.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // Adjust animation duration based on number of items
        const totalWidth = visibleItems.length * (200 + 24); // width + gap
        const duration = Math.max(20, visibleItems.length * 4);
        track.style.animationDuration = duration + 's';
    }, 500);
}

/* ============================================
   LIGHTBOX
   ============================================ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lightbox) return;

    let currentImages = [];
    let currentIndex = 0;

    // Collect gallery images that loaded successfully
    function getGalleryImages() {
        const items = document.querySelectorAll('.gallery-item');
        const srcs = [];
        items.forEach(item => {
            if (item.style.display !== 'none') {
                const src = item.getAttribute('data-src');
                if (src && !srcs.includes(src)) {
                    srcs.push(src);
                }
            }
        });
        return srcs;
    }

    // Open lightbox
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (!galleryItem) return;

        currentImages = getGalleryImages();
        const src = galleryItem.getAttribute('data-src');
        currentIndex = currentImages.indexOf(src);
        if (currentIndex === -1) currentIndex = 0;

        showImage(currentIndex);
        lightbox.classList.add('active');
    });

    // Close
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Navigation
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            showImage(currentIndex);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % currentImages.length;
            showImage(currentIndex);
        }
    });

    // Swipe support for mobile
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left → next
                currentIndex = (currentIndex + 1) % currentImages.length;
            } else {
                // Swipe right → prev
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            }
            showImage(currentIndex);
        }
    });

    function showImage(index) {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = currentImages[index];
            lightboxImg.style.opacity = '1';
        }, 150);
        lightboxImg.style.transition = 'opacity 0.3s ease';
    }
}

/* ============================================
   STICKERS - Randomize positions slightly
   ============================================ */
function initStickers() {
    const stickers = document.querySelectorAll('.sticker');

    stickers.forEach(sticker => {
        // Add slight random variation to rotation
        const baseRotation = parseInt(getComputedStyle(sticker).transform) || 0;
        const randomRotation = (Math.random() - 0.5) * 10; // ±5deg extra variation
        const randomDelay = Math.random() * -6; // random animation offset

        sticker.style.animationDelay = randomDelay + 's';

        // Subtle random scale variation
        const scale = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
        sticker.style.setProperty('--sticker-scale', scale);
    });
}

