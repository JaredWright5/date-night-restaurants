#!/usr/bin/env python3
"""
Data Validator for LA Date Night Restaurant Scraper
Validates and cleans scraped restaurant data
"""

import json
import pandas as pd
from typing import List, Dict, Tuple
import re

class RestaurantDataValidator:
    """Validates and cleans restaurant data"""
    
    def __init__(self, json_file: str = "la_date_night_restaurants.json"):
        self.json_file = json_file
        self.restaurants = []
        self.validation_errors = []
        self.cleaned_restaurants = []
    
    def load_data(self) -> bool:
        """Load restaurant data from JSON file"""
        try:
            with open(self.json_file, 'r', encoding='utf-8') as f:
                self.restaurants = json.load(f)
            print(f"✅ Loaded {len(self.restaurants)} restaurants from {self.json_file}")
            return True
        except FileNotFoundError:
            print(f"❌ File {self.json_file} not found")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing JSON: {e}")
            return False
    
    def validate_required_fields(self, restaurant: Dict) -> List[str]:
        """Validate that required fields are present and not empty"""
        errors = []
        required_fields = ['name', 'address', 'rating', 'place_id']
        
        for field in required_fields:
            if field not in restaurant or not restaurant[field]:
                errors.append(f"Missing or empty {field}")
        
        return errors
    
    def validate_rating(self, restaurant: Dict) -> List[str]:
        """Validate rating is within valid range"""
        errors = []
        rating = restaurant.get('rating', 0)
        
        if not isinstance(rating, (int, float)):
            errors.append("Rating must be a number")
        elif rating < 0 or rating > 5:
            errors.append("Rating must be between 0 and 5")
        
        return errors
    
    def validate_price_level(self, restaurant: Dict) -> List[str]:
        """Validate price level is within valid range"""
        errors = []
        price_level = restaurant.get('price_level', 0)
        
        if not isinstance(price_level, int):
            errors.append("Price level must be an integer")
        elif price_level < 0 or price_level > 4:
            errors.append("Price level must be between 0 and 4")
        
        return errors
    
    def validate_coordinates(self, restaurant: Dict) -> List[str]:
        """Validate latitude and longitude are within LA area"""
        errors = []
        lat = restaurant.get('latitude', 0)
        lng = restaurant.get('longitude', 0)
        
        # LA area bounds (approximate)
        la_bounds = {
            'lat_min': 33.7, 'lat_max': 34.3,
            'lng_min': -118.7, 'lng_max': -118.0
        }
        
        if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
            errors.append("Coordinates must be numbers")
        elif not (la_bounds['lat_min'] <= lat <= la_bounds['lat_max']):
            errors.append(f"Latitude {lat} is outside LA area")
        elif not (la_bounds['lng_min'] <= lng <= la_bounds['lng_max']):
            errors.append(f"Longitude {lng} is outside LA area")
        
        return errors
    
    def validate_phone_number(self, restaurant: Dict) -> List[str]:
        """Validate phone number format"""
        errors = []
        phone = restaurant.get('phone', '')
        
        if phone:
            # Remove all non-digit characters
            digits_only = re.sub(r'\D', '', phone)
            if len(digits_only) < 10:
                errors.append("Phone number appears to be too short")
            elif len(digits_only) > 15:
                errors.append("Phone number appears to be too long")
        
        return errors
    
    def validate_website(self, restaurant: Dict) -> List[str]:
        """Validate website URL format"""
        errors = []
        website = restaurant.get('website', '')
        
        if website:
            if not website.startswith(('http://', 'https://')):
                errors.append("Website URL should start with http:// or https://")
            elif '.' not in website:
                errors.append("Website URL appears to be invalid")
        
        return errors
    
    def clean_restaurant_data(self, restaurant: Dict) -> Dict:
        """Clean and standardize restaurant data"""
        cleaned = restaurant.copy()
        
        # Clean name
        if 'name' in cleaned:
            cleaned['name'] = cleaned['name'].strip()
        
        # Clean address
        if 'address' in cleaned:
            cleaned['address'] = cleaned['address'].strip()
        
        # Clean phone number
        if 'phone' in cleaned and cleaned['phone']:
            # Remove extra spaces and standardize format
            cleaned['phone'] = re.sub(r'\s+', ' ', cleaned['phone'].strip())
        
        # Clean website
        if 'website' in cleaned and cleaned['website']:
            cleaned['website'] = cleaned['website'].strip()
            if not cleaned['website'].startswith(('http://', 'https://')):
                cleaned['website'] = 'https://' + cleaned['website']
        
        # Ensure numeric fields are properly typed
        if 'rating' in cleaned:
            try:
                cleaned['rating'] = float(cleaned['rating'])
            except (ValueError, TypeError):
                cleaned['rating'] = 0.0
        
        if 'price_level' in cleaned:
            try:
                cleaned['price_level'] = int(cleaned['price_level'])
            except (ValueError, TypeError):
                cleaned['price_level'] = 0
        
        if 'latitude' in cleaned:
            try:
                cleaned['latitude'] = float(cleaned['latitude'])
            except (ValueError, TypeError):
                cleaned['latitude'] = 0.0
        
        if 'longitude' in cleaned:
            try:
                cleaned['longitude'] = float(cleaned['longitude'])
            except (ValueError, TypeError):
                cleaned['longitude'] = 0.0
        
        # Ensure lists are properly formatted
        for field in ['cuisine_types', 'reviews', 'photos']:
            if field in cleaned and not isinstance(cleaned[field], list):
                cleaned[field] = []
        
        return cleaned
    
    def validate_all_restaurants(self) -> Tuple[List[Dict], List[str]]:
        """Validate all restaurants and return cleaned data with errors"""
        if not self.restaurants:
            print("❌ No restaurants data loaded")
            return [], []
        
        print(f"🔍 Validating {len(self.restaurants)} restaurants...")
        
        all_errors = []
        valid_restaurants = []
        
        for i, restaurant in enumerate(self.restaurants):
            restaurant_errors = []
            
            # Run all validation checks
            restaurant_errors.extend(self.validate_required_fields(restaurant))
            restaurant_errors.extend(self.validate_rating(restaurant))
            restaurant_errors.extend(self.validate_price_level(restaurant))
            restaurant_errors.extend(self.validate_coordinates(restaurant))
            restaurant_errors.extend(self.validate_phone_number(restaurant))
            restaurant_errors.extend(self.validate_website(restaurant))
            
            if restaurant_errors:
                all_errors.append(f"Restaurant {i+1} ({restaurant.get('name', 'Unknown')}): {', '.join(restaurant_errors)}")
            else:
                # Clean the data and add to valid restaurants
                cleaned_restaurant = self.clean_restaurant_data(restaurant)
                valid_restaurants.append(cleaned_restaurant)
        
        self.cleaned_restaurants = valid_restaurants
        self.validation_errors = all_errors
        
        print(f"✅ {len(valid_restaurants)} restaurants passed validation")
        if all_errors:
            print(f"⚠️  {len(all_errors)} restaurants had validation issues")
        
        return valid_restaurants, all_errors
    
    def generate_validation_report(self) -> Dict:
        """Generate a comprehensive validation report"""
        if not self.restaurants:
            return {"error": "No data to validate"}
        
        report = {
            "total_restaurants": len(self.restaurants),
            "valid_restaurants": len(self.cleaned_restaurants),
            "invalid_restaurants": len(self.restaurants) - len(self.cleaned_restaurants),
            "validation_errors": self.validation_errors,
            "data_quality_metrics": self.calculate_quality_metrics()
        }
        
        return report
    
    def calculate_quality_metrics(self) -> Dict:
        """Calculate data quality metrics"""
        if not self.cleaned_restaurants:
            return {}
        
        metrics = {}
        
        # Completeness metrics
        total_restaurants = len(self.cleaned_restaurants)
        
        metrics['completeness'] = {
            'has_phone': sum(1 for r in self.cleaned_restaurants if r.get('phone')) / total_restaurants * 100,
            'has_website': sum(1 for r in self.cleaned_restaurants if r.get('website')) / total_restaurants * 100,
            'has_reviews': sum(1 for r in self.cleaned_restaurants if r.get('reviews')) / total_restaurants * 100,
            'has_photos': sum(1 for r in self.cleaned_restaurants if r.get('photos')) / total_restaurants * 100
        }
        
        # Rating metrics
        ratings = [r.get('rating', 0) for r in self.cleaned_restaurants if r.get('rating')]
        if ratings:
            metrics['ratings'] = {
                'average': sum(ratings) / len(ratings),
                'min': min(ratings),
                'max': max(ratings)
            }
        
        # Date night score metrics
        scores = [r.get('date_night_score', 0) for r in self.cleaned_restaurants if r.get('date_night_score')]
        if scores:
            metrics['date_night_scores'] = {
                'average': sum(scores) / len(scores),
                'min': min(scores),
                'max': max(scores)
            }
        
        return metrics
    
    def save_cleaned_data(self, output_file: str = "la_date_night_restaurants_cleaned.json"):
        """Save cleaned restaurant data"""
        if not self.cleaned_restaurants:
            print("❌ No cleaned data to save")
            return False
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.cleaned_restaurants, f, indent=2, ensure_ascii=False)
            print(f"✅ Cleaned data saved to {output_file}")
            return True
        except Exception as e:
            print(f"❌ Error saving cleaned data: {e}")
            return False
    
    def save_validation_report(self, report_file: str = "validation_report.json"):
        """Save validation report"""
        report = self.generate_validation_report()
        
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            print(f"✅ Validation report saved to {report_file}")
            return True
        except Exception as e:
            print(f"❌ Error saving validation report: {e}")
            return False

