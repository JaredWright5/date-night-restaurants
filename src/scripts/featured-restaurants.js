// Featured restaurants management - limited to 4 restaurants
let featuredRestaurants = new Set(['providence', 'r-publique-caf-bakery-r-publique-restaurant', 'spago-beverly-hills', 'the-little-door']);

// Search and filter functionality
const searchInput = document.getElementById('search-input');
const neighborhoodFilter = document.getElementById('neighborhood-filter');
const cuisineFilter = document.getElementById('cuisine-filter');
const restaurantsGrid = document.getElementById('restaurants-grid');

function filterRestaurants() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedNeighborhood = neighborhoodFilter.value;
  const selectedCuisine = cuisineFilter.value;

  const restaurantCards = restaurantsGrid.querySelectorAll('.restaurant-card');
  
  restaurantCards.forEach(card => {
    const restaurantName = card.querySelector('h3').textContent.toLowerCase();
    const neighborhood = card.dataset.neighborhood;
    const cuisines = card.dataset.cuisines.toLowerCase();
    
    const matchesSearch = restaurantName.includes(searchTerm);
    const matchesNeighborhood = !selectedNeighborhood || neighborhood === selectedNeighborhood;
    const matchesCuisine = !selectedCuisine || cuisines.includes(selectedCuisine.toLowerCase());
    
    if (matchesSearch && matchesNeighborhood && matchesCuisine) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add event listeners
if (searchInput) searchInput.addEventListener('input', filterRestaurants);
if (neighborhoodFilter) neighborhoodFilter.addEventListener('change', filterRestaurants);
if (cuisineFilter) cuisineFilter.addEventListener('change', filterRestaurants);

// Add/Remove from featured functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-add')) {
    e.preventDefault();
    const restaurantId = e.target.dataset.restaurantId;
    
    // Check if we're at the limit of 4 restaurants
    if (featuredRestaurants.size >= 4) {
      showNotification('Maximum of 4 featured restaurants allowed. Remove one first.', 'error');
      return;
    }
    
    if (!featuredRestaurants.has(restaurantId)) {
      featuredRestaurants.add(restaurantId);
      updateButtonState(e.target, restaurantId, true);
      updateFeaturedDisplay();
      saveFeaturedRestaurants();
      showNotification('Restaurant added to featured!', 'success');
    }
  } else if (e.target.classList.contains('btn-remove')) {
    e.preventDefault();
    const restaurantId = e.target.dataset.restaurantId;
    featuredRestaurants.delete(restaurantId);
    updateButtonState(e.target, restaurantId, false);
    updateFeaturedDisplay();
    saveFeaturedRestaurants();
    showNotification('Restaurant removed from featured!', 'info');
  }
});

function updateButtonState(button, restaurantId, isFeatured) {
  if (isFeatured) {
    button.textContent = 'Remove from Featured';
    button.classList.remove('btn-add');
    button.classList.add('btn-remove');
  } else {
    button.textContent = 'Add to Featured';
    button.classList.remove('btn-remove');
    button.classList.add('btn-add');
  }
}

function updateFeaturedDisplay() {
  // Update the featured section display
  const featuredGrid = document.querySelector('#featured-grid');
  if (featuredGrid) {
    // Remove featured cards that are no longer in the set
    const featuredCards = featuredGrid.querySelectorAll('.featured-card');
    featuredCards.forEach(card => {
      const restaurantId = card.dataset.restaurantId;
      if (!featuredRestaurants.has(restaurantId)) {
        card.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          if (card.parentNode) {
            card.parentNode.removeChild(card);
          }
        }, 300);
      }
    });
    
    // Update the counter
    const counter = document.querySelector('.featured-count');
    if (counter) {
      counter.textContent = `(${featuredRestaurants.size}/4)`;
    }
    
    console.log('Featured restaurants updated:', Array.from(featuredRestaurants));
  }
}

function saveFeaturedRestaurants() {
  // Save to localStorage for persistence
  const featuredArray = Array.from(featuredRestaurants);
  localStorage.setItem('featuredRestaurants', JSON.stringify(featuredArray));
  
  // In a real application, you would also save to your database here
  // For now, we'll use localStorage as a simple persistence layer
  console.log('Featured restaurants saved:', featuredArray);
}

function loadFeaturedRestaurants() {
  // Load from localStorage
  const saved = localStorage.getItem('featuredRestaurants');
  if (saved) {
    try {
      const featuredArray = JSON.parse(saved);
      featuredRestaurants = new Set(featuredArray);
      console.log('Featured restaurants loaded:', featuredArray);
    } catch (e) {
      console.error('Error loading featured restaurants:', e);
    }
  }
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  let backgroundColor = '#17a2b8'; // default info
  if (type === 'success') backgroundColor = '#28a745';
  if (type === 'error') backgroundColor = '#dc3545';
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${backgroundColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds for error messages
  const duration = type === 'error' ? 4000 : 3000;
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// Initialize button states
document.addEventListener('DOMContentLoaded', () => {
  // Load saved featured restaurants
  loadFeaturedRestaurants();
  
  // Update all button states based on current featured restaurants
  const addButtons = document.querySelectorAll('.btn-add');
  addButtons.forEach(button => {
    const restaurantId = button.dataset.restaurantId;
    if (featuredRestaurants.has(restaurantId)) {
      updateButtonState(button, restaurantId, true);
    }
  });
  
  // Update featured display
  updateFeaturedDisplay();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
`;
document.head.appendChild(style);
