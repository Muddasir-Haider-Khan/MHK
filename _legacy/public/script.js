// ============================================
// PORTFOLIO SYSTEM - CINEMATIC ANIMATION ENGINE
// ============================================
const API_BASE = window.location.origin + '/api';
let portfolioData = null;

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX - 8, y: mouseY - 8, duration: 0.1 });
    gsap.to(follower, { x: mouseX - 24, y: mouseY - 24, duration: 0.5, ease: "power2.out" });
});

// Magnetic Buttons
document.querySelectorAll('.hover-magnetic').forEach((magnet) => {
    magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        gsap.to(cursor, { scale: 3, duration: 0.3 });
        gsap.to(follower, { scale: 0, opacity: 0, duration: 0.3 });
    });
    magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, { x: 0, y: 0, duration: 0.5 });
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
    });
});

// ============================================
// HERO PARTICLES
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = (Math.random() * 4 + 2) + 'px';
        p.style.height = p.style.width;
        p.style.opacity = Math.random() * 0.5 + 0.1;
        container.appendChild(p);

        gsap.to(p, {
            y: -100 + Math.random() * 200,
            x: -50 + Math.random() * 100,
            opacity: 0,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            delay: Math.random() * 3,
            ease: "none",
        });
    }
}

// Mouse parallax on hero glow + 3D hero text
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.hero-glow');
    const heroTitle = document.querySelector('.hero-title');
    const heroSection = document.getElementById('hero');

    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;

    if (glow) {
        gsap.to(glow, { x: nx * 60, y: ny * 60, duration: 1, ease: "power2.out" });
    }

    // 3D tilt only when hero is in view
    if (heroTitle && heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            gsap.to(heroTitle, {
                rotateY: nx * 12,
                rotateX: -ny * 8,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }
});

// Set data-text for 3D shadow pseudo-element
const heroNameEl = document.getElementById('hero-name-line');
if (heroNameEl) heroNameEl.setAttribute('data-text', heroNameEl.textContent);

// ============================================
// MOBILE MENU
// ============================================
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.style.transform = 'translateX(0)');
    closeMenu?.addEventListener('click', () => mobileMenu.style.transform = 'translateX(100%)');
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileMenu.style.transform = 'translateX(100%)');
    });
}

// ============================================
// LOADER & HERO ANIMATION
// ============================================
window.addEventListener('load', async () => {
    // Fetch data
    try {
        const res = await fetch(API_BASE + '/all');
        portfolioData = await res.json();
        populatePortfolio(portfolioData);
        // Refresh ScrollTrigger after content is loaded
        ScrollTrigger.refresh();
    } catch (e) {
        console.log('API not available, using defaults');
        setupNarrative(defaultNarrative);
    }

    createParticles();

    // Loader animation
    const fill = document.querySelector('.loader-fill');
    if (fill) {
        gsap.to(fill, { width: '100%', duration: 1.2, ease: "power2.inOut" });
    }

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to('.loader-bg', { yPercent: -100, duration: 1.5, ease: "power4.inOut", delay: 1 })
        .to('#hero-name-line', { yPercent: 0, duration: 1.5, ease: "power4.out", clearProps: "transform" }, "-=1")
        .to('.hero-tagline-pill', { y: 0, opacity: 1, duration: 1, clearProps: "transform" }, "-=1")
        .to('.hero-subtitle', { opacity: 1, duration: 1 }, "-=0.8")
        .to('.scroll-indicator', { opacity: 1, duration: 1 }, "-=0.5");

    // Back to Top Logic
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) btt.classList.add('visible');
            else btt.classList.remove('visible');
        });
        btt.addEventListener('click', () => {
            lenis.scrollTo(0);
        });
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

