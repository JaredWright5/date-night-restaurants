// Restaurant Data (loaded from JSON)
let restaurants = [];
let filteredRestaurants = [];
let currentPage = 1;
const restaurantsPerPage = 6;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cuisineFilter = document.getElementById('cuisineFilter');
const priceFilter = document.getElementById('priceFilter');
const ratingFilter = document.getElementById('ratingFilter');
const restaurantsGrid = document.getElementById('restaurantsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const restaurantModal = document.getElementById('restaurantModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadRestaurantData();
    displayRestaurants();
    setupEventListeners();
});

// Load restaurant data from JSON file
async function loadRestaurantData() {
    try {
        const response = await fetch('la_date_night_restaurants.json');
        restaurants = await response.json();
        filteredRestaurants = [...restaurants];
        console.log(`Loaded ${restaurants.length} restaurants`);
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        // Fallback data if JSON fails to load
        restaurants = getFallbackData();
        filteredRestaurants = [...restaurants];
    }
}

// Fallback data in case JSON fails to load
function getFallbackData() {
    return [
        {
            "name": "The Bazaar by José Andrés",
            "address": "465 S La Cienega Blvd, Los Angeles, CA 90048",
            "phone": "(310) 246-5555",
            "website": "https://www.thebazaar.com",
            "rating": 4.5,
            "price_level": 4,
            "cuisine_types": ["fine_dining", "spanish_restaurant", "tapas"],
            "opening_hours": {
                "Monday": "5:30 PM – 10:00 PM",
                "Tuesday": "5:30 PM – 10:00 PM",
                "Wednesday": "5:30 PM – 10:00 PM",
                "Thursday": "5:30 PM – 10:00 PM",
                "Friday": "5:30 PM – 11:00 PM",
                "Saturday": "5:30 PM – 11:00 PM",
                "Sunday": "5:30 PM – 10:00 PM"
            },
            "reviews": [
                {
                    "author": "Sarah M.",
                    "rating": 5,
                    "text": "Perfect for a romantic dinner! The ambiance was incredible and the food was outstanding.",
                    "time": 1640995200
                }
            ],
            "photos": [
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
            ],
            "place_id": "ChIJd8BlQ2BZwokRAFQEcDlJRAI",
            "latitude": 34.0736,
            "longitude": -118.4004,
            "date_night_score": 95.0
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Filter functionality
    cuisineFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    
    // Load more functionality
    loadMoreBtn.addEventListener('click', loadMoreRestaurants);
    
    // Modal functionality
    closeModal.addEventListener('click', closeRestaurantModal);
    window.addEventListener('click', function(e) {
        if (e.target === restaurantModal) {
            closeRestaurantModal();
        }
    });
    
    // Smooth scrolling for navigation
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
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredRestaurants = [...restaurants];
    } else {
        filteredRestaurants = restaurants.filter(restaurant => {
            return restaurant.name.toLowerCase().includes(searchTerm) ||
                   restaurant.address.toLowerCase().includes(searchTerm) ||
                   restaurant.cuisine_types.some(cuisine => 
                       cuisine.toLowerCase().includes(searchTerm)
                   );
        });
    }
    
    currentPage = 1;
    displayRestaurants();
}

// Apply filters
function applyFilters() {
    const cuisineFilterValue = cuisineFilter.value;
    const priceFilterValue = priceFilter.value;
    const ratingFilterValue = ratingFilter.value;
    
    filteredRestaurants = restaurants.filter(restaurant => {
        // Cuisine filter
        if (cuisineFilterValue && !restaurant.cuisine_types.includes(cuisineFilterValue)) {
            return false;
        }
        
        // Price filter
        if (priceFilterValue && restaurant.price_level !== parseInt(priceFilterValue)) {
            return false;
        }
        
        // Rating filter
        if (ratingFilterValue && restaurant.rating < parseFloat(ratingFilterValue)) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    displayRestaurants();
}

// Display restaurants
function displayRestaurants() {
    const startIndex = 0;
    const endIndex = currentPage * restaurantsPerPage;
    const restaurantsToShow = filteredRestaurants.slice(startIndex, endIndex);
    
    restaurantsGrid.innerHTML = '';
    
    if (restaurantsToShow.length === 0) {
        restaurantsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3>No restaurants found</h3>
                <p>Try adjusting your search criteria or filters.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    restaurantsToShow.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantsGrid.appendChild(restaurantCard);
    });
    
    // Show/hide load more button
    if (endIndex >= filteredRestaurants.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create restaurant card element
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.addEventListener('click', () => openRestaurantModal(restaurant));
    
    const priceSymbols = '$'.repeat(restaurant.price_level);
    const stars = '★'.repeat(Math.floor(restaurant.rating));
    
    card.innerHTML = `
        <img src="${restaurant.photos[0] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'}" 
             alt="${restaurant.name}" class="restaurant-image">
        <div class="restaurant-content">
            <div class="restaurant-header">
                <div>
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-rating">
                        <span class="stars">${stars}</span>
                        <span>${restaurant.rating}</span>
                    </div>
                </div>
            </div>
            <p class="restaurant-cuisine">${restaurant.cuisine_types.join(', ')}</p>
            <p class="restaurant-address">${restaurant.address}</p>
            <div class="restaurant-price">${priceSymbols}</div>
            <div class="restaurant-score">
                <div class="date-night-score">
                    <i class="fas fa-heart"></i>
                    <span>Date Night Score:</span>
                    <span class="score-value">${restaurant.date_night_score}</span>
                </div>
                <div class="restaurant-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); openRestaurantModal('${restaurant.name}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <a href="${restaurant.website}" target="_blank" class="btn btn-secondary" onclick="event.stopPropagation()">
                        <i class="fas fa-external-link-alt"></i> Website
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Load more restaurants
function loadMoreRestaurants() {
    currentPage++;
    const startIndex = 0;
    const endIndex = currentPage * restaurantsPerPage;
    const restaurantsToShow = filteredRestaurants.slice(startIndex, endIndex);
    
    restaurantsToShow.forEach((restaurant, index) => {
        if (index >= (currentPage - 1) * restaurantsPerPage) {
            const restaurantCard = createRestaurantCard(restaurant);
            restaurantsGrid.appendChild(restaurantCard);
        }
    });
    
    // Show/hide load more button
    if (endIndex >= filteredRestaurants.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// Open restaurant modal
function openRestaurantModal(restaurantName) {
    const restaurant = restaurants.find(r => r.name === restaurantName);
    if (!restaurant) return;
    
    const priceSymbols = '$'.repeat(restaurant.price_level);
    const stars = '★'.repeat(Math.floor(restaurant.rating));
    
    modalContent.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <img src="${restaurant.photos[0] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'}" 
                         alt="${restaurant.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px;">
                </div>
                <div>
                    <h2 style="margin-bottom: 1rem; color: #333;">${restaurant.name}</h2>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 20px;">
                            <span style="color: #ffc107;">${stars}</span>
                            <span>${restaurant.rating}</span>
                        </div>
                        <div style="background: #d63384; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500;">
                            ${priceSymbols}
                        </div>
                        <div style="background: linear-gradient(45deg, #d63384, #ff6b6b); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500;">
                            Date Score: ${restaurant.date_night_score}
                        </div>
                    </div>
                    <p style="color: #666; margin-bottom: 1rem;"><strong>Cuisine:</strong> ${restaurant.cuisine_types.join(', ')}</p>
                    <p style="color: #666; margin-bottom: 1rem;"><strong>Address:</strong> ${restaurant.address}</p>
                    <p style="color: #666; margin-bottom: 1rem;"><strong>Phone:</strong> ${restaurant.phone}</p>
                    <a href="${restaurant.website}" target="_blank" style="display: inline-block; background: #d63384; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 25px; font-weight: 500; margin-top: 1rem;">
                        <i class="fas fa-external-link-alt"></i> Visit Website
                    </a>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: #333;">Opening Hours</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    ${Object.entries(restaurant.opening_hours).map(([day, hours]) => `
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8f9fa; border-radius: 5px;">
                            <strong>${day}</strong>
                            <span>${hours}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h3 style="margin-bottom: 1rem; color: #333;">Customer Reviews</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${restaurant.reviews.map(review => `
                        <div style="border: 1px solid #eee; border-radius: 10px; padding: 1rem; margin-bottom: 1rem; background: #f8f9fa;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong>${review.author}</strong>
                                <div style="color: #ffc107;">${'★'.repeat(review.rating)}</div>
                            </div>
                            <p style="color: #666; line-height: 1.5;">${review.text}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    restaurantModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close restaurant modal
function closeRestaurantModal() {
    restaurantModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Utility function to format addresses
function formatAddress(address) {
    return address.replace(/,/g, ', ');
}

// Add loading state
function showLoading() {
    restaurantsGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// Add error handling
function showError(message) {
    restaurantsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <h3 style="color: #d63384;">Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Reload Page</button>
        </div>
    `;
}

// Initialize search with URL parameters
function initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const cuisine = urlParams.get('cuisine');
    const price = urlParams.get('price');
    const rating = urlParams.get('rating');
    
    if (search) {
        searchInput.value = search;
        handleSearch();
    }
    
    if (cuisine) {
        cuisineFilter.value = cuisine;
    }
    
    if (price) {
        priceFilter.value = price;
    }
    
    if (rating) {
        ratingFilter.value = rating;
    }
    
    if (search || cuisine || price || rating) {
        applyFilters();
    }
}

// Call initialization from URL when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeFromURL, 100);
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && restaurantModal.style.display === 'block') {
        closeRestaurantModal();
    }
});

// Add analytics tracking (placeholder for future implementation)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log(`Event: ${eventName}`, eventData);
}

// Track search events
searchBtn.addEventListener('click', function() {
    trackEvent('search', {
        query: searchInput.value,
        results: filteredRestaurants.length
    });
});

// Track filter events
[cuisineFilter, priceFilter, ratingFilter].forEach(filter => {
    filter.addEventListener('change', function() {
        trackEvent('filter', {
            filterType: filter.id,
            filterValue: filter.value
        });
    });
});

// Track restaurant clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.restaurant-card')) {
        const restaurantName = e.target.closest('.restaurant-card').querySelector('.restaurant-name').textContent;
        trackEvent('restaurant_click', {
            restaurantName: restaurantName
        });
    }
});
