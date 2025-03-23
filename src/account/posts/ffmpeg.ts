import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { io } from '../../app';

const execPromise = promisify(exec);

export const processVideo = async (
  videoBuffer: Buffer,
  originalFilename: string, roomId:string
): Promise<{ videoBuffer: Buffer; thumbnailBuffer: Buffer }> => {
  io.to(roomId).emit('post-upload-progress', { progress: 23 });
  const fileExtension = path.extname(originalFilename);
  io.to(roomId).emit('post-upload-progress', { progress: 25 });
  const inputFile = path.join(process.cwd(), `input-${Date.now()}${fileExtension}`);
  const outputFile = path.join(process.cwd(), `output-${Date.now()}.mp4`);
  const thumbnailFile = path.join(process.cwd(), `thumbnail-${Date.now()}.jpeg`);
  io.to(roomId).emit('post-upload-progress', { progress: 27 });

  // Save the video to a temporary file
  fs.writeFileSync(inputFile, videoBuffer);
  io.to(roomId).emit('post-upload-progress', { progress: 29 });

  try {
    // FFmpeg command to process the video
    io.to(roomId).emit('post-upload-progress', { progress: 30 });
    const ffmpegCommand = `
     ffmpeg -i "${inputFile}" \
     -c:v libx264 -crf 20 -preset slow \
     -c:a aac -b:a 256k -movflags +faststart \
     "${outputFile}"`;

     io.to(roomId).emit('post-upload-progress', { progress: 35 });

    await execPromise(ffmpegCommand);
    io.to(roomId).emit('post-upload-progress', { progress: 53 });

    // FFmpeg command to extract the thumbnail at the 10-second mark
    const ffmpegThumbnailCommand = `
      ffmpeg -i "${inputFile}" -ss 5 -frames:v 1 "${thumbnailFile}"
    `;
    io.to(roomId).emit('post-upload-progress', { progress: 56 });
    await execPromise(ffmpegThumbnailCommand);
    io.to(roomId).emit('post-upload-progress', { progress: 58 });

    // Read the processed video and thumbnail buffers
    const processedVideoBuffer = fs.readFileSync(outputFile);
    const thumbnailBuffer = fs.readFileSync(thumbnailFile);
    io.to(roomId).emit('post-upload-progress', { progress: 60 });

    // Clean up temporary files
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);
    fs.unlinkSync(thumbnailFile);
    io.to(roomId).emit('post-upload-progress', { progress: 63 });

    return { videoBuffer: processedVideoBuffer, thumbnailBuffer };
  } catch (error) {
    console.error('Error processing video:', error);
    throw new Error('Video processing failed');
  }
};

// export const processVideo = async (
//   videoBuffer: Buffer,
//   originalFilename: string
// ): Promise<{ [key: string]: Buffer; thumbnailBuffer: Buffer }> => {
//   const resolutions = [
//     { name: '240p', width: 426, height: 240 },
//     { name: '360p', width: 640, height: 360 },
//     { name: '480p', width: 854, height: 480 },
//     { name: '720p', width: 1280, height: 720 },
//     { name: '1024p', width: 1920, height: 1080 },
//   ];

//   const fileExtension = path.extname(originalFilename);
//   const inputFile = path.join(process.cwd(), `input-${Date.now()}${fileExtension}`);
//   const thumbnailFile = path.join(process.cwd(), `thumbnail-${Date.now()}.jpeg`);

//   fs.writeFileSync(inputFile, videoBuffer);

//   const videoBuffers: { [key: string]: Buffer } = {};

//   try {
//     for (const resolution of resolutions) {
//       const outputFile = path.join(
//         process.cwd(),
//         `output-${resolution.name}-${Date.now()}.mp4`
//       );
//       const ffmpegCommand = `
//         ffmpeg -i "${inputFile}" \
//         -vf "scale=${resolution.width}:${resolution.height}" \
//         -c:v libx264 -crf 20 -preset slow \
//         -c:a aac -b:a 128k -movflags +faststart \
//         "${outputFile}"
//       `;
//       await execPromise(ffmpegCommand);
//       videoBuffers[resolution.name] = fs.readFileSync(outputFile);
//       fs.unlinkSync(outputFile);
//     }

//     const ffmpegThumbnailCommand = `
//       ffmpeg -i "${inputFile}" -ss 5 -vf "scale=1280:720" -frames:v 1 "${thumbnailFile}"
//     `;
//     await execPromise(ffmpegThumbnailCommand);
//     const thumbnailBuffer = fs.readFileSync(thumbnailFile);

//     fs.unlinkSync(inputFile);
//     fs.unlinkSync(thumbnailFile);

//     return { ...videoBuffers, thumbnailBuffer };
//   } catch (error) {
//     console.error('Error processing video:', error);
//     throw new Error('Video processing failed');
//   }
// };
