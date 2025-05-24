
        // Smooth scrolling for navigation links
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

        // Navigation background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                nav.style.background = 'rgba(10, 10, 10, 0.8)';
            }
        });

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thanks for your message! I\'ll get back to you soon.');
            this.reset();
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Projects Slider Functionality
        class ProjectSlider {
            constructor() {
                this.container = document.getElementById('projectsContainer');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.dotsContainer = document.getElementById('sliderDots');
                this.cards = document.querySelectorAll('.project-card');
                this.currentIndex = 0;
                this.cardWidth = 350;
                this.gap = 40;
                this.visibleCards = this.getVisibleCards();
                
                this.init();
                this.setupEventListeners();
                this.updateSlider();
            }

            init() {
                // Create dots
                const totalDots = Math.max(1, this.cards.length - this.visibleCards + 1);
                for (let i = 0; i < totalDots; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.addEventListener('click', () => this.goToSlide(i));
                    this.dotsContainer.appendChild(dot);
                }
                this.updateDots();
            }

            getVisibleCards() {
                const containerWidth = this.container.parentElement.offsetWidth;
                if (window.innerWidth <= 480) {
                    this.cardWidth = 250;
                    this.gap = 20;
                    return 1;
                } else if (window.innerWidth <= 768) {
                    this.cardWidth = 280;
                    this.gap = 20;
                    return 1;
                } else if (containerWidth < 800) {
                    return 1;
                } else if (containerWidth < 1200) {
                    return 2;
                } else {
                    return 3;
                }
            }

            setupEventListeners() {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                
                // Touch/swipe support
                let startX = 0;
                let currentX = 0;
                let isDragging = false;

                this.container.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    isDragging = true;
                });

                this.container.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault(); // Prevent default to avoid scrolling [R1 Edit]
                    currentX = e.touches[0].clientX;
                }, { passive: false }); // Set passive to false to allow preventDefault [R1 Edit]

                this.container.addEventListener('touchend', () => {
                    if (!isDragging) return;
                    isDragging = false;

                    const diffX = startX - currentX;
                    const threshold = 50;

                    if (Math.abs(diffX) > threshold) {
                        if (diffX > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    }
                });

                // Mouse drag support for desktop
                let mouseStartX = 0;
                let mouseCurrentX = 0;
                let isMouseDragging = false;

                this.container.addEventListener('mousedown', (e) => {
                    mouseStartX = e.clientX;
                    isMouseDragging = true;
                    this.container.style.cursor = 'grabbing';
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isMouseDragging) return;
                    mouseCurrentX = e.clientX;
                });

                document.addEventListener('mouseup', () => {
                    if (!isMouseDragging) return;
                    isMouseDragging = false;
                    this.container.style.cursor = 'grab';

                    const diffX = mouseStartX - mouseCurrentX;
                    const threshold = 50;

                    if (Math.abs(diffX) > threshold) {
                        if (diffX > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    }
                });

                // Resize handler
                window.addEventListener('resize', () => {
                    this.visibleCards = this.getVisibleCards();
                    this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.cards.length - this.visibleCards));
                    this.updateSlider();
                    this.recreateDots();
                });
            }

            recreateDots() {
                this.dotsContainer.innerHTML = '';
                const totalDots = Math.max(1, this.cards.length - this.visibleCards + 1);
                for (let i = 0; i < totalDots; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.addEventListener('click', () => this.goToSlide(i));
                    this.dotsContainer.appendChild(dot);
                }
                this.updateDots();
            }

            nextSlide() {
                const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
                if (this.currentIndex < maxIndex) {
                    this.currentIndex++;
                    this.updateSlider();
                }
            }

            prevSlide() {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.updateSlider();
                }
            }

            goToSlide(index) {
                const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
                this.currentIndex = Math.max(0, Math.min(index, maxIndex));
                this.updateSlider();
            }

            updateSlider() {
                const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
                this.container.style.transform = `translateX(${translateX}px)`;
                
                // Update navigation buttons
                this.prevBtn.disabled = this.currentIndex === 0;
                this.nextBtn.disabled = this.currentIndex >= Math.max(0, this.cards.length - this.visibleCards);
                
                this.updateDots();
            }

            updateDots() {
                const dots = this.dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }
        }

        // Initialize slider when DOM is loaded
        let projectSlider;
        
        document.addEventListener('DOMContentLoaded', () => {
            projectSlider = new ProjectSlider();
        });
