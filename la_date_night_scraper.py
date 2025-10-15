#!/usr/bin/env python3
"""
LA Date Night Restaurant Scraper
Scrapes top date night restaurants in Los Angeles using Google Places API
and other legitimate data sources.
"""

import os
import json
import csv
import time
import requests
from typing import List, Dict, Optional
from dataclasses import dataclass
from dotenv import load_dotenv
import googlemaps
import pandas as pd

# Load environment variables
load_dotenv()

@dataclass
class Restaurant:
    """Data class for restaurant information"""
    name: str
    address: str
    phone: str
    website: str
    rating: float
    price_level: int
    cuisine_types: List[str]
    opening_hours: Dict[str, str]
    reviews: List[Dict[str, str]]
    place_id: str
    latitude: float
    longitude: float
    photos: List[str]
    date_night_score: float = 0.0

class LADateNightScraper:
    """Main scraper class for LA date night restaurants"""
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_PLACES_API_KEY')
        if not self.api_key:
            raise ValueError("Google Places API key not found. Please set GOOGLE_PLACES_API_KEY in your .env file")
        
        self.gmaps = googlemaps.Client(key=self.api_key)
        self.restaurants = []
        
        # Date night specific search terms and criteria
        self.date_night_keywords = [
            "romantic restaurant", "fine dining", "rooftop restaurant", 
            "wine bar", "intimate dining", "date night", "couples restaurant"
        ]
        
        # LA areas known for date night restaurants
        self.la_areas = [
            "Beverly Hills", "West Hollywood", "Santa Monica", "Venice", 
            "Downtown LA", "Hollywood", "Silver Lake", "Los Feliz", 
            "Pasadena", "Manhattan Beach", "Hermosa Beach", "Redondo Beach"
        ]
    
    def search_restaurants_by_area(self, area: str, keyword: str = "romantic restaurant") -> List[Dict]:
        """Search for restaurants in a specific LA area"""
        try:
            query = f"{keyword} in {area}, Los Angeles"
            places_result = self.gmaps.places(query=query, type='restaurant')
            
            restaurants = []
            for place in places_result.get('results', []):
                # Get detailed information for each place
                place_details = self.get_place_details(place['place_id'])
                if place_details:
                    restaurants.append(place_details)
                
                # Rate limit protection
                time.sleep(0.1)
            
            return restaurants
            
        except Exception as e:
            print(f"Error searching in {area}: {e}")
            return []
    
    def get_place_details(self, place_id: str) -> Optional[Dict]:
        """Get detailed information for a specific place"""
        try:
            details = self.gmaps.place(
                place_id=place_id,
                fields=['name', 'formatted_address', 'formatted_phone_number', 
                       'website', 'rating', 'price_level', 'types', 'opening_hours',
                       'reviews', 'geometry', 'photos']
            )
            
            place = details.get('result', {})
            if not place:
                return None
            
            # Extract and structure the data
            restaurant_data = {
                'name': place.get('name', ''),
                'address': place.get('formatted_address', ''),
                'phone': place.get('formatted_phone_number', ''),
                'website': place.get('website', ''),
                'rating': place.get('rating', 0.0),
                'price_level': place.get('price_level', 0),
                'cuisine_types': place.get('types', []),
                'opening_hours': self.parse_opening_hours(place.get('opening_hours', {})),
                'reviews': self.parse_reviews(place.get('reviews', [])),
                'place_id': place_id,
                'latitude': place.get('geometry', {}).get('location', {}).get('lat', 0.0),
                'longitude': place.get('geometry', {}).get('location', {}).get('lng', 0.0),
                'photos': self.get_photo_urls(place.get('photos', []))
            }
            
            return restaurant_data
            
        except Exception as e:
            print(f"Error getting details for place {place_id}: {e}")
            return None
    
    def parse_opening_hours(self, hours_data: Dict) -> Dict[str, str]:
        """Parse opening hours into a readable format"""
        if not hours_data or 'weekday_text' not in hours_data:
            return {}
        
        hours = {}
        for day_info in hours_data.get('weekday_text', []):
            if ':' in day_info:
                day, hours_str = day_info.split(':', 1)
                hours[day.strip()] = hours_str.strip()
        
        return hours
    
    def parse_reviews(self, reviews_data: List[Dict]) -> List[Dict[str, str]]:
        """Parse reviews and extract relevant information"""
        reviews = []
        for review in reviews_data[:10]:  # Limit to 10 most recent reviews
            review_info = {
                'author': review.get('author_name', ''),
                'rating': review.get('rating', 0),
                'text': review.get('text', ''),
                'time': review.get('time', 0)
            }
            reviews.append(review_info)
        
        return reviews
    
    def get_photo_urls(self, photos_data: List[Dict]) -> List[str]:
        """Get photo URLs for the restaurant"""
        photo_urls = []
        for photo in photos_data[:5]:  # Limit to 5 photos
            try:
                photo_ref = photo.get('photo_reference')
                if photo_ref:
                    # Note: In production, you'd need to use the Photos API to get actual URLs
                    photo_urls.append(f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={self.api_key}")
            except Exception as e:
                print(f"Error getting photo URL: {e}")
        
        return photo_urls
    
    def calculate_date_night_score(self, restaurant: Dict) -> float:
        """Calculate a date night score based on various factors"""
        score = 0.0
        
        # Rating factor (40% of score)
        rating = restaurant.get('rating', 0)
        score += (rating / 5.0) * 40
        
        # Price level factor (20% of score) - higher price often means more romantic
        price_level = restaurant.get('price_level', 0)
        if price_level >= 3:  # $$$ and above
            score += 20
        elif price_level == 2:  # $$
            score += 15
        elif price_level == 1:  # $
            score += 10
        
        # Review sentiment analysis (20% of score)
        reviews = restaurant.get('reviews', [])
        romantic_keywords = ['romantic', 'intimate', 'cozy', 'date', 'couple', 'anniversary', 'special']
        romantic_mentions = 0
        
        for review in reviews:
            review_text = review.get('text', '').lower()
            for keyword in romantic_keywords:
                if keyword in review_text:
                    romantic_mentions += 1
                    break
        
        if romantic_mentions > 0:
            score += min(20, (romantic_mentions / len(reviews)) * 20)
        
        # Cuisine type factor (20% of score)
        cuisine_types = restaurant.get('cuisine_types', [])
        romantic_cuisines = ['fine_dining', 'italian_restaurant', 'french_restaurant', 
                           'steak_house', 'seafood_restaurant', 'wine_bar']
        
        for cuisine in cuisine_types:
            if cuisine in romantic_cuisines:
                score += 5
        
        return min(100, score)
    
    def scrape_all_restaurants(self) -> List[Dict]:
        """Main method to scrape all date night restaurants"""
        print("Starting LA Date Night Restaurant Scraping...")
        
        all_restaurants = []
        
        for area in self.la_areas:
            print(f"Searching in {area}...")
            
            for keyword in self.date_night_keywords:
                restaurants = self.search_restaurants_by_area(area, keyword)
                all_restaurants.extend(restaurants)
                
                # Rate limiting
                time.sleep(1)
        
        # Remove duplicates based on place_id
        unique_restaurants = {}
        for restaurant in all_restaurants:
            place_id = restaurant.get('place_id')
            if place_id and place_id not in unique_restaurants:
                # Calculate date night score
                restaurant['date_night_score'] = self.calculate_date_night_score(restaurant)
                unique_restaurants[place_id] = restaurant
        
        # Sort by date night score and take top 100
        sorted_restaurants = sorted(
            unique_restaurants.values(), 
            key=lambda x: x.get('date_night_score', 0), 
            reverse=True
        )
        
        self.restaurants = sorted_restaurants[:100]
        print(f"Found {len(self.restaurants)} restaurants")
        
        return self.restaurants
    
    def save_to_json(self, filename: str = "la_date_night_restaurants.json"):
        """Save restaurants data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.restaurants, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    
    def save_to_csv(self, filename: str = "la_date_night_restaurants.csv"):
        """Save restaurants data to CSV file"""
        if not self.restaurants:
            print("No restaurants data to save")
            return
        
        # Flatten the data for CSV
        flattened_data = []
        for restaurant in self.restaurants:
            flat_restaurant = {
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
            flattened_data.append(flat_restaurant)
        
        df = pd.DataFrame(flattened_data)
        df.to_csv(filename, index=False, encoding='utf-8')
        print(f"Data saved to {filename}")

def main():
    """Main function to run the scraper"""
    try:
        scraper = LADateNightScraper()
        restaurants = scraper.scrape_all_restaurants()
        
        if restaurants:
            scraper.save_to_json()
            scraper.save_to_csv()
            
            # Print summary
            print("\n=== SCRAPING SUMMARY ===")
            print(f"Total restaurants found: {len(restaurants)}")
            print(f"Average rating: {sum(r.get('rating', 0) for r in restaurants) / len(restaurants):.2f}")
            print(f"Average date night score: {sum(r.get('date_night_score', 0) for r in restaurants) / len(restaurants):.2f}")
            
            # Show top 5 restaurants
            print("\n=== TOP 5 DATE NIGHT RESTAURANTS ===")
            for i, restaurant in enumerate(restaurants[:5], 1):
                print(f"{i}. {restaurant.get('name', 'N/A')} - Score: {restaurant.get('date_night_score', 0):.1f}")
                print(f"   Rating: {restaurant.get('rating', 0)}/5 | Price: {'$' * restaurant.get('price_level', 0)}")
                print(f"   Address: {restaurant.get('address', 'N/A')}")
                print()
        else:
            print("No restaurants found. Please check your API key and internet connection.")
            
    except Exception as e:
        print(f"Error running scraper: {e}")

if __name__ == "__main__":
    main()
