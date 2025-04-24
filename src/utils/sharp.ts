// import sharp from 'sharp';

// interface ImageOptions {
//   width?: number;
//   height?: number;
//   quality?: number;
// }

// export const processImages = async (buffer: Buffer, options: ImageOptions = {}): Promise<Buffer> => {
//   const {  quality = 95 } = options;

//   try {
//     const processedBuffer = await sharp(buffer)
//       .resize({
//         kernel: sharp.kernel.lanczos3,
//         fit: sharp.fit.cover,
//         position: sharp.strategy.entropy,
//       })
//       .toFormat('jpeg', {
//         quality,
//         nearLossless: true,
//       })
//       .withMetadata()
//       .toBuffer();

//     return processedBuffer;
//   } catch (error) {
//     console.error('Error processing image:', error);
//     throw new Error('Failed to process the image.');
//   }
// };

import gm from 'gm';

interface ImageOptions {
  width?:  any;
  height?: any;
  quality?: number;
}

export const processImage = async (buffer: Buffer, options: ImageOptions = {}): Promise<Buffer> => {
  const { quality = 95 } = options;

  return new Promise((resolve, reject) => {
    gm(buffer)
      .resize(options.width || 'auto', options.height || 'auto')
      .quality(quality)
      .setFormat('jpeg')
      .toBuffer('jpeg', (err, processedBuffer) => {
        if (err) {
          console.error('Error processing image:', err);
          reject(new Error('Failed to process the image.'));
        } else {
          resolve(processedBuffer);
        }
      });
  });
};
