#!/usr/bin/env python3
"""
Page Generator for LA Date Night Restaurant Directory
Generates individual restaurant pages for better SEO
"""

import json
import os
import re
from urllib.parse import quote

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def generate_stars(rating):
    """Generate star HTML for rating"""
    full_stars = int(rating)
    half_star = 1 if rating - full_stars >= 0.5 else 0
    empty_stars = 5 - full_stars - half_star
    
    stars = '★' * full_stars
    if half_star:
        stars += '☆'
    stars += '☆' * empty_stars
    
    return stars

def generate_price_symbols(price_level):
    """Generate price symbols"""
    return '$' * price_level

def generate_opening_hours_html(opening_hours):
    """Generate opening hours HTML"""
    if not opening_hours:
        return "<p>Hours not available</p>"
    
    html = '<div class="hours-list">'
    for day, hours in opening_hours.items():
        html += f'''
        <div class="hours-item">
            <span class="day">{day}</span>
            <span class="hours">{hours}</span>
        </div>
        '''
    html += '</div>'
    return html

def generate_reviews_html(reviews):
    """Generate reviews HTML"""
    if not reviews:
        return "<p>No reviews available</p>"
    
    html = '<div class="reviews-list">'
    for review in reviews[:5]:  # Show top 5 reviews
        stars = '★' * review.get('rating', 0)
        html += f'''
        <div class="review-item">
            <div class="review-header">
                <strong>{review.get('author', 'Anonymous')}</strong>
                <div class="review-rating">{stars}</div>
            </div>
            <p class="review-text">"{review.get('text', '')}"</p>
        </div>
        '''
    html += '</div>'
    return html

def generate_photos_html(photos):
    """Generate photos HTML"""
    if not photos:
        return "<p>No photos available</p>"
    
    html = '<div class="photos-grid">'
    for photo in photos[:6]:  # Show up to 6 photos
        html += f'<img src="{photo}" alt="Restaurant photo" class="photo-item">'
    html += '</div>'
    return html

def extract_area_from_address(address):
    """Extract area from address"""
    areas = ['Beverly Hills', 'West Hollywood', 'Santa Monica', 'Venice', 
             'Los Angeles', 'Hollywood', 'Silver Lake', 'Los Feliz', 
             'Pasadena', 'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach']
    
    for area in areas:
        if area in address:
            return area
    return 'Los Angeles'

def generate_restaurant_page(restaurant):
    """Generate individual restaurant page"""
    
    # Extract data
    name = restaurant.get('name', '')
    address = restaurant.get('address', '')
    phone = restaurant.get('phone', '')
    website = restaurant.get('website', '')
    rating = restaurant.get('rating', 0)
    price_level = restaurant.get('price_level', 0)
    cuisine_types = restaurant.get('cuisine_types', [])
    opening_hours = restaurant.get('opening_hours', {})
    reviews = restaurant.get('reviews', [])
    photos = restaurant.get('photos', [])
    date_night_score = restaurant.get('date_night_score', 0)
    latitude = restaurant.get('latitude', 0)
    longitude = restaurant.get('longitude', 0)
    
    # Generate derived data
    slug = slugify(name)
    area = extract_area_from_address(address)
    stars = generate_stars(rating)
    price_symbols = generate_price_symbols(price_level)
    cuisine_types_str = ', '.join(cuisine_types)
    
    # Generate HTML content
    opening_hours_html = generate_opening_hours_html(opening_hours)
    reviews_html = generate_reviews_html(reviews)
    photos_html = generate_photos_html(photos)
    
    # Create description
    description = f"{name} in {area} offers {cuisine_types_str} cuisine perfect for romantic date nights. Rated {rating}/5 stars with {price_symbols} pricing."
    
    # Create URL
    restaurant_url = f"https://ladatenightrestaurants.com/restaurants/{slug}/"
    
    # Extract ZIP code
    zip_match = re.search(r'CA (\d{5})', address)
    zip_code = zip_match.group(1) if zip_match else '90210'
    
    # Generate opening hours for structured data
    opening_hours_structured = []
    for day, hours in opening_hours.items():
        if hours and hours != 'Closed':
            # Convert day names to schema.org format
            day_map = {
                'Monday': 'Mo', 'Tuesday': 'Tu', 'Wednesday': 'We',
                'Thursday': 'Th', 'Friday': 'Fr', 'Saturday': 'Sa', 'Sunday': 'Su'
            }
            if day in day_map:
                opening_hours_structured.append(f"{day_map[day]} {hours}")
    
    # Read template
    with open('restaurant-template.html', 'r') as f:
        template = f.read()
    
    # Replace placeholders
    replacements = {
        '{{RESTAURANT_NAME}}': name,
        '{{RESTAURANT_DESCRIPTION}}': description,
        '{{AREA}}': area,
        '{{RATING}}': str(rating),
        '{{PRICE_LEVEL}}': price_symbols,
        '{{CUISINE_TYPES}}': cuisine_types_str,
        '{{RESTAURANT_URL}}': restaurant_url,
        '{{RESTAURANT_IMAGE}}': photos[0] if photos else 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        '{{RESTAURANT_PHONE}}': phone,
        '{{RESTAURANT_ADDRESS}}': address,
        '{{RESTAURANT_WEBSITE}}': website,
        '{{LATITUDE}}': str(latitude),
        '{{LONGITUDE}}': str(longitude),
        '{{ZIP_CODE}}': zip_code,
        '{{REVIEW_COUNT}}': str(len(reviews)),
        '{{PRICE_RANGE}}': price_symbols,
        '{{OPENING_HOURS}}': '; '.join(opening_hours_structured),
        '{{STARS}}': stars,
        '{{PRICE_SYMBOLS}}': price_symbols,
        '{{DATE_SCORE}}': str(date_night_score),
        '{{OPENING_HOURS_HTML}}': opening_hours_html,
        '{{REVIEWS_HTML}}': reviews_html,
        '{{PHOTOS_HTML}}': photos_html
    }
    
    # Apply replacements
    for placeholder, value in replacements.items():
        template = template.replace(placeholder, value)
    
    return template, slug

