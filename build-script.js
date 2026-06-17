const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const srcDir = path.join(__dirname, 'frontend', 'dist');
const destDir = path.join(__dirname, 'backend', 'public');

// Clean target public directory if it exists
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

if (fs.existsSync(srcDir)) {
  console.log(`Copying built frontend from ${srcDir} to ${destDir}...`);
  copyDir(srcDir, destDir);
  console.log('Frontend copy complete!');
} else {
  console.error(`Error: Built frontend directory not found at ${srcDir}`);
  process.exit(1);
}
