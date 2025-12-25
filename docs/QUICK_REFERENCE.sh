#!/bin/bash
# Quick Reference: Essential Commands for Soulvard Backend

# ============================================
# SETUP & INSTALLATION
# ============================================

# Install all dependencies
npm install

# Start the backend server (production mode)
npm start

# Start the backend server (development with auto-reload)
npm run dev

# Populate database with sample data
node backend/seed.js


# ============================================
# TESTING API ENDPOINTS (Using curl)
# ============================================

# AUTHENTICATION ENDPOINTS

# Sign up a new customer
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+91 9876543210",
    "address": "123 Main Street"
  }'

# Login (get JWT token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@soulvard.com",
    "password": "admin123"
  }'


# PRODUCT ENDPOINTS (No auth required for GET)

# Get all products
curl http://localhost:5000/api/products

# Get single product (replace PRODUCT_ID)
curl http://localhost:5000/api/products/PRODUCT_ID

# Create product (requires admin token)
# Note: Use Postman/Insomnia for file uploads
# curl -X POST http://localhost:5000/api/products \
#   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
#   -F "id=003" \
#   -F "name=New Product" \
#   ... other fields


# CATEGORY ENDPOINTS

# Get all categories
curl http://localhost:5000/api/categories

# Create category (requires admin token)
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Category"}'


# COUPON ENDPOINTS

# Get active coupons
curl http://localhost:5000/api/coupons

# Validate a coupon
curl -X POST http://localhost:5000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "SOULVARD20"}'

# Create coupon (requires admin token)
curl -X POST http://localhost:5000/api/coupons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "NEWYEAR25",
    "discount": 25,
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "applicableProducts": ["all"],
    "usageLimit": 100
  }'


# PLAYLIST ENDPOINTS

# Get all playlists
curl http://localhost:5000/api/playlists

# Get single playlist
curl http://localhost:5000/api/playlists/top-picks

# Create playlist (requires admin token)
curl -X POST http://localhost:5000/api/playlists \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Collection"}'


# HERO IMAGES ENDPOINTS

# Get all hero images
curl http://localhost:5000/api/hero-images

# Create hero image (requires admin token + file upload)
# Use Postman/Insomnia for file uploads


# SIZE CHARTS ENDPOINTS

# Get all size charts
curl http://localhost:5000/api/size-charts

# Get single size chart
curl http://localhost:5000/api/size-charts/Shirts

# Create size chart (requires admin token)
curl -X POST http://localhost:5000/api/size-charts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Dresses",
    "sizes": [
      {
        "size": "XS",
        "chest": "32-34",
        "waist": "26-28",
        "hip": "34-36",
        "length": "26"
      }
    ]
  }'


# PROMOTIONS ENDPOINTS

# Get active promotions
curl http://localhost:5000/api/promotions

# Create promotion (requires admin token)
curl -X POST http://localhost:5000/api/promotions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Winter Sale",
    "description": "50% off selected items",
    "endDate": "2025-02-28",
    "active": true
  }'


# ============================================
# DATABASE OPERATIONS
# ============================================

# Access MongoDB shell (if installed locally)
mongosh

# View databases
show dbs

# Use soulvard database
use soulvard

# View collections
show collections

# Query users
db.users.find()

# Query products
db.products.find()

# Query categories
db.categories.find()

# Count documents
db.users.countDocuments()

# Delete a collection
db.users.drop()

# Clear all data
db.dropDatabase()


# ============================================
# DEBUGGING & MONITORING
# ============================================

# Check if server is running (from another terminal)
curl http://localhost:5000/api/products

# View server logs (if using npm run dev)
# Server will show logs in the same terminal

# Check port is in use (Windows)
netstat -ano | findstr :5000

# Check port is in use (Mac/Linux)
lsof -i :5000

# Kill process on port (Windows)
taskkill /PID <PID> /F

# Kill process on port (Mac/Linux)
kill -9 <PID>


