AOS.init({
    duration: 800,
    once: true,
    offset: 100
});


const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    
    localStorage.setItem('theme', newTheme);
    
    
    themeIcon.style.animation = 'rotate360 0.5s ease';
    setTimeout(() => {
        themeIcon.style.animation = '';
    }, 500);
});


const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';


const musicPlayer = document.getElementById('musicPlayer');
const musicToggle = document.getElementById('musicToggle');
const musicProgress = document.getElementById('musicProgress');
const volumeIcon = document.getElementById('volumeIcon');
const volumeProgress = document.getElementById('volumeProgress');
const volumeSlider = document.querySelector('.volume-slider');
let isMusicPlaying = false;
let currentVolume = 1;
let isMuted = false;
let wasPlayingBeforeMute = false;
let isDragging = false;
let lastVolume = 1;
let isShuffled = false;
let repeatMode = 'none'; 
let currentTime = 0;
let duration = 0;


const wasMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
if (wasMusicPlaying) {
    isMusicPlaying = true;
    musicPlayer.play();
    musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
    musicToggle.classList.add('playing');
}

function initMusicPlayer() {
    currentVolume = parseFloat(localStorage.getItem('musicVolume')) || 1;
    musicPlayer.volume = currentVolume;
    updateVolumeIcon();
    updateVolumeProgress();
    
    isMuted = localStorage.getItem('musicMuted') === 'true';
    musicPlayer.muted = isMuted;
    updateVolumeIcon();

    isShuffled = localStorage.getItem('musicShuffled') === 'true';
    repeatMode = localStorage.getItem('repeatMode') || 'none';

    document.addEventListener('keydown', handleKeyboardShortcuts);

    musicPlayer.addEventListener('timeupdate', updateTime);
    musicPlayer.addEventListener('loadedmetadata', () => {
        duration = musicPlayer.duration;
        updateTime();
    });

    try {
        musicPlayer.play().then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
            musicToggle.classList.add('playing');
            localStorage.setItem('isMusicPlaying', true);
        }).catch(error => {
            console.log('Auto-play prevented:', error);
        });
    } catch (error) {
        console.log('Play error:', error);
    }
}

function handleKeyboardShortcuts(e) {
    // Check if the event target is an input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return; // Don't handle keyboard shortcuts for form inputs
    }

    if (e.code === 'Space') {
        e.preventDefault();
        toggleMusic();
    } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        changeVolume(0.1);
    } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        changeVolume(-0.1);
    } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
    } else if (e.code === 'KeyS') {
        e.preventDefault();
        toggleShuffle();
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        toggleRepeat();
    }
}

function updateTime() {
    currentTime = musicPlayer.currentTime;
    duration = musicPlayer.duration;
    updateProgress();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    localStorage.setItem('musicShuffled', isShuffled);
    updateShuffleIcon();
}

function updateShuffleIcon() {
    const shuffleIcon = document.querySelector('.shuffle-icon');
    if (shuffleIcon) {
        shuffleIcon.style.color = isShuffled ? 'var(--accent-color)' : 'var(--text-secondary)';
    }
}

function toggleRepeat() {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    localStorage.setItem('repeatMode', repeatMode);
    updateRepeatIcon();
}

function updateRepeatIcon() {
    const repeatIcon = document.querySelector('.repeat-icon');
    if (repeatIcon) {
        switch (repeatMode) {
            case 'none':
                repeatIcon.className = 'fa-solid fa-repeat repeat-icon';
                repeatIcon.style.color = 'var(--text-secondary)';
                break;
            case 'one':
                repeatIcon.className = 'fa-solid fa-repeat-1 repeat-icon';
                repeatIcon.style.color = 'var(--accent-color)';
                break;
            case 'all':
                repeatIcon.className = 'fa-solid fa-repeat repeat-icon';
                repeatIcon.style.color = 'var(--accent-color)';
                break;
        }
    }
}

musicPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        musicPlayer.currentTime = 0;
        musicPlayer.play();
    } else if (repeatMode === 'all') {
        musicPlayer.currentTime = 0;
        musicPlayer.play();
    } else {
        toggleMusic();
    }
});