// ============================================
// POPULATE PORTFOLIO FROM API
// ============================================
function populatePortfolio(data) {
    if (!data) return;
    const { profile, skills, projects, experience, education, settings } = data;

    // Hero
    if (profile) {
        const nameEl = document.getElementById('hero-name-line');
        const loaderEl = document.getElementById('loader-text');
        if (profile.name) {
            const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase();
            if (nameEl) {
                nameEl.textContent = initials;
                nameEl.setAttribute('data-text', initials);
            }
            if (loaderEl) loaderEl.textContent = initials;
            // Don't reset the transform — GSAP controls it
        }
        const taglineEl = document.getElementById('hero-tagline');
        if (taglineEl && profile.tagline) taglineEl.textContent = profile.tagline;
        const titleEl = document.getElementById('hero-title-text');
        if (titleEl && profile.title) titleEl.textContent = profile.title;
        const philEl = document.getElementById('philosophy-quote');
        if (philEl && profile.philosophy) philEl.textContent = profile.philosophy;
        const emailEl = document.getElementById('contact-email');
        const emailLink = document.getElementById('contact-email-link');
        if (emailEl && profile.email) {
            emailEl.textContent = profile.email;
            if (emailLink) emailLink.href = 'mailto:' + profile.email;
        }
        // Social links
        const socialContainer = document.getElementById('social-links');
        if (socialContainer) {
            const socials = [
                { url: profile.github, icon: 'github' },
                { url: profile.linkedin, icon: 'linkedin' },
                { url: profile.twitter, icon: 'twitter' },
                { url: profile.website, icon: 'globe' },
            ].filter(s => s.url);
            socialContainer.innerHTML = socials.map(s =>
                `<a href="${s.url}" target="_blank" class="social-icon hover-magnetic"><i data-lucide="${s.icon}" class="w-5 h-5"></i></a>`
            ).join('');
        }
        // Narrative
        if (profile.narrative) {
            try {
                const sentences = JSON.parse(profile.narrative);
                if (sentences.length) setupNarrative(sentences);
            } catch { }
        }
    }

    // Skills
    if (skills && skills.length) renderSkills(skills);

    // Projects
    if (projects && projects.length) renderProjects(projects);

    // Experience + Education
    if (experience && experience.length) renderTimeline(experience, education || []);

    // Trust counters
    if (settings) {
        document.querySelectorAll('.counter-value').forEach(el => {
            const key = el.parentElement.querySelector('p')?.textContent?.toLowerCase();
            if (key?.includes('project') && settings.projects_completed) el.dataset.target = settings.projects_completed;
            if (key?.includes('year') && settings.years_experience) el.dataset.target = settings.years_experience;
            if (key?.includes('tech') && settings.technologies_used) el.dataset.target = settings.technologies_used;
        });
    }

    // Re-init icons
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 100);
}

// ============================================
// NARRATIVE SCROLL (Story Section)
// ============================================
let storyTimeline = null;
function setupNarrative(sentences) {
    const narrativeEl = document.querySelector('.narrative-text');
    if (!narrativeEl || !sentences.length) return;

    // Kill any existing story timeline and its ScrollTrigger
    if (storyTimeline) {
        storyTimeline.scrollTrigger?.kill(true);
        storyTimeline.kill();
        storyTimeline = null;
        // Reset the pin spacer that ScrollTrigger may have left behind
        narrativeEl.textContent = '';
    }

    // Calculate scroll distance based on number of sentences
    const scrollDistance = sentences.length * 80; // 80vh per sentence

    storyTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#story",
            start: "top top",
            end: `+=${scrollDistance}%`,
            scrub: 0.5,
            pin: true,
        }
    });

    sentences.forEach((sentence, i) => {
        if (i > 0) {
            storyTimeline.to(narrativeEl, { opacity: 0, duration: 0.3 });
        }
        storyTimeline.to(narrativeEl, { text: sentence, duration: 0.01, ease: "none" })
            .to(narrativeEl, { opacity: 1, duration: 0.5 })
            .to(narrativeEl, { opacity: 1, duration: 0.8 }); // hold
    });
    // Fade out at the end for smooth transition
    storyTimeline.to(narrativeEl, { opacity: 0, duration: 0.5 });
}

// Default narrative (used as fallback if API fails)
const defaultNarrative = [
    "Hello there.",
    "I see you're looking for something specific.",
    "Something that solves a problem...",
    "...and looks good doing it.",
    "I build with precision.",
    "Every line of code has a purpose."
];

