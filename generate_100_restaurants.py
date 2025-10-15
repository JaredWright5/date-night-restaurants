#!/usr/bin/env python3
"""
Generate 100 LA Date Night Restaurants with Neighborhood Organization
"""

import json
import random
from typing import List, Dict

# LA Neighborhoods with coordinates and characteristics
NEIGHBORHOODS = {
    "Beverly Hills": {
        "coordinates": {"lat": 34.0736, "lng": -118.4004},
        "characteristics": ["luxury", "fine_dining", "high_end"],
        "price_range": [3, 4],
        "cuisines": ["fine_dining", "french_restaurant", "italian_restaurant", "steak_house"]
    },
    "West Hollywood": {
        "coordinates": {"lat": 34.0900, "lng": -118.4000},
        "characteristics": ["trendy", "nightlife", "contemporary"],
        "price_range": [2, 4],
        "cuisines": ["contemporary", "japanese_restaurant", "seafood_restaurant", "rooftop_restaurant"]
    },
    "Santa Monica": {
        "coordinates": {"lat": 34.0195, "lng": -118.4912},
        "characteristics": ["beachside", "casual", "ocean_view"],
        "price_range": [2, 3],
        "cuisines": ["seafood_restaurant", "californian", "farm_to_table", "wine_bar"]
    },
    "Venice": {
        "coordinates": {"lat": 33.9850, "lng": -118.4695},
        "characteristics": ["bohemian", "artistic", "hip"],
        "price_range": [2, 3],
        "cuisines": ["californian", "farm_to_table", "wine_bar", "contemporary"]
    },
    "Downtown LA": {
        "coordinates": {"lat": 34.0522, "lng": -118.2437},
        "characteristics": ["urban", "sophisticated", "rooftop"],
        "price_range": [2, 4],
        "cuisines": ["contemporary", "rooftop_restaurant", "fine_dining", "wine_bar"]
    },
    "Hollywood": {
        "coordinates": {"lat": 34.0928, "lng": -118.3287},
        "characteristics": ["glamorous", "celebrity", "entertainment"],
        "price_range": [2, 4],
        "cuisines": ["fine_dining", "contemporary", "italian_restaurant", "steak_house"]
    },
    "Silver Lake": {
        "coordinates": {"lat": 34.0867, "lng": -118.2708},
        "characteristics": ["hip", "trendy", "creative"],
        "price_range": [2, 3],
        "cuisines": ["contemporary", "californian", "wine_bar", "farm_to_table"]
    },
    "Los Feliz": {
        "coordinates": {"lat": 34.1083, "lng": -118.2936},
        "characteristics": ["charming", "eclectic", "intimate"],
        "price_range": [2, 3],
        "cuisines": ["wine_bar", "french_restaurant", "italian_restaurant", "contemporary"]
    },
    "Manhattan Beach": {
        "coordinates": {"lat": 33.8847, "lng": -118.4109},
        "characteristics": ["beachside", "elegant", "family_friendly"],
        "price_range": [2, 3],
        "cuisines": ["seafood_restaurant", "californian", "contemporary", "wine_bar"]
    },
    "Pasadena": {
        "coordinates": {"lat": 34.1478, "lng": -118.1445},
        "characteristics": ["historic", "sophisticated", "cultural"],
        "price_range": [2, 3],
        "cuisines": ["fine_dining", "french_restaurant", "italian_restaurant", "contemporary"]
    }
}

# Restaurant name templates by cuisine
RESTAURANT_TEMPLATES = {
    "fine_dining": [
        "The {name} Room", "Bistro {name}", "{name} & Co", "Café {name}",
        "Restaurant {name}", "The {name} Table", "{name} Kitchen"
    ],
    "italian_restaurant": [
        "Trattoria {name}", "Osteria {name}", "Ristorante {name}", "Café {name}",
        "Bottega {name}", "Cucina {name}", "Tavola {name}"
    ],
    "french_restaurant": [
        "Bistro {name}", "Café {name}", "Brasserie {name}", "Restaurant {name}",
        "Le {name}", "Chez {name}", "La {name}"
    ],
    "japanese_restaurant": [
        "Sushi {name}", "{name} Sushi", "Izakaya {name}", "Restaurant {name}",
        "Kappo {name}", "Omakase {name}"
    ],
    "seafood_restaurant": [
        "The {name} Catch", "{name} Seafood", "Ocean {name}", "The {name}",
        "Catch {name}", "Sea {name}"
    ],
    "californian": [
        "The {name} Kitchen", "Farm {name}", "Table {name}", "The {name}",
        "Kitchen {name}", "Garden {name}"
    ],
    "wine_bar": [
        "The {name} Cellar", "Wine {name}", "The {name} Bar", "Vino {name}",
        "Cork {name}", "Grape {name}"
    ],
    "rooftop_restaurant": [
        "Sky {name}", "The {name} Rooftop", "Altitude {name}", "High {name}",
        "Elevated {name}", "The {name} Terrace"
    ]
}