function changeVolume(delta) {
    currentVolume = Math.max(0, Math.min(1, currentVolume + delta));
    musicPlayer.volume = currentVolume;
    updateVolumeProgress();
    updateVolumeIcon();
    localStorage.setItem('musicVolume', currentVolume);
}

function toggleMusic() {
    if (isMusicPlaying) {
        musicPlayer.pause();
        musicToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
        musicToggle.classList.remove('playing');
    } else {
        musicPlayer.play();
        musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
        musicToggle.classList.add('playing');
    }
    isMusicPlaying = !isMusicPlaying;
    localStorage.setItem('isMusicPlaying', isMusicPlaying);
}

function updateProgress() {
    const progress = (currentTime / duration) * 100;
    musicProgress.style.width = `${progress}%`;
}

function handleProgressClick(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    musicPlayer.currentTime = newTime;
}

function toggleMute() {
    isMuted = !isMuted;
    musicPlayer.muted = isMuted;
    
    if (isMuted) {
        lastVolume = currentVolume;
        currentVolume = 0;
        musicPlayer.volume = 0;
        wasPlayingBeforeMute = isMusicPlaying;
        if (isMusicPlaying) {
            musicPlayer.pause();
            musicToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
            musicToggle.classList.remove('playing');
            isMusicPlaying = false;
        }
    } else {
        currentVolume = lastVolume;
        musicPlayer.volume = currentVolume;
        if (wasPlayingBeforeMute) {
            musicPlayer.play();
            musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
            musicToggle.classList.add('playing');
            isMusicPlaying = true;
        }
    }
    
    updateVolumeIcon();
    updateVolumeProgress();
    localStorage.setItem('musicMuted', isMuted);
}

function updateVolume(e) {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const volumeBarWidth = rect.width;
    currentVolume = Math.max(0, Math.min(1, clickPosition / volumeBarWidth));
    
    if (currentVolume === 0) {
        isMuted = true;
        musicPlayer.muted = true;
    } else {
        isMuted = false;
        musicPlayer.muted = false;
    }
    
    musicPlayer.volume = currentVolume;
    updateVolumeProgress();
    updateVolumeIcon();
    localStorage.setItem('musicVolume', currentVolume);
}

function updateVolumeIcon() {
    if (isMuted || currentVolume === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark volume-icon';
    } else if (currentVolume < 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-low volume-icon';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high volume-icon';
    }
}

function updateVolumeProgress() {
    volumeProgress.style.width = `${currentVolume * 100}%`;
}

musicToggle.addEventListener('click', toggleMusic);
musicPlayer.addEventListener('timeupdate', updateProgress);
document.querySelector('.music-progress').addEventListener('click', handleProgressClick);
volumeIcon.addEventListener('click', toggleMute);

volumeSlider.addEventListener('click', updateVolume);

volumeSlider.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateVolume(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('DOMContentLoaded', initMusicPlayer);

document.addEventListener('click', function initMusic() {
    if (!isMusicPlaying) {
        try {
            musicPlayer.play().then(() => {
                isMusicPlaying = true;
                musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
                musicToggle.classList.add('playing');
                localStorage.setItem('isMusicPlaying', true);
            }).catch(error => {
                console.log('Play error:', error);
            });
        } catch (error) {
            console.log('Play error:', error);
        }
    }
}, { once: true });


document.addEventListener('touchstart', function() {
    if (!isMusicPlaying) {
        toggleMusic();
    }
}, { once: true });


document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (isMusicPlaying) {
            musicPlayer.pause();
            musicToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
            musicToggle.classList.remove('playing');
            isMusicPlaying = false;
        }
    } else {
        if (localStorage.getItem('isMusicPlaying') === 'true' && !isMuted) {
            musicPlayer.play();
            musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
            musicToggle.classList.add('playing');
            isMusicPlaying = true;
        }
    }
});


const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');


formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');
    
    input.addEventListener('focus', () => {
        label.classList.add('active');
        group.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            label.classList.remove('active');
            group.classList.remove('focused');
        }
    });
    
    
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
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            contactForm.reset();
            
            formGroups.forEach(group => {
                const label = group.querySelector('label');
                label.classList.remove('active');
                group.classList.remove('focused');
            });
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
            }, 2000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.innerHTML = '<i class="fa-solid fa-exclamation"></i>';
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
        }, 2000);
    }
});


