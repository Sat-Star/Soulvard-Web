# ⚡ Quick Start: Cloudinary Setup (5 Minutes)

## What You Need to Do

### ✅ Step 1: Sign Up (2 minutes)

1. Go to https://cloudinary.com
2. Click "Sign up for free"
3. Complete signup (email or Google)
4. Verify email

### ✅ Step 2: Get Credentials (1 minute)

1. Log into Cloudinary dashboard
2. Look at the top - you'll see your **Cloud Name** (e.g., `dxxxxx`)
3. Click "API Keys" → Copy **API Key** and **API Secret**

### ✅ Step 3: Update .env (1 minute)

Open the file: `c:\Users\satya\Desktop\soulvard\Soulvard E-Commerce\.env`

Find these lines:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace with your actual values from Step 2:

```env
CLOUDINARY_CLOUD_NAME=dj4a5n8q2
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789
```

### ✅ Step 4: Restart Server (1 minute)

In terminal:

```bash
npm start
```

## That's It! 🎉

Your application now uses cloud storage!

### Test It:

1. Go to admin panel: http://localhost:5000/admin/admin.html
2. Add a new product with images
3. Check Cloudinary dashboard to see your images

## Common Issues

### "Images not uploading?"

- Did you update `.env` file? ✓
- Did you restart server? ✓
- Check credentials are correct in Cloudinary dashboard

### "Where do I find my credentials?"

- Cloud Name: Top of Cloudinary dashboard
- API Key & Secret: Click "API Keys" in left menu

### "Can I see my uploaded images?"

- Yes! Go to https://cloudinary.com/console → Media Library
- All products images in `soulvard/products` folder

## Free Tier Details

Cloudinary free plan includes:

- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ Unlimited uploads
- ✅ Basic image optimization
- ✅ CDN delivery worldwide

Perfect for development and small production sites!

---

Need detailed help? See **CLOUDINARY_SETUP.md** for full documentation.
