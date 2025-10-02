# Render Deployment Guide for Secure-Blockchain-DApps

## Files Created for Deployment

✓ `render.yaml` - Render service configuration
✓ `Procfile` - Process definition for web service  
✓ `build.sh` - Build script for dependencies
✓ Updated `main.py` - Port configuration for Render
✓ Updated `app.py` - Database URL handling for PostgreSQL

## Common 502 Error Causes & Solutions

### 1. **Port Configuration**
**Problem**: App not binding to Render's assigned port
**Solution**: ✅ Fixed - App now uses `$PORT` environment variable

### 2. **Database URL Format**
**Problem**: PostgreSQL URL format incompatibility  
**Solution**: ✅ Fixed - Converts `postgres://` to `postgresql://`

### 3. **Dependencies Installation**
**Problem**: Missing or incompatible dependencies
**Solution**: ✅ Fixed - Using `pyproject.toml` with proper dependencies

### 4. **Debug Mode in Production**
**Problem**: Debug mode causing issues in production
**Solution**: ✅ Fixed - Debug disabled for production

## Render Deployment Steps

### Option 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect Render to your repository
3. Render will auto-detect `render.yaml` configuration
4. Deploy automatically

### Option 2: Manual Configuration
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure settings:
   - **Build Command**: `pip install -e .`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT main:app`
   - **Python Version**: 3.11

## Environment Variables to Set on Render

### Required:
- `SESSION_SECRET`: Random string for Flask sessions
- `DATABASE_URL`: PostgreSQL database URL (auto-provided by Render)

### Optional (for email functionality):
- `MAIL_SERVER`: SMTP server (default: smtp.gmail.com)
- `MAIL_PORT`: SMTP port (default: 587)  
- `MAIL_USE_TLS`: Enable TLS (default: True)
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password/app password
- `MAIL_DEFAULT_SENDER`: Default sender email

## Troubleshooting 502 Errors

### Check Build Logs
1. Go to Render Dashboard → Your Service → Logs
2. Look for build failures or dependency issues

### Check Deploy Logs  
1. Check for port binding errors
2. Verify gunicorn starts successfully
3. Look for database connection issues

### Common Log Messages:
- ❌ `Address already in use` → Port conflict (fixed with $PORT)
- ❌ `No module named 'xyz'` → Missing dependency
- ❌ `Connection refused` → Database connection issue
- ✅ `Listening at: http://0.0.0.0:10000` → Successful start

## Health Check Endpoint

Your app responds to health checks at:
- `GET /` - Returns the homepage
- All routes are defined in `routes.py`

## Database Setup

Render automatically provides PostgreSQL:
1. Add PostgreSQL service in Render dashboard
2. Database URL is auto-injected as `DATABASE_URL`
3. Tables are created automatically on first run

## Static Files

Static files are served from `/static/` directory:
- CSS files: `/static/css/`
- JavaScript files: `/static/js/`
- Images: `/static/images/`

## Next Steps After Deployment

1. Test the homepage loads
2. Verify wallet connection functionality
3. Test email functionality (if configured)
4. Set up custom domain (optional)
5. Configure SSL certificate (automatic on Render)

## Support

If you continue experiencing 502 errors:
1. Check the specific error message in Render logs
2. Verify all environment variables are set correctly
3. Ensure your GitHub repository has all the files listed above