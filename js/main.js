/**
 * Claude Code Learning Portfolio - Interactive JavaScript
 * Built entirely with AI assistance - showcasing the future of development
 *
 * Features:
 * - Particle background system
 * - Mouse trail effects
 * - Typewriter animations
 * - Smooth scrolling & navigation
 * - Theme switching
 * - Interactive terminal
 * - Magnetic hover effects
 * - Sound system
 * - Performance optimizations
 */

class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.currentSection = 'home';
        this.soundEnabled = true;
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        this.trail = [];
        this.terminalCommands = {
            help: 'Available commands: help, projects, skills, joke, clear, whoami, claude',
            projects: 'Loading amazing AI-assisted projects...\n→ Interactive Dashboard\n→ Smart Analytics Tool\n→ AI Code Assistant\n→ Portfolio Website',
            skills: 'Core Skills:\n→ JavaScript/TypeScript ⭐⭐⭐⭐⭐\n→ React/Next.js ⭐⭐⭐⭐⭐\n→ Claude Code ⭐⭐⭐⭐⭐\n→ AI-Assisted Development ⭐⭐⭐⭐⭐',
            joke: 'Why do AI assistants make great coding partners?\nBecause they never get tired of your infinite loops! 🤖',
            clear: '',
            whoami: 'A passionate developer exploring the future of AI-assisted coding!',
            claude: 'Claude Code is my favorite AI coding companion! 🚀\nTogether we build amazing things.',
            date: () => new Date().toLocaleString(),
            random: () => Math.floor(Math.random() * 1000),
            matrix: 'Welcome to the Matrix... 🕶️',
            coffee: '☕ Brewing some coding fuel...',
            debug: 'console.log("Hello, World!"); // Classic!',
        };

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initParticleSystem();
        this.initMouseTrail();
        this.initTypewriter();
        this.initScrollAnimations();
        this.initNavigation();
        this.initThemeToggle();
        this.initSoundToggle();
        this.initTerminal();
        this.initMagneticEffects();
        this.initCounters();
        this.initSkillBars();
        this.initContactForm();
        this.initVisitorCounter();

        // Show loading screen for 2 seconds or until page is fully loaded
        const hideLoadingTimer = setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);

        // Also hide when page is fully loaded (fallback)
        if (document.readyState === 'complete') {
            clearTimeout(hideLoadingTimer);
            setTimeout(() => this.hideLoadingScreen(), 500);
        } else {
            window.addEventListener('load', () => {
                clearTimeout(hideLoadingTimer);
                setTimeout(() => this.hideLoadingScreen(), 500);
            });
        }

        console.log('🎉 Portfolio initialized with Claude Code assistance!');
    }

    setupEventListeners() {
        // Throttled scroll listener for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        });

        // Throttled mouse move listener
        let mouseMoveTimeout;
        document.addEventListener('mousemove', (e) => {
            if (mouseMoveTimeout) return;
            mouseMoveTimeout = setTimeout(() => {
                this.updateMousePosition(e);
                mouseMoveTimeout = null;
            }, 16);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Window resize handler
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

        // Visibility change for performance
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) {
            console.warn('Loading screen element not found');
            return;
        }

        loadingScreen.classList.add('hidden');

        // Remove from DOM after animation
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);

        this.isLoaded = true;
        this.playSound('startup');
    }

    // Particle System
    initParticleSystem() {
        this.particleCanvas = document.getElementById('particle-background');
        if (!this.particleCanvas) {
            // Create canvas if it doesn't exist
            this.particleCanvas = document.createElement('canvas');
            this.particleCanvas.id = 'particle-background';
            this.particleCanvas.className = 'particle-background';
            document.body.appendChild(this.particleCanvas);
        }

        this.particleCtx = this.particleCanvas.getContext('2d');
        this.resizeParticleCanvas();
        this.createParticles();
        this.animateParticles();
    }

    resizeParticleCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.particleCanvas.width,
                y: Math.random() * this.particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                type: Math.random() > 0.8 ? 'code' : 'dot'
            });
        }
    }

    animateParticles() {
        if (!this.particleCtx || document.hidden) {
            requestAnimationFrame(() => this.animateParticles());
            return;
        }

        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.particleCanvas.width;
            if (particle.x > this.particleCanvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.particleCanvas.height;
            if (particle.y > this.particleCanvas.height) particle.y = 0;

            // Mouse interaction
            const dx = this.mousePos.x - particle.x;
            const dy = this.mousePos.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.01;
                particle.y -= dy * force * 0.01;
            }

            this.particleCtx.save();
            this.particleCtx.globalAlpha = particle.opacity;

            if (particle.type === 'code') {
                this.particleCtx.fillStyle = '#3b82f6';
                this.particleCtx.font = `${particle.size * 8}px monospace`;
                const codeChars = ['0', '1', '{', '}', '(', ')', '<', '>', '/'];
                const char = codeChars[Math.floor(Math.random() * codeChars.length)];
                this.particleCtx.fillText(char, particle.x, particle.y);
            } else {
                this.particleCtx.fillStyle = '#64748b';
                this.particleCtx.beginPath();
                this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.particleCtx.fill();
            }

            this.particleCtx.restore();
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    // Mouse Trail System
    initMouseTrail() {
        this.trailCanvas = document.getElementById('mouse-trail');
        if (!this.trailCanvas) return;

        this.trailCtx = this.trailCanvas.getContext('2d');
        this.resizeTrailCanvas();
        this.animateMouseTrail();
    }

    resizeTrailCanvas() {
        if (!this.trailCanvas) return;
        this.trailCanvas.width = window.innerWidth;
        this.trailCanvas.height = window.innerHeight;
    }

    updateMousePosition(e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;

        // Add to trail
        this.trail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });

        // Limit trail length
        if (this.trail.length > 20) {
            this.trail.shift();
        }
    }

    animateMouseTrail() {
        if (!this.trailCtx || document.hidden) {
            requestAnimationFrame(() => this.animateMouseTrail());
            return;
        }

        this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

        const now = Date.now();
        this.trail = this.trail.filter(point => now - point.time < 500);

        if (this.trail.length > 1) {
            this.trailCtx.strokeStyle = '#3b82f6';
            this.trailCtx.lineWidth = 2;
            this.trailCtx.lineCap = 'round';

            for (let i = 0; i < this.trail.length - 1; i++) {
                const point = this.trail[i];
                const age = now - point.time;
                const opacity = Math.max(0, 1 - age / 500);

                this.trailCtx.globalAlpha = opacity;
                this.trailCtx.beginPath();
                this.trailCtx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                this.trailCtx.fill();
            }
        }

        requestAnimationFrame(() => this.animateMouseTrail());
    }

    // Typewriter Effect
    initTypewriter() {
        const typewriter = document.querySelector('.typewriter');
        if (!typewriter) return;

        const strings = typewriter.dataset.strings.split(',');
        let currentString = 0;
        let currentChar = 0;
        let isDeleting = false;

        const type = () => {
            const current = strings[currentString];

            if (isDeleting) {
                typewriter.textContent = current.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typewriter.textContent = current.substring(0, currentChar + 1);
                currentChar++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && currentChar === current.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentString = (currentString + 1) % strings.length;
                typeSpeed = 500; // Pause before next string
            }

            setTimeout(type, typeSpeed);
        };

        type();
    }

    // Scroll Animations
    initScrollAnimations() {
        this.observeElements();
        this.updateNavbarOnScroll();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger specific animations
                    if (entry.target.classList.contains('timeline-item')) {
                        this.animateTimelineItem(entry.target);
                    }

                    if (entry.target.classList.contains('skill-item')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements
        document.querySelectorAll('[data-reveal], .timeline-item, .skill-item').forEach(el => {
            observer.observe(el);
        });
    }

    updateNavbarOnScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', this.throttle(handleScroll, 16));
    }

    // Navigation System
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        // Smooth scroll navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.updateActiveNav(link);
                    this.playSound('click');
                }
            });
        });

        // Update active nav on scroll
        const updateActiveNavOnScroll = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.offsetHeight;

                if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                    current = section.id;
                }
            });

            if (current !== this.currentSection) {
                this.currentSection = current;
                const activeLink = document.querySelector(`[data-section="${current}"]`);
                if (activeLink) {
                    this.updateActiveNav(activeLink);
                }
            }
        };

        window.addEventListener('scroll', this.throttle(updateActiveNavOnScroll, 100));

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinksContainer = document.querySelector('.nav-links');

        if (mobileToggle && navLinksContainer) {
            mobileToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('mobile-open');
                mobileToggle.classList.toggle('active');
                this.playSound('click');
            });
        }
    }

    scrollToSection(section) {
        const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - 80;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            this.updateThemeIcon(newTheme);
            this.playSound('switch');
        });
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    // Terminal System
    initTerminal() {
        const terminalInput = document.getElementById('terminal-input');
        const terminalContent = document.getElementById('terminal-content');

        if (!terminalInput || !terminalContent) return;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                this.executeTerminalCommand(command);
                terminalInput.value = '';
            }
        });

        // Auto-focus terminal when section is visible
        const terminalSection = document.getElementById('terminal');
        if (terminalSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => terminalInput.focus(), 500);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(terminalSection);
        }
    }

    executeTerminalCommand(command) {
        const terminalContent = document.getElementById('terminal-content');
        if (!terminalContent) return;

        // Add command to terminal
        this.addTerminalLine(`claude-code $ ${command}`, 'command');

        // Execute command
        if (command === 'clear') {
            terminalContent.innerHTML = '';
            this.addTerminalLine('claude-code $ Welcome back! Type "help" for available commands.', 'output');
        } else if (this.terminalCommands[command]) {
            const output = typeof this.terminalCommands[command] === 'function'
                ? this.terminalCommands[command]()
                : this.terminalCommands[command];
            this.addTerminalLine(output, 'output');
        } else if (command.startsWith('echo ')) {
            const text = command.substring(5);
            this.addTerminalLine(text, 'output');
        } else if (command) {
            this.addTerminalLine(`Command not found: ${command}. Type "help" for available commands.`, 'error');
        }

        // Scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
        this.playSound('type');
    }

    addTerminalLine(text, type = 'output') {
        const terminalContent = document.getElementById('terminal-content');
        if (!terminalContent) return;

        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        if (type === 'command') {
            line.innerHTML = `<span class="prompt">claude-code $</span> <span class="command">${text.replace('claude-code $ ', '')}</span>`;
        } else if (type === 'error') {
            line.innerHTML = `<span class="output error">${text}</span>`;
        } else {
            line.innerHTML = `<span class="output">${text}</span>`;
        }

        terminalContent.appendChild(line);

        // Animate line appearance
        setTimeout(() => {
            line.style.opacity = '1';
        }, 50);
    }

    // Magnetic Effects
    initMagneticEffects() {
        document.querySelectorAll('[data-magnetic]').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const moveX = x * 0.1;
                const moveY = y * 0.1;

                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });

            element.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
        });
    }

    // Counters Animation
    initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Skill Bars Animation
    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress[data-width]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const width = entry.target.dataset.width;
                    setTimeout(() => {
                        entry.target.style.width = `${width}%`;
                    }, 100);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    animateTimelineItem(item) {
        const marker = item.querySelector('.timeline-marker');
        if (marker) {
            setTimeout(() => {
                marker.style.transform = 'translateX(-50%) scale(1.2)';
                setTimeout(() => {
                    marker.style.transform = 'translateX(-50%) scale(1)';
                }, 200);
            }, 300);
        }
    }

    animateSkillBar(item) {
        const progress = item.querySelector('.skill-progress');
        if (progress && progress.dataset.width) {
            setTimeout(() => {
                progress.style.width = `${progress.dataset.width}%`;
            }, 200);
        }
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');

        if (!form || !status) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            this.showFormStatus('Sending message...', 'info');

            // Simulate form submission (replace with actual endpoint)
            try {
                await this.simulateFormSubmission(data);
                this.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                this.playSound('success');
            } catch (error) {
                this.showFormStatus('Failed to send message. Please try again or contact me directly.', 'error');
                this.playSound('error');
            }
        });
    }

    async simulateFormSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Log form data (in real app, send to backend)
        console.log('Form submission:', data);

        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Submission failed'));
        }
    }

    showFormStatus(message, type) {
        const status = document.getElementById('form-status');
        if (!status) return;

        status.textContent = message;
        status.className = `form-status ${type} visible`;

        if (type === 'success') {
            setTimeout(() => {
                status.classList.remove('visible');
            }, 5000);
        }
    }

    // Visitor Counter
    initVisitorCounter() {
        const counter = document.getElementById('visitor-count');
        if (!counter) return;

        // Simulate visitor count (in real app, fetch from backend)
        const baseCount = 1234;
        const sessionCount = Math.floor(Math.random() * 100);
        const totalCount = baseCount + sessionCount;

        this.animateNumber(counter, totalCount, 2000);
    }

    animateNumber(element, target, duration) {
        const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateNumber();
    }

    // Sound System
    playSound(type) {
        if (!this.soundEnabled) return;

        const sounds = {
            hover: () => this.playTone(800, 0.1, 0.05),
            click: () => this.playTone(600, 0.15, 0.1),
            switch: () => this.playTone(1000, 0.2, 0.1),
            type: () => this.playTone(400, 0.1, 0.05),
            success: () => this.playChord([523, 659, 784], 0.3, 0.2),
            error: () => this.playTone(200, 0.5, 0.2),
            startup: () => this.playStartupSound()
        };

        if (sounds[type]) {
            sounds[type]();
        }
    }

    playTone(frequency, duration, volume = 0.1) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Fail silently if audio context not available
        }
    }

    playChord(frequencies, duration, volume = 0.1) {
        frequencies.forEach(freq => {
            setTimeout(() => this.playTone(freq, duration * 0.8, volume / frequencies.length), Math.random() * 50);
        });
    }

    playStartupSound() {
        const melody = [523, 659, 784, 1047];
        melody.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 0.1), i * 150);
        });
    }

    // Sound toggle
    initSoundToggle() {
        const soundToggle = document.querySelector('.sound-toggle');
        if (!soundToggle) return;

        soundToggle.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            const icon = soundToggle.querySelector('.sound-icon');
            if (icon) {
                icon.textContent = this.soundEnabled ? '🔊' : '🔇';
            }

            if (this.soundEnabled) {
                this.playSound('switch');
            }
        });
    }

    // Utility functions
    handleScroll() {
        this.updateNavbarOnScroll();
        // Add any other scroll handlers here
    }

    handleResize() {
        this.resizeParticleCanvas();
        this.resizeTrailCanvas();
        this.createParticles(); // Recreate particles for new screen size
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            this.particles.forEach(particle => {
                particle.vx *= 0.1;
                particle.vy *= 0.1;
            });
        } else {
            // Resume animations
            this.particles.forEach(particle => {
                particle.vx *= 10;
                particle.vy *= 10;
            });
        }
    }

    handleKeydown(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.scrollToSection(document.getElementById('home'));
                    break;
                case '2':
                    e.preventDefault();
                    this.scrollToSection(document.getElementById('about'));
                    break;
                case '3':
                    e.preventDefault();
                    this.scrollToSection(document.getElementById('projects'));
                    break;
                // Add more shortcuts as needed
            }
        }

        // Navigation with J/K keys (vim-style)
        if (!e.target.matches('input, textarea')) {
            switch (e.key.toLowerCase()) {
                case 'j':
                    e.preventDefault();
                    this.scrollToNextSection();
                    break;
                case 'k':
                    e.preventDefault();
                    this.scrollToPrevSection();
                    break;
                case 't':
                    e.preventDefault();
                    document.querySelector('.theme-toggle')?.click();
                    break;
            }
        }
    }

    scrollToNextSection() {
        const sections = ['home', 'about', 'projects', 'skills', 'journey', 'terminal', 'contact'];
        const currentIndex = sections.indexOf(this.currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        const nextSection = document.getElementById(sections[nextIndex]);
        if (nextSection) {
            this.scrollToSection(nextSection);
        }
    }

    scrollToPrevSection() {
        const sections = ['home', 'about', 'projects', 'skills', 'journey', 'terminal', 'contact'];
        const currentIndex = sections.indexOf(this.currentSection);
        const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        const prevSection = document.getElementById(sections[prevIndex]);
        if (prevSection) {
            this.scrollToSection(prevSection);
        }
    }

    // Performance utilities
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.portfolioApp) {
        window.portfolioApp.handleVisibilityChange();
    }
});

// Ensure proper cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Cleanup any ongoing animations or intervals
    if (window.portfolioApp) {
        // Add any cleanup code here if needed
    }
});

// Global error handler for better UX
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could show a user-friendly error message or report to analytics
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator && 'production' === 'production') {
    navigator.serviceWorker.register('./sw.js')
        .then(registration => {
            console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
}