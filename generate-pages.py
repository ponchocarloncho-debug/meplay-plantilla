#!/usr/bin/env python3
"""
Video Page Generator (Python version)

This script automatically generates individual video pages from videodata.json

Usage:
    python generate-pages.py

Requirements:
    - Python 3.6+
    - videodata.json in the same directory
    - video-template.html in the same directory
"""

import json
import os
from pathlib import Path

# Configuration
CONFIG = {
    'videos_dir': 'videos',
    'template_file': 'video-template.html',
    'data_file': 'videodata.json',
    'overwrite_existing': False  # Set to True to overwrite existing pages
}

# Color codes for console output
class Colors:
    RESET = '\033[0m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    RED = '\033[31m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'

def log(message, color='RESET'):
    """Print colored message to console"""
    color_code = getattr(Colors, color, Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def generate_pages():
    """Main function to generate video pages"""
    try:
        log('🎬 Video Page Generator', 'CYAN')
        log('━' * 50, 'CYAN')
        
        # Check if videodata.json exists
        if not os.path.exists(CONFIG['data_file']):
            log(f"❌ Error: {CONFIG['data_file']} not found!", 'RED')
            log(f"Please make sure {CONFIG['data_file']} is in the current directory.", 'YELLOW')
            return
        
        # Check if template exists
        if not os.path.exists(CONFIG['template_file']):
            log(f"❌ Error: {CONFIG['template_file']} not found!", 'RED')
            log(f"Please make sure {CONFIG['template_file']} is in the current directory.", 'YELLOW')
            return
        
        # Create videos directory if it doesn't exist
        Path(CONFIG['videos_dir']).mkdir(parents=True, exist_ok=True)
        if not os.path.exists(CONFIG['videos_dir']):
            log(f"📁 Created directory: {CONFIG['videos_dir']}/", 'GREEN')
        
        # Load video data
        log(f"\n📖 Reading {CONFIG['data_file']}...", 'BLUE')
        with open(CONFIG['data_file'], 'r', encoding='utf-8') as f:
            video_data = json.load(f)
        log(f"✓ Found {len(video_data)} videos", 'GREEN')
        
        # Load template
        log(f"📖 Reading {CONFIG['template_file']}...", 'BLUE')
        with open(CONFIG['template_file'], 'r', encoding='utf-8') as f:
            template = f.read()
        log("✓ Template loaded", 'GREEN')
        
        # Generate pages
        log("\n🔨 Generating pages...", 'BLUE')
        created = 0
        skipped = 0
        errors = 0
        
        for video in video_data:
            try:
                # Extract filename from URL
                filename = video['url'].split('/')[-1]
                filepath = os.path.join(CONFIG['videos_dir'], filename)
                
                # Check if file exists
                if os.path.exists(filepath) and not CONFIG['overwrite_existing']:
                    log(f"⊘ Skipped: {filename} (already exists)", 'YELLOW')
                    skipped += 1
                    continue
                
                # Generate page content
                page_content = (template
                    .replace('Video Title - Video Site', f"{video['title']} - Video Site")
                    .replace('VIDEO_EMBED_URL_HERE', video.get('embed', ''))
                    .replace('Video Title Here', video['title'])
                    .replace('2026-01-23', video.get('date', ''))
                    .replace('Video description goes here...', 
                            video.get('description', 'No description available')))
                
                # Write file
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(page_content)
                
                log(f"✓ Created: {filename}", 'GREEN')
                created += 1
                
            except Exception as error:
                log(f"❌ Error generating {video.get('url', 'unknown')}: {str(error)}", 'RED')
                errors += 1
        
        # Summary
        log(f"\n{'━' * 50}", 'CYAN')
        log("📊 Summary:", 'CYAN')
        log(f"   ✓ Created: {created}", 'GREEN')
        if skipped > 0:
            log(f"   ⊘ Skipped: {skipped}", 'YELLOW')
        if errors > 0:
            log(f"   ❌ Errors: {errors}", 'RED')
        log('━' * 50, 'CYAN')
        
        if created > 0:
            log(f"\n🎉 Done! {created} page(s) generated successfully!", 'GREEN')
            log(f"📁 Files are in: {CONFIG['videos_dir']}/", 'BLUE')
    
    except Exception as error:
        log(f"\n❌ Fatal error: {str(error)}", 'RED')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    generate_pages()
