const photosList = [
  'assets/photos/photo1.jpg',
  'assets/photos/photo2.jpg',
  'assets/photos/photo3.jpg',
  // Add all your photo paths here
];

function createPhotoElement(src) {
  const div = document.createElement('div');
  div.className = 'photo-item';
  
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

  document.querySelectorAll('.photo-item').forEach(item => {
    observer.observe(item);
  });
}

function loadPhotoContent() {
  const photoGrid = document.getElementById('photo-grid');
  photoGrid.innerHTML = ''; // Clear existing content
  
  // Hide model viewer if it exists
  const modelSection = document.getElementById('model-section');
  if (modelSection) modelSection.style.display = 'none';
  
  // Show photo grid
  photoGrid.style.display = 'grid';
  
  // Create and append photo elements
  photosList.forEach(photo => {
    const photoElement = createPhotoElement(photo);
    photoGrid.appendChild(photoElement);
  });
  
  // Initialize lazy loading
  lazyLoadImages();
} 