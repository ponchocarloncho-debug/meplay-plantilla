#!/usr/bin/env node

/**
 * Video Page Generator
 * 
 * This script automatically generates individual video pages from videodata.json
 * 
 * Usage:
 *   node generate-pages.js
 * 
 * Requirements:
 *   - Node.js installed
 *   - videodata.json in the same directory
 *   - video-template.html in the same directory
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  videosDir: 'videos',
  templateFile: 'video-template.html',
  dataFile: 'videodata.json',
  overwriteExisting: false // Set to true to overwrite existing pages
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Main function
async function generatePages() {
  try {
    log('🎬 Video Page Generator', 'cyan');
    log('━'.repeat(50), 'cyan');
    
    // Check if videodata.json exists
    if (!fs.existsSync(CONFIG.dataFile)) {
      log(`❌ Error: ${CONFIG.dataFile} not found!`, 'red');
      log(`Please make sure ${CONFIG.dataFile} is in the current directory.`, 'yellow');
      return;
    }
    
    // Check if template exists
    if (!fs.existsSync(CONFIG.templateFile)) {
      log(`❌ Error: ${CONFIG.templateFile} not found!`, 'red');
      log(`Please make sure ${CONFIG.templateFile} is in the current directory.`, 'yellow');
      return;
    }
    
    // Create videos directory if it doesn't exist
    if (!fs.existsSync(CONFIG.videosDir)) {
      fs.mkdirSync(CONFIG.videosDir, { recursive: true });
      log(`📁 Created directory: ${CONFIG.videosDir}/`, 'green');
    }
    
    // Load video data
    log(`\n📖 Reading ${CONFIG.dataFile}...`, 'blue');
    const videoData = JSON.parse(fs.readFileSync(CONFIG.dataFile, 'utf8'));
    log(`✓ Found ${videoData.length} videos`, 'green');
    
    // Load template
    log(`📖 Reading ${CONFIG.templateFile}...`, 'blue');
    const template = fs.readFileSync(CONFIG.templateFile, 'utf8');
    log(`✓ Template loaded`, 'green');
    
    // Generate pages
    log(`\n🔨 Generating pages...`, 'blue');
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const video of videoData) {
      try {
        // Extract filename from URL
        const filename = video.url.split('/').pop();
        const filepath = path.join(CONFIG.videosDir, filename);
        
        // Check if file exists
        if (fs.existsSync(filepath) && !CONFIG.overwriteExisting) {
          log(`⊘ Skipped: ${filename} (already exists)`, 'yellow');
          skipped++;
          continue;
        }
        
        // Generate page content
        let pageContent = template
          .replace('Video Title - Video Site', `${video.title} - Video Site`)
          .replace('VIDEO_EMBED_URL_HERE', video.embed || '')
          .replace('Video Title Here', video.title)
          .replace('2026-01-23', video.date || '')
          .replace('Video description goes here...', video.description || 'No description available');
        
        // Write file
        fs.writeFileSync(filepath, pageContent, 'utf8');
        log(`✓ Created: ${filename}`, 'green');
        created++;
        
      } catch (error) {
        log(`❌ Error generating ${video.url}: ${error.message}`, 'red');
        errors++;
      }
    }
    
    // Summary
    log(`\n${'━'.repeat(50)}`, 'cyan');
    log(`📊 Summary:`, 'cyan');
    log(`   ✓ Created: ${created}`, 'green');
    if (skipped > 0) log(`   ⊘ Skipped: ${skipped}`, 'yellow');
    if (errors > 0) log(`   ❌ Errors: ${errors}`, 'red');
    log(`${'━'.repeat(50)}`, 'cyan');
    
    if (created > 0) {
      log(`\n🎉 Done! ${created} page(s) generated successfully!`, 'green');
      log(`📁 Files are in: ${CONFIG.videosDir}/`, 'blue');
    }
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error);
  }
}

// Run the generator
generatePages();
