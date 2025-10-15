#!/usr/bin/env python3
"""
Update restaurant images with reliable Unsplash URLs
"""

import json
import random

# Reliable Unsplash image URLs for different cuisine types
CUISINE_IMAGES = {
    'fine_dining': [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'italian_restaurant': [
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'french_restaurant': [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'japanese_restaurant': [
        'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'seafood_restaurant': [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'contemporary': [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'wine_bar': [
        'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'rooftop_restaurant': [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'steakhouse': [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'mexican_restaurant': [
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ],
    'thai_restaurant': [
        'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
    ]
}

# Default fallback images
DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&ixlib=rb-4.0.3'
]

def get_images_for_restaurant(restaurant):
    """Get appropriate images for a restaurant based on its cuisine types"""
    images = []
    
    # Try to find matching cuisine images
    for cuisine in restaurant.get('cuisine_types', []):
        if cuisine in CUISINE_IMAGES:
            images.extend(CUISINE_IMAGES[cuisine])
    
    # If no cuisine-specific images found, use defaults
    if not images:
        images = DEFAULT_IMAGES.copy()
    
    # Return 3-5 random images
    return random.sample(images, min(len(images), random.randint(3, 5)))

def update_restaurant_images():
    """Update restaurant images with reliable URLs"""
    print("🖼️  Updating restaurant images...")
    
    # Load existing data
    with open('la_date_night_restaurants.json', 'r') as f:
        restaurants = json.load(f)
    
    # Update each restaurant's photos
    for restaurant in restaurants:
        restaurant['photos'] = get_images_for_restaurant(restaurant)
    
    # Save updated data
    with open('la_date_night_restaurants.json', 'w') as f:
        json.dump(restaurants, f, indent=2)
    
    print(f"✅ Updated images for {len(restaurants)} restaurants")
    print("📁 Saved to la_date_night_restaurants.json")

if __name__ == "__main__":
    update_restaurant_images()
