#!/usr/bin/env node

/**
 * Asset Optimization Script
 * Optimizes images, generates icons, and prepares assets for production
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting asset optimization...');

// Create placeholder images if they don't exist
const createPlaceholderImage = (width, height, text, outputPath) => {
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
          font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}"
          fill="white" opacity="0.8">${text}</text>
</svg>`;

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Created placeholder: ${outputPath}`);
};

// Generate PWA icons
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
iconSizes.forEach(size => {
    const iconPath = `assets/icons/icon-${size}x${size}.png`;
    createPlaceholderImage(size, size, 'CC', iconPath);
});

// Generate favicon variants
createPlaceholderImage(32, 32, 'CC', 'assets/icons/favicon-32x32.png');
createPlaceholderImage(16, 16, 'CC', 'assets/icons/favicon-16x16.png');
createPlaceholderImage(180, 180, 'CC', 'assets/icons/apple-touch-icon.png');

// Generate project preview images
createPlaceholderImage(600, 400, 'Project Preview', 'assets/images/project1-preview.jpg');
createPlaceholderImage(1280, 720, 'Portfolio Preview', 'assets/images/portfolio-preview.png');
createPlaceholderImage(1200, 630, 'Open Graph Preview', 'assets/images/og-preview.png');
createPlaceholderImage(1200, 600, 'Twitter Preview', 'assets/images/twitter-preview.png');

// Generate screenshots for PWA
createPlaceholderImage(1280, 720, 'Desktop View', 'assets/images/screenshot-wide.png');
createPlaceholderImage(390, 844, 'Mobile View', 'assets/images/screenshot-narrow.png');

// Generate shortcut icons
createPlaceholderImage(96, 96, 'P', 'assets/icons/shortcut-projects.png');
createPlaceholderImage(96, 96, 'C', 'assets/icons/shortcut-contact.png');

console.log('✨ Asset optimization complete!');
console.log('📝 Note: Replace placeholder images with actual designs for production use.');