const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../photos/logo/logo.jpg');
const publicImagesDir = path.join(__dirname, '../public/images');
const publicDir = path.join(__dirname, '../public');

const targets = [
    { name: 'app_icon_192.png', width: 192, height: 192, dir: publicImagesDir },
    { name: 'app_icon_512.png', width: 512, height: 512, dir: publicImagesDir },
    { name: 'apple-touch-icon.png', width: 180, height: 180, dir: publicDir },
    { name: 'favicon.ico', width: 32, height: 32, dir: publicDir },
];

async function processLogo() {
    try {
        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            return;
        }

        for (const target of targets) {
            console.log(`Generating ${target.name}...`);
            const pipeline = sharp(inputPath)
                .resize(target.width, target.height, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                });

            if (target.name.endsWith('.png')) {
                await pipeline.png().toFile(path.join(target.dir, target.name));
            } else if (target.name.endsWith('.ico')) {
                await pipeline.toFile(path.join(target.dir, target.name));
            }
            console.log(`Generated ${target.name} successfully.`);
        }

        console.log('App icon assets updated successfully.');
    } catch (error) {
        console.error('Error processing logo:', error);
    }
}

processLogo();
