const photosList = [
  'assets/photos/photo1.jpg',
  'assets/photos/photo2.jpg',
  'assets/photos/photo3.jpg',
  // Add all your photo paths here
];

function createPhotoElement(src) {
  const div = document.createElement('div');
  div.className = 'photo-card';
  
  const img = document.createElement('img');
  img.dataset.src = src; // Store the source for lazy loading
  
  div.appendChild(img);
  return div;
}

function lazyLoadImages() {
  const options = {
    root: document.querySelector('#content'),
    rootMargin: '50px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('img');
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          delete img.dataset.src;
          observer.unobserve(entry.target);
        }
      }
    });
  }, options);

  document.querySelectorAll('.photo-card').forEach(item => {
    observer.observe(item);
  });
}

function initializeFullscreenViewer() {
    const container = document.getElementById('fullscreen-container');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const closeButton = document.querySelector('.close-button');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const photoCards = document.querySelectorAll('.photo-card');
    let currentPhotoIndex = 0;
    
    // Add touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;

    // Add touch event listeners
    fullscreenImage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, false);

    fullscreenImage.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, false);

    fullscreenImage.addEventListener('touchend', () => {
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50; // Minimum distance for a swipe

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe right - show previous photo
                navigatePhoto(-1);
            } else {
                // Swipe left - show next photo
                navigatePhoto(1);
            }
        }
    }, false);

    // Add click handlers to all photo cards
    photoCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            fullscreenImage.src = img.src;
            currentPhotoIndex = index;
            container.classList.remove('fullscreen-hidden');
            document.body.style.overflow = 'hidden';
            
            // Hide hamburger menu
            if (hamburgerMenu) {
                hamburgerMenu.style.display = 'none';
            }

            // Close mobile menu if it's open
            const sidebar = document.querySelector('#sidebar');
            if (sidebar.classList.contains('active')) {
                document.querySelector('.hamburger-menu').click();
            }
        });
    });

    // Function to navigate to next/previous photo
    function navigatePhoto(direction) {
        currentPhotoIndex = (currentPhotoIndex + direction + photoCards.length) % photoCards.length;
        const newImg = photoCards[currentPhotoIndex].querySelector('img');
        fullscreenImage.src = newImg.src;
    }

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!container.classList.contains('fullscreen-hidden')) {
            switch (e.key) {
                case 'ArrowLeft':
                    navigatePhoto(-1); // Previous photo
                    break;
                case 'ArrowRight':
                    navigatePhoto(1); // Next photo
                    break;
                case 'Escape':
                    closeFullscreen();
                    break;
            }
        }
    });

    // Close fullscreen on clicking X or outside the image
    closeButton.addEventListener('click', closeFullscreen);
    container.addEventListener('click', (e) => {
        if (e.target === container) {
            closeFullscreen();
        }
    });
}

function closeFullscreen() {
    const container = document.getElementById('fullscreen-container');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    container.classList.add('fullscreen-hidden');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Show hamburger menu again
    if (hamburgerMenu) {
        hamburgerMenu.style.display = 'block';
    }
}

function loadPhotoContent() {
    // Don't clear or recreate the photo grid since it's already in our HTML
    
    // Hide model viewer if it exists
    const modelSection = document.getElementById('model-section');
    if (modelSection) modelSection.style.display = 'none';
    
    // Initialize fullscreen viewer
    initializeFullscreenViewer();
} 