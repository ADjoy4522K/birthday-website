/* ==================== CONFIGURATION LOADER ==================== */
// Load content from the HTML config section
const configDiv = document.getElementById('config');
const getName = () => configDiv.querySelector('[data-name]').textContent.trim();
const getBirthday = () => configDiv.querySelector('[data-birthday]').textContent.trim();
const getSpecialMessage = () => configDiv.querySelector('[data-special-message]').textContent.trim();
const getPhotos = () => {
    const photosText = configDiv.querySelector('[data-photos]').textContent.trim();
    return photosText.split('\n').map(url => url.trim()).filter(url => url);
};
const getMusicUrl = () => configDiv.querySelector('[data-music-url]').textContent.trim();

/* ==================== ANIMATED HEARTS BACKGROUND ==================== */
function createAnimatedHearts() {
    const container = document.querySelector('.hearts-container');
    const heartCount = 50;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'animated-heart';
        heart.textContent = '❤️';
        
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDuration = Math.random() * 8 + 6;
        const randomDelay = Math.random() * 5;
        
        heart.style.left = randomX + '%';
        heart.style.top = randomY + '%';
        heart.style.setProperty('--duration', randomDuration + 's');
        heart.style.setProperty('--delay', randomDelay + 's');
        
        container.appendChild(heart);
    }
}

/* ==================== INITIALIZE PAGE ==================== */
document.addEventListener('DOMContentLoaded', function() {
    // Create animated hearts background
    createAnimatedHearts();
    
    // Set personal content
    document.getElementById('greeting-title').textContent = `Happy Birthday, ${getName()}!`;
    document.getElementById('special-message').textContent = getSpecialMessage();
    document.getElementById('footer-date').textContent = `Today: ${getBirthday()}`;
    
    // Play background music on user interaction
    const audio = document.getElementById('background-music');
    let played = false;
    const playMusic = () => {
        if (!played) {
            audio.play().catch(e => console.log('Playback failed:', e));
            played = true;
            document.removeEventListener('click', playMusic);
        }
    };
    document.addEventListener('click', playMusic);
    
    // Initialize photo gallery
    initializeGallery();
    
    // Setup other interactive elements
    setupInteractivity();
});

/* ==================== PHOTO GALLERY ==================== */
let currentPhotoIndex = 0;
const photos = getPhotos();

function initializeGallery() {
    if (photos.length === 0) {
        console.warn('No photos added yet. Edit the data-photos section in index.html to add photo URLs.');
        return;
    }
    
    // Set first image
    showSlide(0);
    
    // Create dots
    const dotsContainer = document.getElementById('gallery-dots');
    dotsContainer.innerHTML = '';
    photos.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => showSlide(index);
        dotsContainer.appendChild(dot);
    });
}

function showSlide(n) {
    const image = document.getElementById('slideshow-image');
    
    if (n >= photos.length) {
        currentPhotoIndex = 0;
    } else if (n < 0) {
        currentPhotoIndex = photos.length - 1;
    } else {
        currentPhotoIndex = n;
    }
    
    image.src = photos[currentPhotoIndex];
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentPhotoIndex]) {
        dots[currentPhotoIndex].classList.add('active');
    }
}

function changeSlide(n) {
    showSlide(currentPhotoIndex + n);
}

// Auto-advance gallery every 3 seconds
setInterval(() => {
    if (photos.length > 0) {
        changeSlide(1);
    }
}, 3000);

/* ==================== INTERACTIVE EFFECTS ==================== */
function triggerEffect(type) {
    switch(type) {
        case 'hearts':
            createHeartRain();
            break;
        case 'fireworks':
            createFireworks();
            break;
        case 'confetti':
            createConfetti();
            break;
        case 'rainbow':
            createRainbowEffect();
            break;
    }
}

// Heart Rain Effect
function createHeartRain() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-30px';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.zIndex = '1000';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'heartFall ' + (Math.random() * 2 + 2) + 's linear forwards';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 30);
    }
}

// Confetti Effect
function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 5 + 5,
            color: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff6ec7'][Math.floor(Math.random() * 5)],
            rotation: Math.random() * 360
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeParticles = false;
        
        particles.forEach(p => {
            if (p.y < canvas.height) {
                activeParticles = true;
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += 0.1; // gravity
                p.rotation += 5;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });
        
        if (activeParticles) {
            requestAnimationFrame(animateConfetti);
        }
    }
    
    animateConfetti();
}

// Fireworks Effect
function createFireworks() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fireworks = [];
    
    function createExplosion(x, y) {
        const particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: x,
                y: y,
                vx: Math.cos((i / 80) * Math.PI * 2) * 8,
                vy: Math.sin((i / 80) * Math.PI * 2) * 8,
                life: 1,
                color: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ffd700'][Math.floor(Math.random() * 5)]
            });
        }
        return particles;
    }
    
    // Create multiple explosions
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.5;
            fireworks.push(createExplosion(x, y));
        }, i * 200);
    }
    
    function animateFireworks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let hasActive = false;
        
        fireworks.forEach(explosion => {
            explosion.forEach(p => {
                if (p.life > 0) {
                    hasActive = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.2;
                    p.life -= 0.01;
                    
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fillRect(p.x, p.y, 3, 3);
                    ctx.globalAlpha = 1;
                }
            });
        });
        
        if (hasActive) {
            requestAnimationFrame(animateFireworks);
        }
    }
    
    animateFireworks();
}

// Rainbow Effect
function createRainbowEffect() {
    const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff6ec7', '#ff69b4'];
    let colorIndex = 0;
    
    const header = document.querySelector('.header');
    const originalBackground = header.style.background;
    
    const rainbow = setInterval(() => {
        header.style.background = colors[colorIndex];
        header.style.transition = 'background 0.5s ease';
        colorIndex = (colorIndex + 1) % colors.length;
    }, 300);
    
    setTimeout(() => {
        clearInterval(rainbow);
        header.style.background = originalBackground;
    }, 3000);
    
    // Also add floating rainbow hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '🌈';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-30px';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.zIndex = '1000';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'heartFall ' + (Math.random() * 2 + 2) + 's linear forwards';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 50);
    }
}

/* ==================== GENERAL INTERACTIVITY ==================== */
function setupInteractivity() {
    // Add hover effects to message cards
    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 1s ease-in-out';
            }, 10);
        });
    });
    
    // Add click sound effect (optional) to buttons
    const funButtons = document.querySelectorAll('.fun-button');
    funButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle scale animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'buttonPulse 0.6s ease-out';
            }, 10);
        });
    });
}

/* ==================== CUSTOM ANIMATIONS ==================== */
// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFall {
        to {
            opacity: 0;
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    @keyframes buttonPulse {
        0% {
            transform: scale(0.95);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

/* ==================== RESPONSIVE HANDLING ==================== */
window.addEventListener('resize', function() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ==================== CONSOLE HINTS ==================== */
console.log('%c🎉 Happy Birthday Website Loaded! 🎉', 'font-size: 20px; color: #ff69b4; font-weight: bold;');
console.log('%cTo customize this website:', 'font-size: 14px; font-weight: bold;');
console.log('1. Edit index.html - Change the config section at the top');
console.log('2. Add photo URLs in the data-photos section');
console.log('3. Change music URL in data-music-url');
console.log('4. Edit love messages in the HTML');
console.log('5. Customize timeline events');
