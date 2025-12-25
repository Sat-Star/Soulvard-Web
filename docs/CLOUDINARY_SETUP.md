# Cloudinary Setup Guide for Soulvard E-Commerce

## Overview

Your application has been configured to use **Cloudinary** for cloud-based image storage instead of local disk storage. This means all product images, hero images, and other uploads are stored securely in the cloud.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign up for free"
3. Sign up with your email or Google account
4. Verify your email

## Step 2: Get Your Cloudinary Credentials

After signing up, go to your **Dashboard** (https://cloudinary.com/console):

1. **Cloud Name**: Found at the top of the dashboard (looks like: `dxxxxx` or `your-name`)
2. **API Key**: In the "API Keys" section
3. **API Secret**: In the "API Keys" section

## Step 3: Update Your .env File

Open `.env` file in your project root and update the Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**

```env
CLOUDINARY_CLOUD_NAME=dj4a5n8q2
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789
```

## Step 4: Restart Your Server

After updating `.env`, restart your Node.js server:

```bash
npm start
```

## How It Works Now

### Before (Local Storage)

```
User uploads image → Saved in `/backend/uploads/` → Served via `/uploads/filename.jpg`
```

### After (Cloudinary)

```
User uploads image → Uploaded to Cloudinary → URL stored: `https://res.cloudinary.com/...`
```

## Benefits of Cloudinary

✅ **No Local Storage Needed** - Images stored in cloud, not on your server
✅ **Automatic Scaling** - Images optimized for different devices
✅ **CDN Integration** - Fast delivery worldwide
✅ **Free Tier Available** - 25 GB storage, 25 GB bandwidth/month free
✅ **Easy Management** - View all images in Cloudinary dashboard
✅ **Version History** - Keep previous versions of images
✅ **Transformations** - Resize, crop, optimize images on-the-fly

## Testing Upload Functionality

1. Start your server: `npm start`
2. Open admin panel: `http://localhost:5000/admin/admin.html`
3. Log in with admin credentials
4. Add a new product with images
5. Check Cloudinary dashboard - images should appear in `soulvard/products` folder

## Cloudinary Dashboard Navigation

1. Go to https://cloudinary.com/console
2. Click **"Media Library"** in left sidebar
3. You'll see all uploaded images organized in folders:
   - `soulvard/products/` - Product images
   - Other folders for future use

## File Organization in Cloudinary

All uploaded images are automatically organized:

- **Path**: `soulvard/products/image-name.jpg`
- **URL Format**: `https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/soulvard/products/image-name.jpg`

## Security Notes

⚠️ **Important**: Never commit your API secret to GitHub!

- Your `.env` file should be in `.gitignore`
- Keep API keys private
- Rotate keys if exposed

## Troubleshooting

### Images not uploading?

- Check if credentials are correct in `.env`
- Verify server is restarted after `.env` changes
- Check browser console for error messages

### Cloudinary credentials not working?

- Log back into Cloudinary dashboard
- Verify Cloud Name, API Key, and API Secret are exact matches
- Restart server after fixing credentials

### Want to see upload logs?

- Check your Cloudinary dashboard → "Media Library"
- All uploads appear there in real-time

## Future Enhancements

You can extend Cloudinary usage for:

- Image transformations (resizing thumbnails automatically)
- Optimization (automatic format selection for faster loading)
- Storage organization (different folders for different content types)
- Advanced security (signed URLs, access control)

## References

- Cloudinary Documentation: https://cloudinary.com/documentation
- Multer Storage Cloudinary: https://github.com/afedulov/multer-storage-cloudinary
- Node.js Cloudinary SDK: https://github.com/cloudinary/cloudinary_npm

---

**Status**: ✅ Cloud storage configured and ready to use
**Last Updated**: December 21, 2025
