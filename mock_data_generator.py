#!/usr/bin/env python3
"""
Mock Data Generator for LA Date Night Restaurant Directory
Generates realistic restaurant data for development and testing
"""

import json
import random
from typing import List, Dict
from datetime import datetime

class MockRestaurantDataGenerator:
    """Generates realistic mock data for LA date night restaurants"""
    
    def __init__(self):
        # Real LA date night restaurants with authentic data
        self.restaurants_data = [
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
                "latitude": 34.0736,
                "longitude": -118.4004,
                "date_night_score": 95.0
            },
            {
                "name": "Nobu Los Angeles",
                "address": "903 N La Cienega Blvd, West Hollywood, CA 90069",
                "phone": "(310) 657-0400",
                "website": "https://www.noburestaurants.com",
                "rating": 4.4,
                "price_level": 4,
                "cuisine_types": ["japanese_restaurant", "sushi", "fine_dining"],
                "opening_hours": {
                    "Monday": "6:00 PM – 10:00 PM",
                    "Tuesday": "6:00 PM – 10:00 PM",
                    "Wednesday": "6:00 PM – 10:00 PM", 
                    "Thursday": "6:00 PM – 10:00 PM",
                    "Friday": "6:00 PM – 11:00 PM",
                    "Saturday": "6:00 PM – 11:00 PM",
                    "Sunday": "6:00 PM – 10:00 PM"
                },
                "latitude": 34.0900,
                "longitude": -118.4000,
                "date_night_score": 92.0
            },
            {
                "name": "Spago Beverly Hills",
                "address": "176 N Canon Dr, Beverly Hills, CA 90210",
                "phone": "(310) 385-0880",
                "website": "https://www.wolfgangpuck.com",
                "rating": 4.3,
                "price_level": 4,
                "cuisine_types": ["fine_dining", "californian", "contemporary"],
                "opening_hours": {
                    "Monday": "5:30 PM – 10:00 PM",
                    "Tuesday": "5:30 PM – 10:00 PM",
                    "Wednesday": "5:30 PM – 10:00 PM",
                    "Thursday": "5:30 PM – 10:00 PM", 
                    "Friday": "5:30 PM – 11:00 PM",
                    "Saturday": "5:30 PM – 11:00 PM",
                    "Sunday": "5:30 PM – 10:00 PM"
                },
                "latitude": 34.0736,
                "longitude": -118.4004,
                "date_night_score": 90.0
            },
            {
                "name": "Catch LA",
                "address": "8715 Melrose Ave, West Hollywood, CA 90069",
                "phone": "(323) 347-6060",
                "website": "https://www.catchrestaurants.com",
                "rating": 4.2,
                "price_level": 4,
                "cuisine_types": ["seafood_restaurant", "contemporary", "rooftop_restaurant"],
                "opening_hours": {
                    "Monday": "5:00 PM – 11:00 PM",
                    "Tuesday": "5:00 PM – 11:00 PM",
                    "Wednesday": "5:00 PM – 11:00 PM",
                    "Thursday": "5:00 PM – 11:00 PM",
                    "Friday": "5:00 PM – 12:00 AM",
                    "Saturday": "5:00 PM – 12:00 AM", 
                    "Sunday": "5:00 PM – 11:00 PM"
                },
                "latitude": 34.0836,
                "longitude": -118.3736,
                "date_night_score": 88.0
            },
            {
                "name": "Providence",
                "address": "5955 Melrose Ave, Los Angeles, CA 90038",
                "phone": "(323) 460-4170",
                "website": "https://www.providencela.com",
                "rating": 4.6,
                "price_level": 4,
                "cuisine_types": ["fine_dining", "seafood_restaurant", "contemporary"],
                "opening_hours": {
                    "Monday": "Closed",
                    "Tuesday": "6:00 PM – 10:00 PM",
                    "Wednesday": "6:00 PM – 10:00 PM",
                    "Thursday": "6:00 PM – 10:00 PM",
                    "Friday": "6:00 PM – 10:00 PM",
                    "Saturday": "6:00 PM – 10:00 PM",
                    "Sunday": "6:00 PM – 10:00 PM"
                },
                "latitude": 34.0836,
                "longitude": -118.3236,
                "date_night_score": 94.0
            }
        ]
        
        # Additional restaurant templates for generating more data
        self.restaurant_templates = [
            {
                "name": "Bottega Louie",
                "address": "700 S Grand Ave, Los Angeles, CA 90017",
                "phone": "(213) 802-1470",
                "website": "https://www.bottegalouie.com",
                "rating": 4.1,
                "price_level": 3,
                "cuisine_types": ["italian_restaurant", "bakery", "wine_bar"],
                "date_night_score": 85.0
            },
            {
                "name": "The Little Door",
                "address": "8164 W 3rd St, Los Angeles, CA 90048",
                "phone": "(323) 951-1210",
                "website": "https://www.thelittledoor.com",
                "rating": 4.3,
                "price_level": 3,
                "cuisine_types": ["french_restaurant", "wine_bar", "romantic"],
                "date_night_score": 89.0
            },
            {
                "name": "Gjelina",
                "address": "1429 Abbot Kinney Blvd, Venice, CA 90291",
                "phone": "(310) 450-1429",
                "website": "https://www.gjelina.com",
                "rating": 4.2,
                "price_level": 3,
                "cuisine_types": ["californian", "farm_to_table", "wine_bar"],
                "date_night_score": 87.0
            },
            {
                "name": "Republique",
                "address": "624 S La Brea Ave, Los Angeles, CA 90036",
                "phone": "(310) 362-6115",
                "website": "https://www.republiquela.com",
                "rating": 4.4,
                "price_level": 3,
                "cuisine_types": ["french_restaurant", "bakery", "brunch"],
                "date_night_score": 86.0
            },
            {
                "name": "Osteria Mozza",
                "address": "6602 Melrose Ave, Los Angeles, CA 90038",
                "phone": "(323) 297-0100",
                "website": "https://www.osteriamozza.com",
                "rating": 4.3,
                "price_level": 4,
                "cuisine_types": ["italian_restaurant", "fine_dining", "wine_bar"],
                "date_night_score": 91.0
            }
        ]
        
        # LA area coordinates for realistic locations
        self.la_areas = {
            "Beverly Hills": {"lat": 34.0736, "lng": -118.4004},
            "West Hollywood": {"lat": 34.0900, "lng": -118.4000},
            "Santa Monica": {"lat": 34.0195, "lng": -118.4912},
            "Venice": {"lat": 33.9850, "lng": -118.4695},
            "Downtown LA": {"lat": 34.0522, "lng": -118.2437},
            "Hollywood": {"lat": 34.0928, "lng": -118.3287},
            "Silver Lake": {"lat": 34.0867, "lng": -118.2708},
            "Los Feliz": {"lat": 34.1083, "lng": -118.2936},
            "Pasadena": {"lat": 34.1478, "lng": -118.1445},
            "Manhattan Beach": {"lat": 33.8847, "lng": -118.4109},
            "Hermosa Beach": {"lat": 33.8622, "lng": -118.3991},
            "Redondo Beach": {"lat": 33.8492, "lng": -118.3884}
        }
        
        # Sample reviews for realistic data
        self.sample_reviews = [
            {"author": "Sarah M.", "rating": 5, "text": "Perfect for a romantic dinner! The ambiance was incredible and the food was outstanding."},
            {"author": "Michael R.", "rating": 4, "text": "Great date night spot. Intimate setting with excellent service."},
            {"author": "Jennifer L.", "rating": 5, "text": "Absolutely magical evening. The wine selection was perfect and the staff was attentive."},
            {"author": "David K.", "rating": 4, "text": "Beautiful restaurant with amazing views. Perfect for special occasions."},
            {"author": "Amanda S.", "rating": 5, "text": "Most romantic restaurant in LA! The lighting and atmosphere were perfect for our anniversary."},
            {"author": "Robert T.", "rating": 4, "text": "Excellent food and service. Great for a date night or special celebration."},
            {"author": "Lisa W.", "rating": 5, "text": "Stunning rooftop views and incredible cuisine. Highly recommend for couples."},
            {"author": "James P.", "rating": 4, "text": "Intimate and romantic setting. The chef's tasting menu was exceptional."},
            {"author": "Maria G.", "rating": 5, "text": "Perfect for a romantic dinner. The wine pairing was spot on and the service was impeccable."},
            {"author": "John D.", "rating": 4, "text": "Beautiful restaurant with great atmosphere. Ideal for date night or special occasions."}
        ]
    
    def generate_mock_reviews(self, count: int = 5) -> List[Dict]:
        """Generate mock reviews for a restaurant"""
        return random.sample(self.sample_reviews, min(count, len(self.sample_reviews)))
    
    def generate_mock_photos(self, count: int = 3) -> List[str]:
        """Generate mock photo URLs"""
        photo_urls = []
        for i in range(count):
            photo_urls.append(f"https://images.unsplash.com/photo-{random.randint(1000000000000, 9999999999999)}?w=800&h=600&fit=crop")
        return photo_urls
    
    def generate_opening_hours(self) -> Dict[str, str]:
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
    
    def generate_100_restaurants(self) -> List[Dict]:
        """Generate 100 realistic LA date night restaurants"""
        restaurants = []
        
        # Add the real restaurants first
        for restaurant in self.restaurants_data:
            restaurant["reviews"] = self.generate_mock_reviews(random.randint(3, 8))
            restaurant["photos"] = self.generate_mock_photos(random.randint(2, 5))
            restaurant["opening_hours"] = self.generate_opening_hours()
            restaurants.append(restaurant)
        
        # Generate additional restaurants using templates
        restaurant_names = [
            "The French Laundry", "Per Se", "Le Bernardin", "Eleven Madison Park",
            "Alinea", "The Inn at Little Washington", "French Laundry", "The Restaurant at Meadowood",
            "Manresa", "Quince", "Atelier Crenn", "Saison", "Benu", "The French Laundry",
            "Per Se", "Le Bernardin", "Eleven Madison Park", "Alinea", "The Inn at Little Washington",
            "French Laundry", "The Restaurant at Meadowood", "Manresa", "Quince", "Atelier Crenn",
            "Saison", "Benu", "The French Laundry", "Per Se", "Le Bernardin", "Eleven Madison Park",
            "Alinea", "The Inn at Little Washington", "French Laundry", "The Restaurant at Meadowood",
            "Manresa", "Quince", "Atelier Crenn", "Saison", "Benu", "The French Laundry",
            "Per Se", "Le Bernardin", "Eleven Madison Park", "Alinea", "The Inn at Little Washington",
            "French Laundry", "The Restaurant at Meadowood", "Manresa", "Quince", "Atelier Crenn",
            "Saison", "Benu", "The French Laundry", "Per Se", "Le Bernardin", "Eleven Madison Park",
            "Alinea", "The Inn at Little Washington", "French Laundry", "The Restaurant at Meadowood",
            "Manresa", "Quince", "Atelier Crenn", "Saison", "Benu", "The French Laundry",
            "Per Se", "Le Bernardin", "Eleven Madison Park", "Alinea", "The Inn at Little Washington",
            "French Laundry", "The Restaurant at Meadowood", "Manresa", "Quince", "Atelier Crenn",
            "Saison", "Benu", "The French Laundry", "Per Se", "Le Bernardin", "Eleven Madison Park",
            "Alinea", "The Inn at Little Washington", "French Laundry", "The Restaurant at Meadowood",
            "Manresa", "Quince", "Atelier Crenn", "Saison", "Benu", "The French Laundry",
            "Per Se", "Le Bernardin", "Eleven Madison Park", "Alinea", "The Inn at Little Washington",
            "French Laundry", "The Restaurant at Meadowood", "Manresa", "Quince", "Atelier Crenn",
            "Saison", "Benu", "The French Laundry", "Per Se", "Le Bernardin", "Eleven Madison Park",
            "Alinea", "The Inn at Little Washington", "French Laundry", "The Restaurant at Meadowood",
            "Manresa", "Quince", "Atelier Crenn", "Saison", "Benu"
        ]
        
        cuisine_types = [
            ["fine_dining", "contemporary", "romantic"],
            ["italian_restaurant", "wine_bar", "romantic"],
            ["french_restaurant", "fine_dining", "romantic"],
            ["seafood_restaurant", "contemporary", "rooftop_restaurant"],
            ["japanese_restaurant", "sushi", "fine_dining"],
            ["steak_house", "fine_dining", "wine_bar"],
            ["californian", "farm_to_table", "wine_bar"],
            ["mediterranean_restaurant", "wine_bar", "romantic"],
            ["spanish_restaurant", "tapas", "wine_bar"],
            ["american_restaurant", "contemporary", "rooftop_restaurant"]
        ]
        
        areas = list(self.la_areas.keys())
        
        # Generate 95 more restaurants
        for i in range(95):
            area = random.choice(areas)
            area_coords = self.la_areas[area]
            
            # Add some random variation to coordinates
            lat = area_coords["lat"] + random.uniform(-0.05, 0.05)
            lng = area_coords["lng"] + random.uniform(-0.05, 0.05)
            
            restaurant = {
                "name": f"{random.choice(restaurant_names)} {random.choice(['LA', 'Beverly Hills', 'West Hollywood', 'Santa Monica', 'Venice'])}",
                "address": f"{random.randint(100, 9999)} {random.choice(['Sunset Blvd', 'Melrose Ave', 'Beverly Blvd', 'Santa Monica Blvd', 'Wilshire Blvd'])}, {area}, CA {random.randint(90000, 99999)}",
                "phone": f"({random.randint(200, 999)}) {random.randint(200, 999)}-{random.randint(1000, 9999)}",
                "website": f"https://www.{random.choice(['restaurant', 'dining', 'eatery', 'bistro', 'cafe'])}{random.randint(1, 999)}.com",
                "rating": round(random.uniform(3.5, 4.8), 1),
                "price_level": random.randint(2, 4),
                "cuisine_types": random.choice(cuisine_types),
                "opening_hours": self.generate_opening_hours(),
                "reviews": self.generate_mock_reviews(random.randint(3, 10)),
                "photos": self.generate_mock_photos(random.randint(2, 5)),
                "place_id": f"ChIJ{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', k=27))}",
                "latitude": lat,
                "longitude": lng,
                "date_night_score": round(random.uniform(70, 95), 1)
            }
            
            restaurants.append(restaurant)
        
        # Sort by date night score
        restaurants.sort(key=lambda x: x["date_night_score"], reverse=True)
        
        return restaurants[:100]  # Return top 100
    
    def save_to_json(self, restaurants: List[Dict], filename: str = "la_date_night_restaurants.json"):
        """Save restaurants to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(restaurants, f, indent=2, ensure_ascii=False)
        print(f"✅ Generated {len(restaurants)} restaurants and saved to {filename}")
    
    def save_to_csv(self, restaurants: List[Dict], filename: str = "la_date_night_restaurants.csv"):
        """Save restaurants to CSV file"""
        import csv
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            if restaurants:
                writer = csv.DictWriter(f, fieldnames=[
                    'name', 'address', 'phone', 'website', 'rating', 'price_level',
                    'cuisine_types', 'latitude', 'longitude', 'date_night_score',
                    'review_count', 'photo_count'
                ])
                writer.writeheader()
                
                for restaurant in restaurants:
                    row = {
                        'name': restaurant.get('name', ''),
                        'address': restaurant.get('address', ''),
                        'phone': restaurant.get('phone', ''),
                        'website': restaurant.get('website', ''),
                        'rating': restaurant.get('rating', 0),
                        'price_level': restaurant.get('price_level', 0),
                        'cuisine_types': ', '.join(restaurant.get('cuisine_types', [])),
                        'latitude': restaurant.get('latitude', 0),
                        'longitude': restaurant.get('longitude', 0),
                        'date_night_score': restaurant.get('date_night_score', 0),
                        'review_count': len(restaurant.get('reviews', [])),
                        'photo_count': len(restaurant.get('photos', []))
                    }
                    writer.writerow(row)
        
        print(f"✅ Saved CSV data to {filename}")

def main():
    """Generate mock restaurant data"""
    print("🍽️ Generating LA Date Night Restaurant Data...")
    
    generator = MockRestaurantDataGenerator()
    restaurants = generator.generate_100_restaurants()
    
    # Save data
    generator.save_to_json(restaurants)
    generator.save_to_csv(restaurants)
    
    # Print summary
    print(f"\n=== DATA GENERATION SUMMARY ===")
    print(f"Total restaurants generated: {len(restaurants)}")
    print(f"Average rating: {sum(r.get('rating', 0) for r in restaurants) / len(restaurants):.2f}")
    print(f"Average date night score: {sum(r.get('date_night_score', 0) for r in restaurants) / len(restaurants):.2f}")
    
    # Show top 10 restaurants
    print(f"\n=== TOP 10 DATE NIGHT RESTAURANTS ===")
    for i, restaurant in enumerate(restaurants[:10], 1):
        print(f"{i:2d}. {restaurant.get('name', 'N/A')} - Score: {restaurant.get('date_night_score', 0):.1f}")
        print(f"     Rating: {restaurant.get('rating', 0)}/5 | Price: {'$' * restaurant.get('price_level', 0)}")
        print(f"     Address: {restaurant.get('address', 'N/A')}")
        print()
    
    print("✅ Mock data generation complete!")
    print("📁 Files created:")
    print("   - la_date_night_restaurants.json (complete data)")
    print("   - la_date_night_restaurants.csv (flattened data)")

if __name__ == "__main__":
    main()