def main():
    """Main function to run data validation"""
    validator = RestaurantDataValidator()
    
    # Load data
    if not validator.load_data():
        return
    
    # Validate all restaurants
    valid_restaurants, errors = validator.validate_all_restaurants()
    
    # Save cleaned data
    validator.save_cleaned_data()
    
    # Save validation report
    validator.save_validation_report()
    
    # Print summary
    print("\n=== VALIDATION SUMMARY ===")
    print(f"Total restaurants: {len(validator.restaurants)}")
    print(f"Valid restaurants: {len(valid_restaurants)}")
    print(f"Invalid restaurants: {len(validator.restaurants) - len(valid_restaurants)}")
    
    if errors:
        print(f"\nValidation errors found:")
        for error in errors[:5]:  # Show first 5 errors
            print(f"  - {error}")
        if len(errors) > 5:
            print(f"  ... and {len(errors) - 5} more errors")
    
    # Show quality metrics
    report = validator.generate_validation_report()
    if 'data_quality_metrics' in report:
        metrics = report['data_quality_metrics']
        print(f"\n=== DATA QUALITY METRICS ===")
        if 'completeness' in metrics:
            comp = metrics['completeness']
            print(f"Phone numbers: {comp['has_phone']:.1f}%")
            print(f"Websites: {comp['has_website']:.1f}%")
            print(f"Reviews: {comp['has_reviews']:.1f}%")
            print(f"Photos: {comp['has_photos']:.1f}%")
        
        if 'ratings' in metrics:
            ratings = metrics['ratings']
            print(f"\nAverage rating: {ratings['average']:.2f}")
            print(f"Rating range: {ratings['min']:.1f} - {ratings['max']:.1f}")
        
        if 'date_night_scores' in metrics:
            scores = metrics['date_night_scores']
            print(f"\nAverage date night score: {scores['average']:.1f}")
            print(f"Score range: {scores['min']:.1f} - {scores['max']:.1f}")

if __name__ == "__main__":
    main()
