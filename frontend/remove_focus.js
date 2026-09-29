const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./app').concat(walk('./components'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/focus-within:ring-2 /g, '');
  content = content.replace(/focus-within:border-gray-300 dark:focus-within:border-gray-600 /g, '');
  content = content.replace(/focus:ring-2 /g, '');
  content = content.replace(/focus:ring-green-500 /g, '');
  content = content.replace(/focus-visible:ring-0 /g, '');
  content = content.replace(/focus:ring-0 /g, '');
  
  // also match the ones at end of string or before quote
  content = content.replace(/focus-within:ring-2(?=[\s'"])/g, '');
  content = content.replace(/focus-within:border-gray-300 dark:focus-within:border-gray-600(?=[\s'"])/g, '');
  content = content.replace(/focus:ring-2(?=[\s'"])/g, '');
  content = content.replace(/focus:ring-green-500(?=[\s'"])/g, '');
  content = content.replace(/focus-visible:ring-0(?=[\s'"])/g, '');
  content = content.replace(/focus:ring-0(?=[\s'"])/g, '');
  
  // remove any remaining focus rings/borders globally
  content = content.replace(/focus-within:border-[a-z0-9-]+(?=[\s'"])/g, '');
  content = content.replace(/focus-within:ring-[a-z0-9-\/]+(?=[\s'"])/g, '');
  content = content.replace(/focus:ring-[a-z0-9-\/]+(?=[\s'"])/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
