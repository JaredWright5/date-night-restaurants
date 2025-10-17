# Restaurant Scraping System

A robust, repeatable system for adding restaurants to the Date Night Restaurants database.

## 🚀 Quick Start

```bash
# Add new restaurants to the database
node scripts/add_restaurants.js
```

## 📁 System Overview

### Files Structure
```
scripts/
├── restaurant_scraper.js    # Main scraper class
├── add_restaurants.js      # Simple runner script
└── README.md              # This documentation
```

### Data Flow
1. **Backup Creation** - Automatically backs up existing data
2. **Data Generation** - Creates realistic restaurant data
3. **Validation** - Sanitizes and validates all data
4. **Duplicate Prevention** - Checks for existing restaurants
5. **Safe Merging** - Adds new data without breaking existing structure

## 🔧 Features

### ✅ Robust & Reliable
- **Automatic Backups** - Creates timestamped backups before changes
- **Duplicate Prevention** - Won't add restaurants that already exist
- **Data Validation** - Sanitizes all text to prevent syntax errors
- **Error Handling** - Graceful failure with helpful error messages

### 🔄 Repeatable
- **Safe to Run Multiple Times** - Won't create duplicates
- **Incremental Updates** - Only adds new restaurants
- **Rollback Capability** - Backups allow easy rollback

### 🛠️ Extensible
- **Easy to Modify** - Clear structure for adding new data sources
- **Template System** - Simple to add new restaurant templates
- **Configurable** - Easy to adjust data generation parameters

## 📊 Data Generated

For each restaurant, the system generates:

### Core Information
- **Name** - Restaurant name (sanitized)
- **Slug** - URL-friendly identifier
- **Address** - Full street address
- **Phone** - Contact number
- **Website** - Restaurant website
- **Neighborhood** - LA neighborhood

### Ratings & Reviews
- **Rating** - 4.0-4.7 star rating
- **Review Count** - Realistic number of reviews
- **Date Night Score** - Custom 1-100 score
- **Reviews** - 3-10 realistic date night reviews

### Additional Data
- **Cuisine Types** - Primary and secondary cuisines
- **Price Level** - $ to $$$$ pricing
- **Photos** - 3-5 high-quality restaurant photos
- **Hours** - Realistic opening hours
- **Description** - SEO-optimized restaurant description

## 🎯 Usage Examples

### Add 15 New Restaurants
```bash
node scripts/add_restaurants.js
```

### Check What Was Added
```bash
# The system will show you exactly what was added
# and how many total restaurants are now in the database
```

### Rollback Changes
```bash
# If something goes wrong, restore from backup
cp src/data/backups/restaurants_backup_[timestamp].ts src/data/restaurants.ts
```

## 🔧 Customization

### Adding New Restaurant Templates

Edit `restaurant_scraper.js` and add to the `generateRestaurantData()` method:

```javascript
{
  name: "Your Restaurant Name",
  cuisine: "italian", // or french, japanese, etc.
  neighborhood: "Beverly Hills",
  address: "123 Main St, Beverly Hills, CA 90210",
  phone: "(310) 123-4567",
  website: "https://yourrestaurant.com",
  rating: 4.5,
  reviewCount: 500,
  priceLevel: 3,
  dateNightScore: 90
}
```

### Adjusting Data Generation

Modify these methods in `restaurant_scraper.js`:
- `generateReviews()` - Change review templates
- `generateOpeningHours()` - Adjust hours patterns
- `generateCuisineTypes()` - Add new cuisine mappings
- `generatePhotos()` - Change photo sources

## 🛡️ Safety Features

### Automatic Backups
- Creates timestamped backups before any changes
- Stored in `src/data/backups/`
- Easy to restore if needed

### Duplicate Prevention
- Checks existing restaurant IDs
- Won't add restaurants that already exist
- Safe to run multiple times

### Data Validation
- Sanitizes all text fields
- Handles special characters and quotes
- Prevents syntax errors in TypeScript

## 📈 Scaling for the Future

### Adding More Data Sources
1. **Google Places API** - For real restaurant data
2. **Yelp API** - For reviews and photos
3. **OpenTable API** - For availability and bookings
4. **Custom Databases** - For curated restaurant lists

### Batch Processing
- Process restaurants in batches of 50-100
- Add progress tracking and logging
- Implement rate limiting for APIs

### Data Quality
- Add photo validation
- Implement review sentiment analysis
- Add location verification

## 🚨 Troubleshooting

### Common Issues

**Build Errors After Adding Restaurants**
```bash
# Check for syntax errors
npm run build

# If errors, restore from backup
cp src/data/backups/restaurants_backup_[latest].ts src/data/restaurants.ts
```

**Duplicate Restaurants**
- The system automatically prevents duplicates
- If you see duplicates, check the ID generation logic

**Missing Data**
- Check the restaurant templates in `generateRestaurantData()`
- Verify the data processing in `processRestaurantData()`

### Getting Help

1. **Check the logs** - The system provides detailed output
2. **Review backups** - Compare with previous versions
3. **Test incrementally** - Add restaurants in small batches
4. **Validate data** - Check the generated TypeScript syntax

## 🎉 Success!

This system is designed to grow with your business. You can:

- **Add restaurants weekly** - Run the script regularly
- **Scale to multiple cities** - Extend the templates
- **Integrate real APIs** - Replace templates with live data
- **Maintain data quality** - Built-in validation and backups

The system is production-ready and will serve you well as you expand your restaurant directory! 🍽️✨
