const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../photos/logo/new_logo.png');
const publicImagesDir = path.join(__dirname, '../public/images');
const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../src/app');

async function processLogo() {
    try {
        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            return;
        }

        console.log('Generating favicon (transparent)...');
        await sharp(inputPath)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFormat('png')
            .toFile(path.join(publicDir, 'favicon.ico'));

        await sharp(inputPath)
            .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFormat('png')
            .toFile(path.join(appDir, 'icon.png'));

        console.log('Generating apple-touch-icon (white bg)...');
        const whiteBg180 = await sharp({
            create: { width: 180, height: 180, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
        }).png().toBuffer();

        const resizedAppIcon = await sharp(inputPath)
            .resize(160, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toBuffer();

        await sharp(whiteBg180)
            .composite([{ input: resizedAppIcon, gravity: 'center' }])
            .toFile(path.join(publicDir, 'apple-touch-icon.png'));

        const generateManifestIcon = async (size) => {
            console.log(`Generating app_icon_${size}.png (white bg)...`);
            const bg = await sharp({
                create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
            }).png().toBuffer();

            const fg = await sharp(inputPath)
                .resize(Math.round(size * 0.8), Math.round(size * 0.8), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();

            await sharp(bg)
                .composite([{ input: fg, gravity: 'center' }])
                .toFile(path.join(publicImagesDir, `app_icon_${size}.png`));
        };

        await generateManifestIcon(192);
        await generateManifestIcon(512);

        console.log('All icons generated successfully.');
    } catch (error) {
        console.error('Error processing logo:', error);
    }
}

processLogo();
