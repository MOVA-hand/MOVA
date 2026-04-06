window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!dropdown || !button) {
        return;
    }
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && dropdown && button && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        if (!dropdown || !button) {
            return;
        }
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Autoplay comparison videos only when visible
function setupManagedVideoPlayback() {
    const managedVideos = document.querySelectorAll('.comparison-slider video, .results-carousel video');
    
    if (managedVideos.length === 0 || typeof IntersectionObserver === 'undefined') return;

    function tryPlay(video) {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                tryPlay(video);
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '100px 0px 100px 0px'
    });
    
    managedVideos.forEach(video => {
        video.load();
        video.addEventListener('loadeddata', function() {
            tryPlay(video);
        });
        observer.observe(video);
    });
}

// Videos in the new demo layout play independently, no sync needed

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup managed playback for all videos
    setupManagedVideoPlayback();

    // Initialize comparison sliders (for applications section)
    initComparisonSliders();
})

// ===== Image Comparison Slider =====
function initComparisonSliders() {
  document.querySelectorAll('.comparison-slider').forEach(function(slider) {
    var topWrapper = slider.querySelector('.comp-img-top-wrapper');
    var divider = slider.querySelector('.comp-divider');
    var handle = slider.querySelector('.comp-handle');
    var isDragging = false;

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      topWrapper.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      divider.style.left = pct + '%';
      handle.style.left = pct + '%';
    }

    function getPercent(e) {
      var rect = slider.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onStart(e) {
      e.preventDefault();
      isDragging = true;
      setPosition(getPercent(e));
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(getPercent(e));
    }

    function onEnd() {
      isDragging = false;
    }

    slider.addEventListener('mousedown', onStart);
    slider.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  });
}
