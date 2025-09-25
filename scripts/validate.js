#!/usr/bin/env node

/**
 * Validation Script
 * Validates HTML, CSS, and JavaScript for common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting validation...');

let errors = 0;
let warnings = 0;

// Helper function to check file existence
const checkFile = (filePath, description) => {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing ${description}: ${filePath}`);
        errors++;
        return false;
    }
    console.log(`✅ Found ${description}: ${filePath}`);
    return true;
};

// Validate required files
const requiredFiles = [
    { path: 'index.html', desc: 'HTML file' },
    { path: 'css/styles.css', desc: 'CSS file' },
    { path: 'js/main.js', desc: 'JavaScript file' },
    { path: 'manifest.json', desc: 'PWA manifest' },
    { path: 'robots.txt', desc: 'Robots.txt file' },
    { path: 'sitemap.xml', desc: 'Sitemap file' },
    { path: 'sw.js', desc: 'Service Worker' }
];

requiredFiles.forEach(file => {
    checkFile(file.path, file.desc);
});

// Validate HTML structure
if (fs.existsSync('index.html')) {
    const htmlContent = fs.readFileSync('index.html', 'utf8');

    // Check for required meta tags
    const requiredMeta = [
        'viewport',
        'theme-color',
        'description',
        'og:title',
        'og:description',
        'twitter:card'
    ];

    requiredMeta.forEach(meta => {
        if (!htmlContent.includes(meta)) {
            console.warn(`⚠️  Missing meta tag: ${meta}`);
            warnings++;
        } else {
            console.log(`✅ Found meta tag: ${meta}`);
        }
    });

    // Check for required sections
    const requiredSections = ['home', 'about', 'projects', 'skills', 'journey', 'terminal', 'contact'];
    requiredSections.forEach(section => {
        if (!htmlContent.includes(`id="${section}"`)) {
            console.warn(`⚠️  Missing section: ${section}`);
            warnings++;
        } else {
            console.log(`✅ Found section: ${section}`);
        }
    });

    // Check for accessibility features
    const a11yChecks = [
        { pattern: /aria-label/g, name: 'ARIA labels' },
        { pattern: /alt="/g, name: 'Image alt attributes' },
        { pattern: /role="/g, name: 'ARIA roles' }
    ];

    a11yChecks.forEach(check => {
        const matches = htmlContent.match(check.pattern);
        if (!matches || matches.length < 3) {
            console.warn(`⚠️  Few ${check.name} found (${matches ? matches.length : 0})`);
            warnings++;
        } else {
            console.log(`✅ Good ${check.name} coverage (${matches.length})`);
        }
    });
}

// Validate CSS
if (fs.existsSync('css/styles.css')) {
    const cssContent = fs.readFileSync('css/styles.css', 'utf8');

    // Check for CSS custom properties
    const customProps = cssContent.match(/--[\w-]+:/g);
    if (!customProps || customProps.length < 10) {
        console.warn('⚠️  Few CSS custom properties found - consider using more for theming');
        warnings++;
    } else {
        console.log(`✅ Good CSS custom properties usage (${customProps.length})`);
    }

    // Check for responsive breakpoints
    const breakpoints = cssContent.match(/@media.*max-width/g);
    if (!breakpoints || breakpoints.length < 3) {
        console.warn('⚠️  Few responsive breakpoints found');
        warnings++;
    } else {
        console.log(`✅ Good responsive design (${breakpoints.length} breakpoints)`);
    }

    // Check for animations
    const animations = cssContent.match(/@keyframes|animation:|transform:/g);
    if (!animations || animations.length < 5) {
        console.warn('⚠️  Few animations found');
        warnings++;
    } else {
        console.log(`✅ Good animation usage (${animations.length})`);
    }
}

// Validate JavaScript
if (fs.existsSync('js/main.js')) {
    const jsContent = fs.readFileSync('js/main.js', 'utf8');

    // Check for modern JavaScript features
    const modernFeatures = [
        { pattern: /class \w+/g, name: 'ES6 classes' },
        { pattern: /const \w+/g, name: 'const declarations' },
        { pattern: /addEventListener/g, name: 'event listeners' },
        { pattern: /querySelector/g, name: 'modern DOM selectors' }
    ];

    modernFeatures.forEach(feature => {
        const matches = jsContent.match(feature.pattern);
        if (!matches || matches.length < 3) {
            console.warn(`⚠️  Few ${feature.name} found`);
            warnings++;
        } else {
            console.log(`✅ Good ${feature.name} usage (${matches.length})`);
        }
    });

    // Check for error handling
    const errorHandling = jsContent.match(/try|catch|error/gi);
    if (!errorHandling || errorHandling.length < 3) {
        console.warn('⚠️  Limited error handling found');
        warnings++;
    } else {
        console.log(`✅ Good error handling (${errorHandling.length} instances)`);
    }

    // Check for performance optimizations
    const perfOptimizations = jsContent.match(/throttle|debounce|requestAnimationFrame/g);
    if (!perfOptimizations || perfOptimizations.length < 2) {
        console.warn('⚠️  Few performance optimizations found');
        warnings++;
    } else {
        console.log(`✅ Good performance optimizations (${perfOptimizations.length})`);
    }
}

// Validate PWA manifest
if (fs.existsSync('manifest.json')) {
    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'icons'];
        let manifestValid = true;

        requiredFields.forEach(field => {
            if (!manifest[field]) {
                console.error(`❌ Missing manifest field: ${field}`);
                errors++;
                manifestValid = false;
            }
        });

        if (manifestValid) {
            console.log('✅ PWA manifest is valid');
        }

        // Check icon sizes
        if (manifest.icons && manifest.icons.length < 3) {
            console.warn('⚠️  Few PWA icons defined');
            warnings++;
        }
    } catch (e) {
        console.error('❌ Invalid JSON in manifest.json');
        errors++;
    }
}

// Check for Service Worker
if (fs.existsSync('sw.js')) {
    const swContent = fs.readFileSync('sw.js', 'utf8');

    const swFeatures = ['install', 'activate', 'fetch'];
    swFeatures.forEach(feature => {
        if (!swContent.includes(`addEventListener('${feature}'`)) {
            console.warn(`⚠️  Service Worker missing ${feature} handler`);
            warnings++;
        } else {
            console.log(`✅ Service Worker has ${feature} handler`);
        }
    });
}

// Summary
console.log('\n📊 Validation Summary:');
console.log(`✅ Passed checks: ${errors === 0 ? 'All core requirements met' : 'Some issues found'}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Errors: ${errors}`);

if (errors > 0) {
    console.log('\n🔧 Please fix the errors before deployment.');
    process.exit(1);
} else if (warnings > 0) {
    console.log('\n💡 Consider addressing warnings for better quality.');
    process.exit(0);
} else {
    console.log('\n🎉 All validations passed! Ready for deployment.');
    process.exit(0);
}