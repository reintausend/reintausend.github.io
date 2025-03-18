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

            // Add this new block for music page
            if (project === 'music') {
                initMusicFilters();
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
        e.stopPropagation(); // Prevent event from bubbling up
        const dropdownMenu = document.querySelector('.dropdown-menu');
        const isMobile = window.innerWidth <= 768;
        
        // Toggle dropdown
        dropdownMenu.classList.toggle('show');
        this.classList.toggle('open');
        
        // Update background color
        this.style.backgroundColor = dropdownMenu.classList.contains('show') 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(255, 255, 255, 0.6)';
        
        // Handle dropdown links
        const dropdownLinks = document.querySelectorAll('.dropdown-link');
        if (!dropdownMenu.classList.contains('show')) {
            dropdownLinks.forEach(link => link.classList.remove('active'));
        }
    });

    updateContentMargin(); // Initial update

    // Set logo as selected by default
    document.querySelector('#sidebar .logo-container').classList.add('selected');

    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('#sidebar');
    const sidebarRight = document.querySelector('#sidebar-right');
    const content = document.querySelector('#content');
    let isMenuOpen = false;

    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
        
        if (isMenuOpen) {
            content.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            
            // Make sure dropdown is visible if it was open
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (document.querySelector('.has-dropdown').classList.contains('open')) {
                dropdownMenu.classList.add('show');
            }
        } else {
            content.classList.remove('menu-open');
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            // Only close menu if it's not the Projects dropdown
            if (isMenuOpen && !link.closest('.has-dropdown')) {
                hamburger.click();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !e.target.closest('#sidebar') && 
            !e.target.closest('#sidebar-right') && 
            !e.target.closest('.hamburger-menu')) {
            // Don't close if clicking the projects dropdown
            if (!e.target.closest('.has-dropdown')) {
                hamburger.click();
            }
        }
    });

    // Add click handler for logo containers
    document.querySelectorAll('.logo-container').forEach(logo => {
        logo.addEventListener('click', () => {
            if (isMenuOpen) {
                hamburger.click();
            }
        });
    });
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

// Add this new function
function initMusicFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const trackItems = document.querySelectorAll('.track-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            trackItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-type') === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}