// ============================================
// SKILLS RENDERING
// ============================================
function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Group by category
    const categories = {};
    skills.forEach(s => {
        if (!categories[s.category]) categories[s.category] = [];
        categories[s.category].push(s);
    });

    const categoryIcons = {
        'Frontend': 'monitor', 'Backend': 'server', 'Database': 'database',
        'DevOps': 'cloud', 'AI/ML': 'brain', 'Tools': 'wrench',
        'Mobile': 'smartphone', 'Design': 'palette', 'Languages': 'code-2'
    };

    // Map skill names to Lucide icons
    const skillIcons = {
        // Frontend
        'React': 'atom', 'React.js': 'atom', 'Next.js': 'triangle', 'Vue': 'hexagon', 'Vue.js': 'hexagon',
        'Angular': 'diamond', 'Svelte': 'flame', 'HTML': 'file-code', 'HTML5': 'file-code',
        'CSS': 'paintbrush', 'CSS3': 'paintbrush', 'Tailwind': 'wind', 'Tailwind CSS': 'wind',
        'Bootstrap': 'layout-grid', 'SASS': 'palette', 'SCSS': 'palette',
        'JavaScript': 'braces', 'TypeScript': 'file-type', 'jQuery': 'chevrons-right',
        'Redux': 'git-branch', 'Framer Motion': 'sparkles',

        // Backend
        'Node.js': 'hexagon', 'Express': 'route', 'Express.js': 'route',
        'Django': 'shield', 'Flask': 'flask-conical', 'FastAPI': 'zap',
        'Spring': 'leaf', 'Spring Boot': 'leaf', 'Laravel': 'code-2',
        'Ruby on Rails': 'gem', 'PHP': 'file-code-2', 'ASP.NET': 'layers',
        'GraphQL': 'share-2', 'REST': 'plug', 'REST API': 'plug',

        // Languages
        'Python': 'terminal', 'Java': 'coffee', 'C++': 'cpu', 'C#': 'hash',
        'C': 'binary', 'Go': 'arrow-right', 'Golang': 'arrow-right',
        'Rust': 'settings', 'Kotlin': 'smartphone', 'Swift': 'bird',
        'Dart': 'target', 'R': 'bar-chart-3',

        // Database
        'MongoDB': 'database', 'PostgreSQL': 'database', 'MySQL': 'database',
        'Redis': 'hard-drive', 'Firebase': 'flame', 'Firestore': 'flame',
        'SQLite': 'table-2', 'SQL': 'table', 'Supabase': 'zap',
        'DynamoDB': 'cloud', 'Elasticsearch': 'search',

        // DevOps
        'Docker': 'container', 'Kubernetes': 'network', 'AWS': 'cloud',
        'Azure': 'cloud-cog', 'GCP': 'cloud', 'Google Cloud': 'cloud',
        'CI/CD': 'git-merge', 'Jenkins': 'workflow', 'Nginx': 'server',
        'Linux': 'terminal-square', 'Vercel': 'triangle', 'Netlify': 'globe',
        'Heroku': 'cloud-lightning', 'DigitalOcean': 'droplet',

        // AI/ML
        'TensorFlow': 'brain-circuit', 'PyTorch': 'flame', 'Scikit-learn': 'scatter-chart',
        'OpenAI': 'bot', 'Machine Learning': 'brain', 'Deep Learning': 'layers',
        'NLP': 'message-square', 'Computer Vision': 'eye', 'Pandas': 'table-2',
        'NumPy': 'calculator', 'Jupyter': 'book-open',

        // Tools
        'Git': 'git-branch', 'GitHub': 'github', 'VS Code': 'code-2',
        'Figma': 'figma', 'Postman': 'send', 'Jira': 'kanban',
        'Webpack': 'package', 'Vite': 'zap', 'npm': 'package',
        'Yarn': 'package', 'Babel': 'file-cog',

        // Mobile
        'React Native': 'smartphone', 'Flutter': 'smartphone',
        'Android': 'smartphone', 'iOS': 'tablet-smartphone',

        // Design
        'Photoshop': 'image', 'Illustrator': 'pen-tool', 'XD': 'layout',
        'Canva': 'palette', 'Blender': 'box', 'After Effects': 'film'
    };

    const getSkillIcon = (name) => {
        return skillIcons[name] || skillIcons[name.replace('.js', '')] || 'code-2';
    };

    let html = '';
    Object.entries(categories).forEach(([cat, catSkills]) => {
        const icon = categoryIcons[cat] || 'zap';
        html += `<div class="skill-category-section mb-16">
            <div class="flex items-center gap-4 mb-8">
                <div class="skill-category-icon">
                    <i data-lucide="${icon}" class="w-5 h-5 text-brand-purple"></i>
                </div>
                <h3 class="text-lg font-display font-semibold text-white/80">${cat}</h3>
                <span class="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full">${catSkills.length} skills</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">`;
        catSkills.forEach(skill => {
            const level = skill.level || 80;
            const circumference = 2 * Math.PI * 28;
            const offset = circumference - (level / 100) * circumference;
            const lucideIcon = getSkillIcon(skill.name);
            html += `<div class="skill-card group" data-skill='${JSON.stringify(skill)}' onclick="showSkillDetail(this)">
                <div class="skill-card-border"></div>
                <div class="skill-card-inner">
                    <div class="skill-ring-wrap">
                        <svg class="skill-ring" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(139,92,246,0.08)" stroke-width="3"/>
                            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#skillGrad)" stroke-width="3"
                                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                                stroke-linecap="round" transform="rotate(-90 32 32)" class="skill-ring-progress"/>
                        </svg>
                        <span class="skill-ring-icon"><i data-lucide="${lucideIcon}" class="w-5 h-5 text-brand-purple"></i></span>
                    </div>
                    <p class="skill-card-name">${skill.name}</p>
                    <span class="skill-card-level">${level}%</span>
                </div>
            </div>`;
        });
        html += `</div></div>`;
    });

    // SVG gradient definition
    html += `<svg class="absolute w-0 h-0"><defs>
        <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
    </defs></svg>`;

    container.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Staggered entrance animation
    gsap.utils.toArray('.skill-category-section').forEach(section => {
        const cards = section.querySelectorAll('.skill-card');
        gsap.from(cards, {
            opacity: 0,
            y: 30,
            scale: 0.9,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.4)",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Skill detail panel
window.showSkillDetail = function (el) {
    const skill = JSON.parse(el.dataset.skill);
    document.getElementById('skill-detail-name').textContent = skill.name;
    document.getElementById('skill-detail-category').textContent = skill.category;
    document.getElementById('skill-detail-desc').textContent = skill.description || `Professional-grade expertise in ${skill.name}.`;
    const bar = document.getElementById('skill-detail-bar');
    bar.style.width = '0%';
    document.getElementById('skill-detail').style.transform = 'translateY(0)';
    setTimeout(() => { bar.style.width = skill.level + '%'; }, 100);
};

document.getElementById('close-skill-detail')?.addEventListener('click', () => {
    document.getElementById('skill-detail').style.transform = 'translateY(100%)';
});

// ============================================
// PROJECTS RENDERING
// ============================================
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = projects.map((proj, i) => {
        const techs = Array.isArray(proj.technologies) ? proj.technologies : [];
        const isOdd = i % 2 !== 0;
        return `<div class="project-card group grid md:grid-cols-2 gap-12 items-center" data-project='${JSON.stringify(proj)}'>
            <div class="${isOdd ? 'order-2' : 'order-2 md:order-1'} relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer project-image-container" onclick="openProjectModal(this.parentElement)">
                <img src="${proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'}"
                    alt="${proj.title}" loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span class="text-sm font-mono text-white/80">Click to explore →</span>
                </div>
            </div>
            <div class="${isOdd ? 'order-1' : 'order-1 md:order-2'} ${isOdd ? 'md:text-right' : ''}">
                <h3 class="text-4xl md:text-5xl font-display font-bold mb-4 group-hover:text-brand-purple transition-colors cursor-pointer" onclick="openProjectModal(this.parentElement.parentElement)">
                    ${proj.title}
                </h3>
                <p class="text-gray-400 mb-6 max-w-md ${isOdd ? 'ml-auto' : ''}">${proj.description}</p>
                <div class="flex flex-wrap gap-2 ${isOdd ? 'justify-end' : ''}">
                    ${techs.map(t => `<span class="project-tech-tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>`;
    }).join('');

    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Project Modal
window.openProjectModal = function (cardEl) {
    const proj = JSON.parse(cardEl.dataset.project);
    const modal = document.getElementById('project-modal');
    document.getElementById('modal-image').src = proj.image || '';
    document.getElementById('modal-title').textContent = proj.title;
    document.getElementById('modal-role').textContent = proj.role || '';
    document.getElementById('modal-description').textContent = proj.long_description || proj.description;
    document.getElementById('modal-outcome').querySelector('p:last-child').textContent = proj.outcome || 'Delivered successfully.';
    const techs = Array.isArray(proj.technologies) ? proj.technologies : [];
    document.getElementById('modal-techs').innerHTML = techs.map(t => `<span class="project-tech-tag">${t}</span>`).join('');

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('#modal-content').style.transform = 'scale(1)';
    lenis.stop();
};

document.getElementById('close-modal')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', closeModal);
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('#modal-content').style.transform = 'scale(0.95)';
    lenis.start();
}

// ============================================
// TIMELINE RENDERING
// ============================================
function renderTimeline(experience, education) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const items = [
        ...experience.map(e => ({ ...e, type: 'experience' })),
        ...education.map(e => ({ ...e, type: 'education', company: e.institution, position: `${e.degree}${e.field ? ' in ' + e.field : ''}` })),
    ];

    container.innerHTML = items.map((item, i) => {
        const techs = Array.isArray(item.technologies) ? item.technologies : [];
        return `<div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content" onclick="this.querySelector('.timeline-expand')?.classList.toggle('open')">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-brand-purple font-mono">${item.start_date} — ${item.current ? 'Present' : item.end_date}</span>
                    ${item.type === 'education' ? '<span class="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full">Education</span>' : ''}
                </div>
                <h3 class="text-xl font-display font-bold">${item.position}</h3>
                <p class="text-gray-400 text-sm">${item.company}</p>
                <div class="timeline-expand mt-3">
                    <p class="text-gray-300 text-sm leading-relaxed">${item.description || ''}</p>
                    ${techs.length ? `<div class="flex flex-wrap gap-1.5 mt-3">${techs.map(t => `<span class="project-tech-tag text-[10px]">${t}</span>`).join('')}</div>` : ''}
                </div>
                <button class="text-xs text-gray-500 hover:text-brand-purple mt-2 transition-colors">Click to expand</button>
            </div>
        </div>`;
    }).join('');

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: i % 2 === 0 ? -40 : 40,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Timeline progress line
    const timelineLine = document.querySelector('.timeline-progress');
    if (timelineLine) {
        gsap.to(timelineLine, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '#experience',
                start: 'top center',
                end: 'bottom center',
                scrub: true
            }
        });
    }
}