# ============================================
# GIT OPERATIONS
# ============================================

# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Add backend API implementation"

# Push to repository
git push origin main


# ============================================
# USEFUL SHORTCUTS & TIPS
# ============================================

# Copy JWT token from login response and use in requests:
# curl ... -H "Authorization: Bearer <PASTE_TOKEN_HERE>"

# Save JWT to variable (in bash):
# TOKEN=$(curl -s -X POST ... | jq -r '.token')
# Then use: -H "Authorization: Bearer $TOKEN"

# Test with pretty JSON output (install jq first):
# curl http://localhost:5000/api/products | jq

# Monitor file changes and restart server automatically:
# npm run dev

# View .env file (remember: NEVER commit this!)
# cat .env

# Regenerate package-lock.json:
# npm install

# Clear npm cache:
# npm cache clean --force

# Update all dependencies:
# npm update


# ============================================
# COMMON ISSUES & SOLUTIONS
# ============================================

# Issue: "Port 5000 already in use"
# Solution: Kill process on port or use different port in .env

# Issue: "Cannot find module 'mongoose'"
# Solution: npm install

# Issue: "MongoDB connection error"
# Solution: Check MongoDB is running, verify MONGODB_URL in .env

# Issue: "JWT token invalid"
# Solution: Ensure token is in Authorization header with "Bearer " prefix

# Issue: "File upload fails"
# Solution: Check file type/size, use FormData for multipart requests

# Issue: "Admin route returns 403"
# Solution: Ensure user has admin role in database


# ============================================
# ENVIRONMENT VARIABLES CHECKLIST
# ============================================

# Required variables in .env file:
# PORT=5000
# MONGODB_URL=mongodb://localhost:27017/soulvard
# JWT_SECRET=your_jwt_secret_key_change_this
# NODE_ENV=development

# Before production deployment, change:
# - NODE_ENV to production
# - MONGODB_URL to production database
# - JWT_SECRET to a strong, random value


# ============================================
# PROJECT STRUCTURE SHORTCUTS
# ============================================

# View all files in backend
ls -la backend/

# View model files
ls -la backend/models/

# View route files
ls -la backend/routes/

# View all API endpoints
grep -r "router\." backend/routes/

# View uploaded images
ls -la backend/uploads/

# View environment config
cat .env

# View package dependencies
cat package.json


# ============================================
# QUICK WORKFLOW
# ============================================

# 1. Setup
npm install
node backend/seed.js

# 2. Development
npm run dev
# Keep terminal open, server auto-reloads on file changes

# 3. Testing (in another terminal)
curl http://localhost:5000/api/products

# 4. Integration
# Update admin panel and client to use API endpoints

# 5. Deployment
# Set environment variables for production
# Start server with: npm start


# ============================================
# USEFUL ALIASES (Add to .bashrc or .bash_profile)
# ============================================

# alias soulvard-server="cd ~/Desktop/soulvard && npm start"
# alias soulvard-dev="cd ~/Desktop/soulvard && npm run dev"
# alias soulvard-seed="cd ~/Desktop/soulvard && node backend/seed.js"
# alias soulvard-test="curl http://localhost:5000/api/products | jq"


# ============================================
# POSTMAN/INSOMNIA SETUP
# ============================================

# 1. Open Postman/Insomnia
# 2. Create new collection: "Soulvard API"
# 3. Set base URL: http://localhost:5000
# 4. Add requests:
#    - POST /api/auth/login
#    - GET /api/products
#    - POST /api/products
#    - etc.
# 5. For protected routes, add to Headers:
#    - Key: Authorization
#    - Value: Bearer <JWT_TOKEN>
# 6. Save responses as templates
# 7. Use for testing before frontend integration


echo "🚀 Backend setup complete! Ready to go."
echo "📖 For detailed guides, see:"
echo "   - BACKEND_SETUP.md"
echo "   - API_TESTING_GUIDE.md"
echo "   - ADMIN_INTEGRATION_EXAMPLE.md"