def main():
    """Generate all restaurant pages"""
    print("🍽️ Generating restaurant pages...")
    
    # Load restaurant data
    try:
        with open('la_date_night_restaurants.json', 'r') as f:
            restaurants = json.load(f)
    except FileNotFoundError:
        print("❌ Restaurant data file not found")
        return
    
    # Create restaurants directory
    os.makedirs('restaurants', exist_ok=True)
    
    # Generate pages
    generated_pages = []
    for restaurant in restaurants:
        try:
            page_content, slug = generate_restaurant_page(restaurant)
            
            # Save page
            filename = f"restaurants/{slug}.html"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(page_content)
            
            generated_pages.append({
                'name': restaurant.get('name', ''),
                'slug': slug,
                'filename': filename,
                'url': f"https://ladatenightrestaurants.com/{filename}"
            })
            
            print(f"✅ Generated page for {restaurant.get('name', 'Unknown')}")
            
        except Exception as e:
            print(f"❌ Error generating page for {restaurant.get('name', 'Unknown')}: {e}")
    
    # Generate index page for restaurants
    generate_restaurants_index(generated_pages)
    
    print(f"\n🎉 Generated {len(generated_pages)} restaurant pages!")
    print("📁 Pages saved in 'restaurants/' directory")

def generate_restaurants_index(restaurants):
    """Generate restaurants index page"""
    index_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Date Night Restaurants | LA Date Night</title>
    <meta name="description" content="Complete list of all date night restaurants in Los Angeles. Browse our curated collection of romantic dining spots.">
    <link rel="stylesheet" href="../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="../index.html"><h1><i class="fas fa-heart"></i> LA Date Night</h1></a>
                </div>
                <ul class="nav-menu">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../index.html#restaurants">Restaurants</a></li>
                    <li><a href="../index.html#about">About</a></li>
                    <li><a href="../index.html#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <section class="restaurants">
        <div class="container">
            <div class="section-header">
                <h1>All Date Night Restaurants</h1>
                <p>Complete list of romantic dining spots in Los Angeles</p>
            </div>
            
            <div class="restaurants-grid">'''
    
    for restaurant in restaurants:
        index_content += f'''
                <div class="restaurant-card">
                    <a href="{restaurant['filename']}" style="text-decoration: none; color: inherit;">
                        <h3>{restaurant['name']}</h3>
                        <p>View details and reviews</p>
                    </a>
                </div>'''
    
    index_content += '''
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>LA Date Night</h3>
                    <p>Your guide to the most romantic restaurants in Los Angeles.</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 LA Date Night Restaurants. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>'''
    
    with open('restaurants/index.html', 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print("✅ Generated restaurants index page")

if __name__ == "__main__":
    main()