const particles = document.querySelectorAll('.particle');
particles.forEach(particle => {
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
});


const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});


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


document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
    });
});


const langButtons = document.querySelectorAll('.lang-btn');
const translations = {
    en: {
        bio: 'Python Developer & Game Creator',
        skills: 'Skills',
        projects: 'Projects',
        contact: 'Contact Me',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message',
        loading: 'Loading...',
        madeBy: 'Made with',
        quickLinks: 'Quick Links',
        connect: 'Connect',
        skillsLink: 'Skills',
        projectsLink: 'Projects',
        contactLink: 'Contact',
        theme: 'Theme',
        language: 'Language'
    },
    ka: {
        bio: 'პითონ დეველოპერი და თამაშების შემქმნელი',
        skills: 'უნარები',
        projects: 'პროექტები',
        contact: 'დაკავშირება',
        name: 'სახელი',
        email: 'ელ-ფოსტა',
        message: 'შეტყობინება',
        send: 'გაგზავნა',
        loading: 'იტვირთება...',
        madeBy: 'შექმნა',
        quickLinks: 'სწრაფი ბმულები',
        connect: 'კონტაქტი',
        skillsLink: 'უნარები',
        projectsLink: 'პროექტები',
        contactLink: 'დაკავშირება',
        theme: 'თემა',
        language: 'ენა'
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update main content
    document.querySelector('.bio').textContent = translations[lang].bio;
    document.querySelector('.section-title:nth-of-type(1)').textContent = translations[lang].skills;
    document.querySelector('.section-title:nth-of-type(2)').textContent = translations[lang].projects;
    document.querySelector('.section-title:nth-of-type(3)').textContent = translations[lang].contact;
    document.querySelector('label[for="name"]').textContent = translations[lang].name;
    document.querySelector('label[for="email"]').textContent = translations[lang].email;
    document.querySelector('label[for="message"]').textContent = translations[lang].message;
    document.querySelector('.submit-btn span').textContent = translations[lang].send;
    document.querySelector('.loading-screen p').textContent = translations[lang].loading;
    document.querySelector('.footer-copyright p').textContent = `${translations[lang].madeBy} <i class="fa-solid fa-heart"></i> by <span class="creator-name">JustLukaBraza</span>`;
    
    // Update footer content
    document.querySelector('.footer-section:nth-child(1) h4').textContent = translations[lang].quickLinks;
    document.querySelector('.footer-section:nth-child(2) h4').textContent = translations[lang].connect;
    document.querySelector('.footer-section:nth-child(1) ul li:nth-child(1) a').textContent = translations[lang].skillsLink;
    document.querySelector('.footer-section:nth-child(1) ul li:nth-child(2) a').textContent = translations[lang].projectsLink;
    document.querySelector('.footer-section:nth-child(1) ul li:nth-child(3) a').textContent = translations[lang].contactLink;
    
    // Update language buttons
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.animation = 'rotate360 0.5s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
        }
    });
    
    // Update footer language buttons
    langButtonsFooter.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.animation = 'rotate360 0.5s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
        }
    });
}

// Add hover effect to language buttons
langButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.animation = 'rotate360 0.5s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
        }
    });
});

langButtonsFooter.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.animation = 'rotate360 0.5s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
        }
    });
});

// Initialize language
updateLanguage(currentLang);


const scrollToTop = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTop.classList.add('visible');
    } else {
        scrollToTop.classList.remove('visible');
    }
});

scrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Footer Theme Toggle
const themeToggleFooter = document.querySelector('.theme-toggle-footer');
const themeIconFooter = themeToggleFooter.querySelector('i');

themeToggleFooter.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    themeIconFooter.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    
    localStorage.setItem('theme', newTheme);
    
    themeIconFooter.style.animation = 'rotate360 0.5s ease';
    setTimeout(() => {
        themeIconFooter.style.animation = '';
    }, 500);
});

// Footer Language Switcher
const langButtonsFooter = document.querySelectorAll('.lang-btn-footer');

langButtonsFooter.forEach(btn => {
    btn.addEventListener('click', () => {
        updateLanguage(btn.dataset.lang);
    });
});

// Update footer language buttons
function updateFooterLanguageButtons(lang) {
    langButtonsFooter.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
} 