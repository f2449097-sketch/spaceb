#!/usr/bin/env node

/**
 * Script to remove responsive Tailwind variants and replace with fixed values
 * This ensures universal layout across all screen sizes
 */

const fs = require('fs');
const path = require('path');

// Mapping of responsive classes to fixed equivalents
const responsiveReplacements = {
  // Grid columns
  'grid-cols-1 md:grid-cols-2': 'grid-cols-2',
  'grid-cols-1 md:grid-cols-3': 'grid-cols-3',
  'grid-cols-1 md:grid-cols-4': 'grid-cols-4',
  'grid-cols-1 lg:grid-cols-2': 'grid-cols-2',
  'grid-cols-1 lg:grid-cols-3': 'grid-cols-3',
  'grid-cols-1 lg:grid-cols-4': 'grid-cols-4',
  'grid-cols-1 xl:grid-cols-2': 'grid-cols-2',
  'grid-cols-1 xl:grid-cols-3': 'grid-cols-3',
  'grid-cols-1 xl:grid-cols-4': 'grid-cols-4',
  'grid-cols-2 md:grid-cols-4': 'grid-cols-4',
  'grid-cols-2 lg:grid-cols-4': 'grid-cols-4',
  'grid-cols-2 xl:grid-cols-4': 'grid-cols-4',
  
  // Flex direction
  'flex-col md:flex-row': 'flex-row',
  'flex-col lg:flex-row': 'flex-row',
  'flex-col xl:flex-row': 'flex-row',
  'flex-col sm:flex-row': 'flex-row',
  
  // Text sizes
  'text-lg sm:text-xl': 'text-xl',
  'text-xl sm:text-2xl': 'text-2xl',
  'text-2xl sm:text-3xl': 'text-3xl',
  'text-3xl sm:text-4xl': 'text-4xl',
  'text-sm md:text-base': 'text-base',
  'text-base md:text-lg': 'text-lg',
  
  // Padding
  'p-4 sm:p-6': 'p-6',
  'p-6 sm:p-8': 'p-8',
  'p-8 sm:p-12': 'p-12',
  'px-4 sm:px-6': 'px-6',
  'px-6 sm:px-8': 'px-8',
  'py-4 sm:py-6': 'py-6',
  'py-6 sm:py-8': 'py-8',
  'py-8 sm:py-12': 'py-12',
  'py-10 sm:py-16': 'py-16',
  
  // Margins
  'mb-4 sm:mb-6': 'mb-6',
  'mb-6 sm:mb-8': 'mb-8',
  'mb-8 sm:mb-12': 'mb-12',
  'mt-4 sm:mt-6': 'mt-6',
  'mt-6 sm:mt-8': 'mt-8',
  'mt-8 sm:mt-12': 'mt-12',
  'mt-10 sm:mt-16': 'mt-16',
  
  // Gaps
  'gap-4 sm:gap-6': 'gap-6',
  'gap-6 sm:gap-8': 'gap-8',
  'gap-8 sm:gap-12': 'gap-12',
  
  // Heights
  'h-14 sm:h-16': 'h-16',
  'h-16 sm:h-20': 'h-20',
  
  // Widths
  'w-full sm:w-auto': 'w-auto',
  'w-auto sm:w-full': 'w-full',
  
  // Display
  'hidden sm:block': 'block',
  'hidden md:block': 'block',
  'hidden lg:block': 'block',
  'hidden xl:block': 'block',
  'hidden sm:flex': 'flex',
  'hidden md:flex': 'flex',
  'hidden lg:flex': 'flex',
  'hidden xl:flex': 'flex',
  'block sm:hidden': 'hidden',
  'block md:hidden': 'hidden',
  'block lg:hidden': 'hidden',
  'flex sm:hidden': 'hidden',
  'flex md:hidden': 'hidden',
  'flex lg:hidden': 'hidden',
  
  // Space between
  'space-x-2 sm:space-x-3': 'space-x-3',
  'space-x-3 sm:space-x-4': 'space-x-4',
  'space-y-4 sm:space-y-6': 'space-y-6',
  'space-y-6 sm:space-y-8': 'space-y-8',
  
  // Max widths
  'max-w-sm sm:max-w-md': 'max-w-md',
  'max-w-md sm:max-w-lg': 'max-w-lg',
  'max-w-lg sm:max-w-xl': 'max-w-xl',
  'max-w-xl sm:max-w-2xl': 'max-w-2xl',
};

// Individual responsive class patterns to remove
const responsivePatterns = [
  /\bsm:[a-zA-Z0-9\-\[\]\/]+/g,
  /\bmd:[a-zA-Z0-9\-\[\]\/]+/g,
  /\blg:[a-zA-Z0-9\-\[\]\/]+/g,
  /\bxl:[a-zA-Z0-9\-\[\]\/]+/g,
  /\b2xl:[a-zA-Z0-9\-\[\]\/]+/g,
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply specific replacements first
    for (const [responsive, fixed] of Object.entries(responsiveReplacements)) {
      if (content.includes(responsive)) {
        content = content.replace(new RegExp(responsive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fixed);
        modified = true;
      }
    }
    
    // Remove remaining responsive variants
    responsivePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          content = content.replace(new RegExp('\\s*' + match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
          modified = true;
        });
      }
    });
    
    // Clean up extra spaces
    content = content.replace(/className="([^"]*?)"/g, (match, classes) => {
      const cleanedClasses = classes.replace(/\s+/g, ' ').trim();
      return `className="${cleanedClasses}"`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalUpdated = 0;
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      totalUpdated += processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
      if (processFile(fullPath)) {
        totalUpdated++;
      }
    }
  });
  
  return totalUpdated;
}

// Main execution
const srcPath = path.join(__dirname, '..', 'src');

console.log('🚀 Starting responsive variant removal...');
console.log(`📁 Processing directory: ${srcPath}`);

const updatedFiles = processDirectory(srcPath);

console.log(`\n✨ Complete! Updated ${updatedFiles} files.`);
console.log('🎯 All responsive variants have been removed for universal layout.');

module.exports = { processFile, processDirectory };
