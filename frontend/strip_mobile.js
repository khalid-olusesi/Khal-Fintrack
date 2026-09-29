const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the start of the mobile block
  const mobileStart = content.indexOf('{/* Mobile view */}');
  
  // Find the start of the desktop block
  const desktopStart = content.indexOf('{/* Desktop view */}');
  
  if (mobileStart !== -1 && desktopStart !== -1) {
    // Remove the mobile block entirely
    content = content.substring(0, mobileStart) + content.substring(desktopStart);
    
    // Replace the hidden desktop wrapper with a visible flex-col
    content = content.replace('{/* Desktop view */}\r\n      <div className="hidden md:flex md:flex-col md:min-h-full">', '{/* Responsive view */}\r\n      <div className="flex flex-col min-h-full">');
    content = content.replace('{/* Desktop view */}\n      <div className="hidden md:flex md:flex-col md:min-h-full">', '{/* Responsive view */}\n      <div className="flex flex-col min-h-full">');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Processed ' + file);
  } else {
    console.log('Could not find markers in ' + file);
  }
}

processFile('c:/Users/DELL/Desktop/Khal-fintrack/frontend/app/dashboard/transaction/addTransaction/page.tsx');
processFile('c:/Users/DELL/Desktop/Khal-fintrack/frontend/app/dashboard/transaction/editTransaction/[id]/page.tsx');
