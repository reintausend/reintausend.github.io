function loadContent(project) {
    const mainContent = document.getElementById('main-content');
    const leftLogoContainer = document.querySelector('#sidebar .logo-container');
  
    // Clean up any existing p5 canvas
    const existingCanvases = document.querySelectorAll('.p5Canvas');
    existingCanvases.forEach(canvas => canvas.remove());
    
    // Remove any existing moodring scripts
    const existingScripts = document.querySelectorAll('script[src*="moodring.js"]');
    existingScripts.forEach(script => script.remove());

    // Clear all previously selected items to 60% opacity
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.classList.remove('selected');
        item.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    });
    
    // Clear all dropdown links to 60% opacity
    const allDropdownLinks = document.querySelectorAll('.dropdown-link');
    allDropdownLinks.forEach(link => {
        link.classList.remove('active');
        link.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    });

    // Set active states
    const selectedLink = document.querySelector(`[onclick="loadContent('${project}')"]`);
    if (selectedLink) {
        if (selectedLink.classList.contains('dropdown-link')) {
            selectedLink.classList.add('active');
            selectedLink.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            const projectsMenuItem = document.querySelector('.has-dropdown');
            if (projectsMenuItem) {
                projectsMenuItem.classList.add('selected');
                projectsMenuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }
        } else {
            const menuItem = selectedLink.closest('.menu-item');
            if (menuItem) {
                menuItem.classList.add('selected');
                menuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }
        }
    }
  
    // Handle logo container
    if (leftLogoContainer) {
        leftLogoContainer.classList[project === 'home' ? 'add' : 'remove']('selected');
        leftLogoContainer.style.backgroundColor = project === 'home' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';
    }

    // Add or remove home-content class based on the project
    mainContent.classList.toggle('home-content', project === 'home');

    // Set the current page attribute
    mainContent.setAttribute('data-page', project);

    fetch(`content/${project}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Project not found');
            }
            return response.text();
        })
        .then(data => {
            mainContent.innerHTML = data;
            
            if (project === 'moodring') {
                // Load moodring.js with cache busting
                const script = document.createElement('script');
                script.src = '/content/moodring.js?v=' + Date.now();
                document.body.appendChild(script);
            }
            
            if (project === 'photo') {
                console.log('Photo section loaded');
                const photoGrid = document.getElementById('photo-grid');
                console.log('Photo grid:', photoGrid);
                loadPhotoContent();
            }
        })
        .catch(error => {
            mainContent.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Set initial background colors for all menu items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    });

    // Set initial background colors for all dropdown links
    const allDropdownLinks = document.querySelectorAll('.dropdown-link');
    allDropdownLinks.forEach(link => {
        link.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    });

    // Set initial background color for logo container
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    }

    // Set initial selected state based on URL or default to home
    const path = window.location.hash.slice(1) || 'home';
    
    // Update active states based on current path
    const activeLink = document.querySelector(`[onclick="loadContent('${path}')"]`);
    if (activeLink) {
        if (activeLink.classList.contains('dropdown-link')) {
            activeLink.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            const projectsMenuItem = document.querySelector('.has-dropdown');
            if (projectsMenuItem) {
                projectsMenuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            }
        } else {
            const menuItem = activeLink.closest('.menu-item');
            if (menuItem) {
                menuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            }
        }
    }

    // Update logo container if on home page
    if (path === 'home' && logoContainer) {
        logoContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    }

    const projectsMenuItem = document.querySelector('.has-dropdown');
    
    projectsMenuItem.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        // Toggle dropdown only when clicking the Projects menu item
        dropdownMenu.classList.toggle('show');
        this.classList.toggle('open');
        
        // Only change background color when toggling closed
        if (!dropdownMenu.classList.contains('show')) {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            // Clear active state of dropdown links when closing
            const dropdownLinks = document.querySelectorAll('.dropdown-link');
            dropdownLinks.forEach(link => link.classList.remove('active'));
        } else {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        }
    });

    updateContentMargin(); // Initial update
});

// Function to update content margin
function updateContentMargin() {
  const logoContainer = document.querySelector('.logo-container');
  const contentDiv = document.getElementById('content');
  
  if (logoContainer && contentDiv) {
    const logoRect = logoContainer.getBoundingClientRect();
    contentDiv.style.marginTop = `${logoRect.height}px`;
    contentDiv.style.height = `calc(100vh - ${logoRect.height}px)`;
  }
}

// Add resize listener
window.addEventListener('resize', updateContentMargin);