export const bunny = {
    /**
     * Uploads an image to Bunny.net Storage Zone.
     */
    uploadToStorage: async (buffer: Buffer, fileName: string) => {
        const storageZone = process.env.BUNNY_STORAGE_ZONE;
        const accessKey = process.env.BUNNY_STORAGE_API_KEY;
        const pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL;

        if (!storageZone || !accessKey || !pullZoneUrl) {
            throw new Error('Bunny.net Storage credentials missing in .env');
        }

        const url = `https://storage.bunnycdn.com/${storageZone}/${fileName}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                AccessKey: accessKey,
                'Content-Type': 'application/octet-stream',
            },
            body: buffer as any,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Bunny Storage Upload Failed: ${errorText}`);
        }

        return `${pullZoneUrl}/${fileName}`;
    },

    /**
     * Uploads a video to Bunny.net Stream (transcoding + HLS/Dash).
     */
    uploadToStream: async (buffer: Buffer, title: string) => {
        const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
        const accessKey = process.env.BUNNY_STREAM_API_KEY;

        if (!libraryId || !accessKey) {
            throw new Error('Bunny.net Stream credentials missing in .env');
        }

        // 1. Create Video Object in Bunny Stream
        const createUrl = `https://video.bunnycdn.com/library/${libraryId}/videos`;
        const createResponse = await fetch(createUrl, {
            method: 'POST',
            headers: {
                AccessKey: accessKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (!createResponse.ok) {
            throw new Error('Failed to create video object in Bunny Stream');
        }

        const videoData = await createResponse.json();
        const videoId = videoData.guid;

        // 2. Upload Video Binary
        const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                AccessKey: accessKey,
            },
            body: buffer as any,
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload video binary to Bunny Stream');
        }

        return videoId;
    },

    /**
     * Generates the iframe embed URL for a given video ID.
     */
    getStreamUrl: (videoId: string) => {
        const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
        return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
    },

    /**
     * Generates the thumbnail URL for a given video ID on Bunny Stream.
     */
    getThumbnailUrl: (videoId: string) => {
        const pullZone = process.env.BUNNY_STREAM_PULL_ZONE || 'vz-7429188d-681.b-cdn.net';
        return `https://${pullZone}/${videoId}/thumbnail.jpg`;
    }
};