// ============================================
// PROCESS SECTION ANIMATIONS
// ============================================
ScrollTrigger.create({
    trigger: '#process',
    start: 'top 70%',
    onEnter: () => {
        gsap.to('.process-step', {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1,
            stagger: 0.15,
            ease: "elastic.out(1, 0.8)"
        });
        gsap.to('.process-connector', {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.25,
            delay: 0.6,
            ease: "power2.inOut"
        });
    },
    once: true
});

// Tilt effect on glass cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
            rotationY: x * 10,
            rotationX: -y * 10,
            transformPerspective: 800,
            duration: 0.4,
            ease: "power2.out"
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        });
    });
});

// ============================================
// PHILOSOPHY ANIMATION
// ============================================
ScrollTrigger.create({
    trigger: '#philosophy',
    start: 'top 60%',
    onEnter: () => {
        gsap.to('.philosophy-text', {
            opacity: 1,
            scale: 1,
            duration: 1.8,
            ease: "power3.out"
        });
    },
    once: true
});

// ============================================
// TRUST COUNTERS
// ============================================
ScrollTrigger.create({
    trigger: '#trust',
    start: 'top 70%',
    onEnter: () => {
        document.querySelectorAll('.trust-counter').forEach((counter, i) => {
            gsap.to(counter, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.2,
                ease: "back.out(1.5)"
            });
        });
        document.querySelectorAll('.counter-value').forEach(el => {
            const target = parseInt(el.dataset.target) || 0;
            gsap.to(el, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                ease: "power2.out",
                onUpdate: function () {
                    el.textContent = Math.round(parseFloat(el.textContent)) + '+';
                }
            });
        });
    },
    once: true
});

// ============================================
// CONTACT ANIMATION
// ============================================
ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 60%',
    onEnter: () => {
        gsap.to('.contact-title', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    },
    once: true
});

// ============================================
// SECTION HEADING PARALLAX
// ============================================
gsap.utils.toArray('section h2').forEach(heading => {
    gsap.to(heading, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
            trigger: heading,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
});

// ============================================
// CLOCK
// ============================================
function updateTime() {
    const now = new Date();
    const el = document.getElementById('time');
    if (el) el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();
