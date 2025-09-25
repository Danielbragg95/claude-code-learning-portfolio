#!/usr/bin/env node

/**
 * Minification Script
 * Minifies CSS and JavaScript files for production
 */

const fs = require('fs');
const path = require('path');

console.log('🗜️  Starting minification...');

// Simple CSS minification
const minifyCSS = (css) => {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
        .replace(/\s*{\s*/g, '{') // Clean braces
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';') // Clean semicolons
        .replace(/\s*:\s*/g, ':') // Clean colons
        .replace(/\s*,\s*/g, ',') // Clean commas
        .trim();
};

// Simple JavaScript minification
const minifyJS = (js) => {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*{\s*/g, '{') // Clean braces
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';') // Clean semicolons
        .replace(/\s*:\s*/g, ':') // Clean colons
        .replace(/\s*,\s*/g, ',') // Clean commas
        .replace(/\s*=\s*/g, '=') // Clean equals
        .replace(/\s*\(\s*/g, '(') // Clean parentheses
        .replace(/\s*\)\s*/g, ')')
        .trim();
};

// Minify CSS
if (fs.existsSync('css/styles.css')) {
    const cssContent = fs.readFileSync('css/styles.css', 'utf8');
    const minifiedCSS = minifyCSS(cssContent);

    const originalSize = Buffer.byteLength(cssContent, 'utf8');
    const minifiedSize = Buffer.byteLength(minifiedCSS, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

    fs.writeFileSync('css/styles.min.css', minifiedCSS);
    console.log(`✅ CSS minified: ${originalSize} → ${minifiedSize} bytes (${savings}% smaller)`);
}

// Minify JavaScript
if (fs.existsSync('js/main.js')) {
    const jsContent = fs.readFileSync('js/main.js', 'utf8');
    const minifiedJS = minifyJS(jsContent);

    const originalSize = Buffer.byteLength(jsContent, 'utf8');
    const minifiedSize = Buffer.byteLength(minifiedJS, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

    fs.writeFileSync('js/main.min.js', minifiedJS);
    console.log(`✅ JavaScript minified: ${originalSize} → ${minifiedSize} bytes (${savings}% smaller)`);
}

// Create production HTML that uses minified assets
if (fs.existsSync('index.html')) {
    let htmlContent = fs.readFileSync('index.html', 'utf8');

    // Replace asset references with minified versions
    htmlContent = htmlContent
        .replace('./css/styles.css', './css/styles.min.css')
        .replace('./js/main.js', './js/main.min.js');

    // Add cache-busting timestamps
    const timestamp = Date.now();
    htmlContent = htmlContent
        .replace('./css/styles.min.css', `./css/styles.min.css?v=${timestamp}`)
        .replace('./js/main.min.js', `./js/main.min.js?v=${timestamp}`);

    fs.writeFileSync('index.prod.html', htmlContent);
    console.log('✅ Production HTML created with minified assets');
}

// Generate build info
const buildInfo = {
    timestamp: new Date().toISOString(),
    version: require('../package.json').version || '1.0.0',
    minified: {
        css: fs.existsSync('css/styles.min.css'),
        js: fs.existsSync('js/main.min.js')
    }
};

fs.writeFileSync('build-info.json', JSON.stringify(buildInfo, null, 2));
console.log('✅ Build info generated');

console.log('✨ Minification complete!');
console.log('💡 For production deployment, use the minified assets.');