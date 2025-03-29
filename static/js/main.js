// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    
    localStorage.setItem('theme', newTheme);
    
    // Add rotation animation
    themeIcon.style.animation = 'rotate360 0.5s ease';
    setTimeout(() => {
        themeIcon.style.animation = '';
    }, 500);
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

// Music Player Controls
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

// Set initial volume
music.volume = 0.5;

// Function to play music
function playMusic() {
    music.play().then(() => {
        isMusicPlaying = true;
        musicToggle.querySelector('i').classList.remove('fa-music');
        musicToggle.querySelector('i').classList.add('fa-volume-high');
        musicToggle.classList.add('playing');
        localStorage.setItem('musicPlaying', 'true');
    }).catch(error => {
        console.log('Autoplay prevented:', error);
    });
}

// Function to pause music
function pauseMusic() {
    music.pause();
    isMusicPlaying = false;
    musicToggle.querySelector('i').classList.remove('fa-volume-high');
    musicToggle.querySelector('i').classList.add('fa-music');
    musicToggle.classList.remove('playing');
    localStorage.setItem('musicPlaying', 'false');
}

// Add click event listener to music toggle button
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// Check if music was playing before
if (localStorage.getItem('musicPlaying') === 'true') {
    playMusic();
}

// Add click event listener to document to start music on first interaction
document.addEventListener('click', function startMusic() {
    if (!isMusicPlaying) {
        playMusic();
        document.removeEventListener('click', startMusic);
    }
}, { once: true });

// Enhanced Contact Form
const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');

// Add floating label effect
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');
    
    input.addEventListener('focus', () => {
        label.classList.add('active');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            label.classList.remove('active');
        }
    });
    
    // Check if input has value on page load
    if (input.value) {
        label.classList.add('active');
    }
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    try {
        const formData = new FormData(contactForm);
        const response = await fetch('/contact', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            contactForm.reset();
            
            // Reset all labels
            formGroups.forEach(group => {
                const label = group.querySelector('label');
                label.classList.remove('active');
            });
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.innerHTML = '<i class="fa-solid fa-exclamation"></i>';
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
        }, 2000);
    }
});

// Enhanced Particle Animation
const particles = document.querySelectorAll('.particle');
particles.forEach(particle => {
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
}); 