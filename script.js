function loadContent(project) {
    const mainContent = document.getElementById('main-content');
    const leftLogoContainer = document.querySelector('#sidebar .logo-container');
  
    // Clear all previously selected items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.style.backgroundColor = 'transparent';
    });
    
    // Set the clicked item's parent menu-item to white
    const selectedLink = document.querySelector(`[onclick="loadContent('${project}')"]`);
    if (selectedLink) {
        const menuItem = selectedLink.closest('.menu-item');
        if (menuItem) {
            menuItem.style.backgroundColor = '#c8c6be';
        }
        
        // If it's a dropdown link, also highlight the parent PROJECTS menu-item
        if (selectedLink.classList.contains('dropdown-link')) {
            const projectsMenuItem = document.querySelector('.has-dropdown');
            if (projectsMenuItem) {
                projectsMenuItem.style.backgroundColor = '#c8c6be';
            }
        }
    }
  
    // Handle logo container background for home page
    if (leftLogoContainer) {
      if (project === 'home') {
        leftLogoContainer.style.backgroundColor = '#c8c6be';
      } else {
        leftLogoContainer.style.backgroundColor = 'transparent';
      }
    }

    // Close dropdown menu when selecting a new item
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!selectedLink?.classList.contains('dropdown-link')) {
        dropdownMenu.classList.remove('show');
    }

    // Clear all previously selected dropdown links
    const allDropdownLinks = document.querySelectorAll('.dropdown-link');
    allDropdownLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Set the clicked dropdown link as active
    if (selectedLink && selectedLink.classList.contains('dropdown-link')) {
        selectedLink.classList.add('active');
    }

    fetch(`content/${project}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Projekt nicht gefunden');
        }
        return response.text();
      })
      .then(data => {
        mainContent.innerHTML = data;
      })
      .catch(error => {
        mainContent.innerHTML = `<p>Fehler: ${error.message}</p>`;
      });
}

document.addEventListener('DOMContentLoaded', function() {
  const projectsMenuItem = document.querySelector('.has-dropdown');
  
  projectsMenuItem.addEventListener('click', function(e) {
    e.preventDefault();
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.classList.toggle('show');
    this.classList.toggle('open');
    
    // Clear all other menu items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.style.backgroundColor = 'transparent';
    });
    
    // Set this item's background to white when dropdown is shown
    if (dropdownMenu.classList.contains('show')) {
      this.style.backgroundColor = '#c8c6be';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown') && !e.target.closest('.dropdown-menu')) {
      const dropdown = document.querySelector('.dropdown-menu');
      const projectsMenuItem = document.querySelector('.has-dropdown');
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        projectsMenuItem.classList.remove('open');
        // Only reset projects menu if no project is selected
        const selectedProject = document.querySelector('.dropdown-link.active');
        if (!selectedProject) {
          projectsMenuItem.style.backgroundColor = 'transparent';
        }
      }
    }
  });

  // Set initial selected state based on URL or default to home
  const path = window.location.hash.slice(1) || 'home';
  const leftLogoContainer = document.querySelector('#sidebar .logo-container');
  
  // Set initial selected item
  const initialSelectedLink = document.querySelector(`[onclick="loadContent('${path}')"]`);
  if (initialSelectedLink) {
      const menuItem = initialSelectedLink.closest('.menu-item');
      if (menuItem) {
          menuItem.style.backgroundColor = '#c8c6be';
      }
      // If initial page is a project, highlight the PROJECTS menu
      if (initialSelectedLink.classList.contains('dropdown-link')) {
          const projectsMenuItem = document.querySelector('.has-dropdown');
          if (projectsMenuItem) {
              projectsMenuItem.style.backgroundColor = '#c8c6be';
          }
      }
  }
  
  if (leftLogoContainer) {
      leftLogoContainer.style.backgroundColor = path === 'home' ? '#c8c6be' : 'transparent';
  }
});

// Function to update content margin
function updateContentMargin() {
  const logoContainer = document.querySelector('.logo-container');
  const contentDiv = document.getElementById('content');
  if (logoContainer && contentDiv) {
    const logoRect = logoContainer.getBoundingClientRect();
    const bottomPosition = logoRect.top + logoRect.height + window.scrollY;
    contentDiv.style.marginTop = `${bottomPosition}px`;
  }
}
k