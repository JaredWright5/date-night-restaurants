import fs from 'fs';
import path from 'path';

// Find all admin restaurant pages
const adminDir = 'src/pages/admin/restaurants';
const files = fs.readdirSync(adminDir);

console.log('🔧 Adding noIndex to admin restaurant pages...\n');

let updatedCount = 0;

files.forEach(file => {
  if (file.endsWith('.astro')) {
    const filePath = path.join(adminDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if noIndex is already present
    if (content.includes('noIndex={true}')) {
      console.log(`✅ ${file} already has noIndex`);
      return;
    }
    
    // Add noIndex to BaseLayout
    const updatedContent = content.replace(
      /<BaseLayout\s+([^>]*?)>/,
      (match, props) => {
        // Check if noIndex is already in props
        if (props.includes('noIndex')) {
          return match;
        }
        
        // Add noIndex prop
        const newProps = props.trim();
        const hasClosingBracket = newProps.endsWith('>');
        const cleanProps = hasClosingBracket ? newProps.slice(0, -1) : newProps;
        
        return `<BaseLayout ${cleanProps} noIndex={true}${hasClosingBracket ? '>' : '>'}`;
      }
    );
    
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated ${file}`);
      updatedCount++;
    } else {
      console.log(`⚠️  Could not update ${file} - no BaseLayout found`);
    }
  }
});

console.log(`\n🎉 Updated ${updatedCount} admin restaurant pages with noIndex`);
console.log('All admin pages should now be excluded from search engine indexing.');