# Name components for generating restaurant names
NAME_COMPONENTS = [
    "Rose", "Moon", "Sunset", "Sunrise", "Garden", "Rose", "Lily", "Iris",
    "Sage", "Thyme", "Basil", "Lavender", "Jasmine", "Magnolia", "Orchid",
    "Gold", "Silver", "Copper", "Bronze", "Pearl", "Diamond", "Ruby",
    "Ocean", "River", "Mountain", "Valley", "Hill", "Grove", "Meadow",
    "Vine", "Grape", "Olive", "Fig", "Plum", "Cherry", "Apple", "Pear"
]

# Sample reviews for different types of restaurants
SAMPLE_REVIEWS = [
    {"author": "Sarah M.", "rating": 5, "text": "Perfect for a romantic dinner! The ambiance was incredible and the food was outstanding.", "time": 1640995200},
    {"author": "Michael R.", "rating": 4, "text": "Great date night spot. Intimate setting with excellent service.", "time": 1640908800},
    {"author": "Jennifer L.", "rating": 5, "text": "Absolutely magical evening. The wine selection was perfect and the staff was attentive.", "time": 1640822400},
    {"author": "David K.", "rating": 4, "text": "Beautiful restaurant with amazing views. Perfect for special occasions.", "time": 1640736000},
    {"author": "Amanda S.", "rating": 5, "text": "Most romantic restaurant in LA! The lighting and atmosphere were perfect for our anniversary.", "time": 1640649600},
    {"author": "Robert T.", "rating": 4, "text": "Excellent food and service. Great for a date night or special celebration.", "time": 1640563200},
    {"author": "Lisa W.", "rating": 5, "text": "Stunning rooftop views and incredible cuisine. Highly recommend for couples.", "time": 1640476800},
    {"author": "James P.", "rating": 4, "text": "Intimate and romantic setting. The chef's tasting menu was exceptional.", "time": 1640390400},
    {"author": "Maria G.", "rating": 5, "text": "Perfect for a romantic dinner. The wine pairing was spot on and the service was impeccable.", "time": 1640304000},
    {"author": "John D.", "rating": 4, "text": "Beautiful restaurant with great atmosphere. Ideal for date night or special occasions.", "time": 1640217600}
]

def generate_restaurant_name(cuisine_type: str) -> str:
    """Generate a restaurant name based on cuisine type"""
    templates = RESTAURANT_TEMPLATES.get(cuisine_type, ["The {name}", "Restaurant {name}"])
    template = random.choice(templates)
    name_component = random.choice(NAME_COMPONENTS)
    return template.format(name=name_component)

def generate_address(neighborhood: str) -> str:
    """Generate a realistic address for a neighborhood"""
    streets = [
        "Sunset Blvd", "Melrose Ave", "Beverly Blvd", "Santa Monica Blvd", 
        "Wilshire Blvd", "La Cienega Blvd", "Canon Dr", "Rodeo Dr",
        "Abbot Kinney Blvd", "Main St", "Ocean Ave", "Broadway"
    ]
    street = random.choice(streets)
    number = random.randint(100, 9999)
    return f"{number} {street}, {neighborhood}, CA {random.randint(90000, 99999)}"

def generate_phone() -> str:
    """Generate a realistic LA phone number"""
    area_codes = ["310", "323", "213", "424", "747"]
    area_code = random.choice(area_codes)
    exchange = random.randint(200, 999)
    number = random.randint(1000, 9999)
    return f"({area_code}) {exchange}-{number}"

def generate_opening_hours() -> Dict[str, str]:
    """Generate realistic opening hours"""
    hours_templates = [
        {
            "Monday": "5:30 PM – 10:00 PM",
            "Tuesday": "5:30 PM – 10:00 PM", 
            "Wednesday": "5:30 PM – 10:00 PM",
            "Thursday": "5:30 PM – 10:00 PM",
            "Friday": "5:30 PM – 11:00 PM",
            "Saturday": "5:30 PM – 11:00 PM",
            "Sunday": "5:30 PM – 10:00 PM"
        },
        {
            "Monday": "6:00 PM – 10:00 PM",
            "Tuesday": "6:00 PM – 10:00 PM",
            "Wednesday": "6:00 PM – 10:00 PM",
            "Thursday": "6:00 PM – 10:00 PM",
            "Friday": "6:00 PM – 11:00 PM",
            "Saturday": "6:00 PM – 11:00 PM",
            "Sunday": "6:00 PM – 10:00 PM"
        },
        {
            "Monday": "Closed",
            "Tuesday": "6:00 PM – 10:00 PM",
            "Wednesday": "6:00 PM – 10:00 PM",
            "Thursday": "6:00 PM – 10:00 PM",
            "Friday": "6:00 PM – 10:00 PM",
            "Saturday": "6:00 PM – 10:00 PM",
            "Sunday": "6:00 PM – 10:00 PM"
        }
    ]
    return random.choice(hours_templates)

