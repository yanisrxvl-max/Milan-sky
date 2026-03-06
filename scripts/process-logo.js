const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../photos/logo/logo.jpg');
const publicImagesDir = path.join(__dirname, '../public/images');
const publicDir = path.join(__dirname, '../public');

const targets = [
    { name: 'milan_icon.png', width: 1024, height: 1024, dir: publicImagesDir },
    { name: 'milan_icon_192.png', width: 192, height: 192, dir: publicImagesDir },
    { name: 'milan_icon_512.png', width: 512, height: 512, dir: publicImagesDir },
    { name: 'apple-touch-icon.png', width: 180, height: 180, dir: publicDir },
];

async function processLogo() {
    try {
        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            return;
        }

        for (const target of targets) {
            console.log(`Generating ${target.name}...`);
            await sharp(inputPath)
                .resize(target.width, target.height, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .toFile(path.join(target.dir, target.name));
            console.log(`Generated ${target.name} successfully.`);
        }

        // Also update milan_basic.jpg since it's used as a fallback/avatar
        console.log('Generating milan_basic.jpg...');
        await sharp(inputPath)
            .resize(800, 800)
            .toFile(path.join(publicImagesDir, 'milan_basic.jpg'));
        console.log('Generated milan_basic.jpg successfully.');

        console.log('All logo assets updated successfully.');
    } catch (error) {
        console.error('Error processing logo:', error);
    }
}

processLogo();
