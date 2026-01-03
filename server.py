"""
Simple static file server for PWA testing with uvicorn.

Usage:
    uvicorn server:app --host 0.0.0.0 --port 8000

Then in another terminal:
    ngrok http 8000

The ngrok HTTPS URL will allow full PWA testing (service worker, install prompt, etc.)
"""

from pathlib import Path
from starlette.applications import Starlette
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware

# Path to the built dist folder
DIST_DIR = Path(__file__).parent / "dist"


class PWAMiddleware(BaseHTTPMiddleware):
    """Add headers required for PWA and handle SPA routing."""
    
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        
        # Add PWA-related headers
        response.headers["Service-Worker-Allowed"] = "/"
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        return response


async def spa_fallback(request):
    """Serve index.html for SPA routing (handles refresh on any route)."""
    return FileResponse(DIST_DIR / "index.html")


# Check if dist folder exists
if not DIST_DIR.exists():
    print(f"❌ Error: {DIST_DIR} not found!")
    print("   Run 'npm run build' first to generate the dist folder.")
    exit(1)

app = Starlette(
    routes=[
        # Serve static files from dist/
        Mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets"),
        Mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static"),
    ],
    middleware=[
        Middleware(PWAMiddleware),
    ],
)

print(f"""
╔════════════════════════════════════════════════════════════╗
║  PWA Static Server                                         ║
╠════════════════════════════════════════════════════════════╣
║  Serving files from: {str(DIST_DIR):<36} ║
║                                                            ║
║  Local:   http://localhost:8000                            ║
║                                                            ║
║  For PWA testing with HTTPS, run in another terminal:      ║
║    ngrok http 8000                                         ║
║                                                            ║
║  Then use the ngrok HTTPS URL to test:                     ║
║    - Service Worker registration                           ║
║    - Install prompt (Add to Home Screen)                   ║
║    - Offline functionality                                 ║
╚════════════════════════════════════════════════════════════╝
""")

