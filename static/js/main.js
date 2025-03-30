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


const musicBtn = document.getElementById('musicToggle');
const musicIcon = musicBtn.querySelector('i');
let isMusicPlaying = false;


const audio = new Audio('/static/music/dasi.mp3');
audio.loop = true;


const wasMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
if (wasMusicPlaying) {
    isMusicPlaying = true;
    audio.play();
    musicIcon.classList.remove('fa-play');
    musicIcon.classList.add('fa-pause');
    musicBtn.classList.add('playing');
}

function playMusic() {
    audio.play();
    isMusicPlaying = true;
    musicIcon.classList.remove('fa-play');
    musicIcon.classList.add('fa-pause');
    musicBtn.classList.add('playing');
    localStorage.setItem('musicPlaying', 'true');
}

function pauseMusic() {
    audio.pause();
    isMusicPlaying = false;
    musicIcon.classList.remove('fa-pause');
    musicIcon.classList.add('fa-play');
    musicBtn.classList.remove('playing');
    localStorage.setItem('musicPlaying', 'false');
}

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});


document.addEventListener('touchstart', function() {
    if (!isMusicPlaying) {
        playMusic();
    }
}, { once: true });


document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (isMusicPlaying) {
            pauseMusic();
        }
    } else {
        if (wasMusicPlaying) {
            playMusic();
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
        const response = await fetch('/contact', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
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
        madeBy: 'Made with'
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
        madeBy: 'შექმნა'
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    
    document.querySelector('.bio').textContent = translations[lang].bio;
    document.querySelector('.section-title:nth-of-type(1)').textContent = translations[lang].skills;
    document.querySelector('.section-title:nth-of-type(2)').textContent = translations[lang].projects;
    document.querySelector('.section-title:nth-of-type(3)').textContent = translations[lang].contact;
    document.querySelector('label[for="name"]').textContent = translations[lang].name;
    document.querySelector('label[for="email"]').textContent = translations[lang].email;
    document.querySelector('label[for="message"]').textContent = translations[lang].message;
    document.querySelector('.submit-btn span').textContent = translations[lang].send;
    document.querySelector('.loading-screen p').textContent = translations[lang].loading;
    document.querySelector('.footer-content p').textContent = `${translations[lang].madeBy} <i class="fa-solid fa-heart"></i> by <span class="creator-name">JustLukaBraza</span>`;
    
    
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        updateLanguage(btn.dataset.lang);
    });
});


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