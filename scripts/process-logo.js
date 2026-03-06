const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../photos/logo/logo.jpg');
const publicImagesDir = path.join(__dirname, '../public/images');
const publicDir = path.join(__dirname, '../public');

const targets = [
    { name: 'milan_icon.png', width: 1024, height: 1024, dir: publicImagesDir },
    { name: 'milan_icon.jpg', width: 1024, height: 1024, dir: publicImagesDir },
    { name: 'milan_icon_alt.png', width: 1024, height: 1024, dir: publicImagesDir },
    { name: 'milan_icon_192.png', width: 192, height: 192, dir: publicImagesDir },
    { name: 'milan_icon_512.png', width: 512, height: 512, dir: publicImagesDir },
    { name: 'apple-touch-icon.png', width: 180, height: 180, dir: publicDir },
    { name: 'milan_basic.jpg', width: 800, height: 800, dir: publicImagesDir },
    { name: 'milan_basic.png', width: 800, height: 800, dir: publicImagesDir },
    { name: 'milan_elite.jpg', width: 800, height: 800, dir: publicImagesDir },
    { name: 'milan_elite.png', width: 800, height: 800, dir: publicImagesDir },
    { name: 'milan_avatar.png', width: 800, height: 800, dir: publicImagesDir },
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
            } else if (target.name.endsWith('.jpg') || target.name.endsWith('.jpeg')) {
                await pipeline.jpeg().toFile(path.join(target.dir, target.name));
            } else if (target.name.endsWith('.ico')) {
                await pipeline.toFile(path.join(target.dir, target.name));
            }
            console.log(`Generated ${target.name} successfully.`);
        }

        console.log('All logo assets updated successfully.');
    } catch (error) {
        console.error('Error processing logo:', error);
    }
}

processLogo();
