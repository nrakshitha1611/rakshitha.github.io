// Smooth scrolling
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.netflix-header');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Update scroll progress bar
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all episode cards
document.querySelectorAll('.episode-card').forEach(el => {
    observer.observe(el);
});

// Add click handlers to episode cards
document.querySelectorAll('.episode-card').forEach(card => {
    card.addEventListener('click', () => {
        console.log('Episode clicked:', card.querySelector('.episode-title').textContent);
    });
});

// Technical Arsenal Carousel Class
class TechnicalCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('indicators');
        this.progressFill = document.getElementById('progressFill');
        this.container = document.querySelector('.carousel-container');
        
        // Check if elements exist before initializing
        if (!this.track || !this.prevBtn || !this.nextBtn || !this.indicators || !this.progressFill) {
            console.warn('Carousel elements not found');
            return;
        }
        
        this.cards = Array.from(this.track.children);
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.gap = 20; // Match CSS gap
        this.cardsToShow = 1;
        this.maxIndex = 0;
        
        this.init();
    }

    calculateDimensions() {
        if (this.cards.length === 0) return;
        
        // Get actual card width and container width
        const containerWidth = this.container.offsetWidth - 40; // Account for padding
        const cardStyle = window.getComputedStyle(this.cards[0]);
        this.cardWidth = this.cards[0].offsetWidth;
        
        // Calculate how many cards can fit
        this.cardsToShow = Math.floor(containerWidth / (this.cardWidth + this.gap));
        this.cardsToShow = Math.max(1, Math.min(this.cardsToShow, this.cards.length));
        
        // Calculate max index for sliding
        this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
        
        console.log('Carousel dimensions:', {
            containerWidth,
            cardWidth: this.cardWidth,
            cardsToShow: this.cardsToShow,
            totalCards: this.cards.length,
            maxIndex: this.maxIndex
        });
    }

    init() {
        this.calculateDimensions();
        this.createIndicators();
        this.updateCarousel();
        this.bindEvents();
        this.startAutoPlay();
    }

    createIndicators() {
        this.indicators.innerHTML = '';
        const totalPages = this.maxIndex + 1;
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(indicator);
        }
    }

    updateCarousel() {
        const translateX = -this.currentIndex * (this.cardWidth + this.gap);
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update indicators
        const indicators = this.indicators.children;
        Array.from(indicators).forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update progress bar
        const progress = this.maxIndex > 0 ? (this.currentIndex / this.maxIndex) * 100 : 0;
        this.progressFill.style.width = `${progress}%`;
        
        // Update button states
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        
        // Add visual feedback for disabled buttons
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
    }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
        this.resetAutoPlay();
    }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to start
        }
        this.updateCarousel();
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex; // Loop to end
        }
        this.updateCarousel();
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });
        
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoPlay();
        });

        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        let isScrolling = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                isScrolling = true;
                e.preventDefault();
            }
        }, { passive: false });

        this.track.addEventListener('touchend', (e) => {
            if (!startX || !isScrolling) return;
            
            const diffX = startX - e.changedTouches[0].clientX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                this.resetAutoPlay();
            }
            
            startX = 0;
            startY = 0;
            isScrolling = false;
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });

        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldCardsToShow = this.cardsToShow;
                this.calculateDimensions();
                
                if (oldCardsToShow !== this.cardsToShow) {
                    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                    this.createIndicators();
                }
                this.updateCarousel();
            }, 250);
        });

        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        if (this.maxIndex > 0) { // Only auto-play if there are multiple slides
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 4000); // 4 seconds
        }
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.startAutoPlay();
    }

    // Public method to refresh carousel
    refresh() {
        this.calculateDimensions();
        this.createIndicators();
        this.updateCarousel();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all elements to be rendered and styles applied
    setTimeout(() => {
        window.technicalCarousel = new TechnicalCarousel();
    }, 200);
});