def generate_photos(count: int = 3) -> List[str]:
    """Generate photo URLs"""
    photo_ids = [random.randint(1000000000000, 9999999999999) for _ in range(count)]
    return [f"https://images.unsplash.com/photo-{photo_id}?w=800&h=600&fit=crop" for photo_id in photo_ids]

def calculate_date_night_score(rating: float, price_level: int, cuisine_types: List[str], reviews: List[Dict]) -> float:
    """Calculate date night score based on various factors"""
    score = 0.0
    
    # Rating factor (40% of score)
    score += (rating / 5.0) * 40
    
    # Price level factor (20% of score)
    if price_level >= 3:
        score += 20
    elif price_level == 2:
        score += 15
    elif price_level == 1:
        score += 10
    
    # Review sentiment (20% of score)
    romantic_keywords = ['romantic', 'intimate', 'cozy', 'date', 'couple', 'anniversary', 'special']
    romantic_mentions = sum(1 for review in reviews for keyword in romantic_keywords if keyword in review.get('text', '').lower())
    
    if romantic_mentions > 0:
        score += min(20, (romantic_mentions / len(reviews)) * 20)
    
    # Cuisine type factor (20% of score)
    romantic_cuisines = ['fine_dining', 'italian_restaurant', 'french_restaurant', 'wine_bar']
    for cuisine in cuisine_types:
        if cuisine in romantic_cuisines:
            score += 5
    
    return min(100, score)

def generate_100_restaurants() -> List[Dict]:
    """Generate 100 restaurants with proper neighborhood organization"""
    restaurants = []
    
    # Keep the original 10 restaurants
    with open('la_date_night_restaurants.json', 'r') as f:
        original_restaurants = json.load(f)
    
    restaurants.extend(original_restaurants)
    
    # Generate 90 more restaurants
    for i in range(90):
        # Select neighborhood
        neighborhood = random.choice(list(NEIGHBORHOODS.keys()))
        neighborhood_data = NEIGHBORHOODS[neighborhood]
        
        # Select cuisine based on neighborhood characteristics
        cuisine_type = random.choice(neighborhood_data["cuisines"])
        
        # Generate restaurant data
        name = generate_restaurant_name(cuisine_type)
        rating = round(random.uniform(3.5, 4.8), 1)
        price_level = random.choice(neighborhood_data["price_range"])
        
        # Generate coordinates with neighborhood variation
        base_coords = neighborhood_data["coordinates"]
        lat = base_coords["lat"] + random.uniform(-0.05, 0.05)
        lng = base_coords["lng"] + random.uniform(-0.05, 0.05)
        
        # Generate reviews
        num_reviews = random.randint(3, 8)
        reviews = random.sample(SAMPLE_REVIEWS, min(num_reviews, len(SAMPLE_REVIEWS)))
        
        # Generate photos
        photos = generate_photos(random.randint(2, 5))
        
        # Calculate date night score
        date_night_score = calculate_date_night_score(rating, price_level, [cuisine_type], reviews)
        
        restaurant = {
            "name": name,
            "address": generate_address(neighborhood),
            "phone": generate_phone(),
            "website": f"https://www.{name.lower().replace(' ', '').replace('&', 'and')}.com",
            "rating": rating,
            "price_level": price_level,
            "cuisine_types": [cuisine_type],
            "opening_hours": generate_opening_hours(),
            "reviews": reviews,
            "photos": photos,
            "place_id": f"ChIJ{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', k=27))}",
            "latitude": lat,
            "longitude": lng,
            "date_night_score": round(date_night_score, 1)
        }
        
        restaurants.append(restaurant)
    
    # Sort by date night score
    restaurants.sort(key=lambda x: x["date_night_score"], reverse=True)
    
    return restaurants

def main():
    """Generate and save 100 restaurants"""
    print("🍽️ Generating 100 LA Date Night Restaurants...")
    
    restaurants = generate_100_restaurants()
    
    # Save to JSON
    with open('la_date_night_restaurants_100.json', 'w', encoding='utf-8') as f:
        json.dump(restaurants, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated {len(restaurants)} restaurants")
    print(f"📁 Saved to la_date_night_restaurants_100.json")
    
    # Print neighborhood distribution
    neighborhoods = {}
    for restaurant in restaurants:
        # Extract neighborhood from address
        address = restaurant["address"]
        for neighborhood in NEIGHBORHOODS.keys():
            if neighborhood in address:
                neighborhoods[neighborhood] = neighborhoods.get(neighborhood, 0) + 1
                break
    
    print("\n🏙️ Neighborhood Distribution:")
    for neighborhood, count in sorted(neighborhoods.items()):
        print(f"  {neighborhood}: {count} restaurants")
    
    print(f"\n🎯 Top 5 Restaurants by Date Night Score:")
    for i, restaurant in enumerate(restaurants[:5], 1):
        print(f"  {i}. {restaurant['name']} - Score: {restaurant['date_night_score']}")

if __name__ == "__main__":
    main()
