import sys
import os

# Add project root directory to path for Vercel Serverless python imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app
