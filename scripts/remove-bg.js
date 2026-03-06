const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeWhiteBackground(inputPath, outputPath) {
    console.log('Processing:', inputPath);
    const { data, info } = await sharp(inputPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const w = info.width;
    const h = info.height;

    // Check if pixel is light enough to be considered background
    const isBackground = (x, y) => {
        const idx = (y * w + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        return r > 220 && g > 220 && b > 220; // 220 is a safe threshold for white/off-white halos
    };

    // Track visited pixels to avoid infinite loops
    const visited = new Uint8Array(w * h);

    // We'll use a queue for the flood fill
    // Pre-allocate to avoid massive memory reallocations if possible, but JS arrays are fine for 1024x1024
    const queue = [];

    // Start from the edges, assuming the background touches the borders
    for (let x = 0; x < w; x++) {
        queue.push({ x, y: 0 });
        queue.push({ x, y: h - 1 });
    }
    for (let y = 0; y < h; y++) {
        queue.push({ x: 0, y });
        queue.push({ x: w - 1, y });
    }

    let head = 0;
    while (head < queue.length) {
        const { x, y } = queue[head++];

        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const vIdx = y * w + x;

        if (visited[vIdx]) continue;
        visited[vIdx] = 1;

        if (isBackground(x, y)) {
            // Set pixel to transparent
            const idx = (y * w + x) * 4;
            data[idx + 3] = 0; // Alpha = 0

            // Add neighbors to queue
            queue.push({ x: x + 1, y });
            queue.push({ x: x - 1, y });
            queue.push({ x, y: y + 1 });
            queue.push({ x, y: y - 1 });
        }
    }

    // Optional: basic feathering / halo reduction
    // We can do another pass and make pixels bordering transparent pixels slightly translucent
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            if (data[idx + 3] === 255) { // If solid
                // Check neighbors
                const n1 = ((y - 1) * w + x) * 4 + 3;
                const n2 = ((y + 1) * w + x) * 4 + 3;
                const n3 = (y * w + x - 1) * 4 + 3;
                const n4 = (y * w + x + 1) * 4 + 3;
                if (data[n1] === 0 || data[n2] === 0 || data[n3] === 0 || data[n4] === 0) {
                    data[idx + 3] = 120; // Semi-transparent edge
                }
            }
        }
    }

    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
        .png()
        .toFile(outputPath);
    console.log('Saved to:', outputPath);
}

const input = path.join(__dirname, '../photos/logo/logo.jpg');
const output = path.join(__dirname, '../public/images/milan_logo_transparent.png');

removeWhiteBackground(input, output).catch(console.error);
