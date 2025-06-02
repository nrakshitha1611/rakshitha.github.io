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

// Observe all episode cards and skill items
document.querySelectorAll('.episode-card, .skill-item').forEach(el => {
    observer.observe(el);
});

// Animate skill progress bars when in view
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress');
            if (progressBar) {
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item').forEach(el => {
    skillObserver.observe(el);
});

// Add click handlers to episode cards
document.querySelectorAll('.episode-card').forEach(card => {
    card.addEventListener('click', () => {
        // Add your episode detail logic here
        console.log('Episode clicked:', card.querySelector('.episode-title').textContent);
    });
});