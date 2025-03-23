import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { io } from '../app';

const execPromise = promisify(exec);

export const processVideo = async (
  videoBuffer: Buffer,
  originalFilename: string,RoomId: string
): Promise<{
  videoBuffers: { [resolution: string]: Buffer };
  thumbnailBuffer: Buffer;
  availableResolutions: string[];
}> => {
  const fileExtension = path.extname(originalFilename);
  const inputFile = path.join(process.cwd(), `input-${Date.now()}${fileExtension}`);
  const thumbnailFile = path.join(process.cwd(), `thumbnail-${Date.now()}.jpeg`);
  io.to(RoomId).emit('post-upload-progress', { progress: 25 });

  // Save the video to a temporary file
  fs.writeFileSync(inputFile, videoBuffer);
  io.to(RoomId).emit('post-upload-progress', { progress: 30 });

  try {
    // Get the video's resolution using FFmpeg
    const ffmpegInfoCommand = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${inputFile}"`;
    io.to(RoomId).emit('post-upload-progress', { progress: 33 });
    const { stdout: resolutionInfo } = await execPromise(ffmpegInfoCommand);
    io.to(RoomId).emit('post-upload-progress', { progress: 36 });


    const [width, height] = resolutionInfo.split(',').map(Number);
    const originalResolution = Math.min(width, height);
    io.to(RoomId).emit('post-upload-progress', { progress: 38 });

    // Define the resolutions to process
    const resolutions = [240, 360, 480, 720, 1080];
    const availableResolutions = resolutions
      .filter((res) => res <= originalResolution)
      .map((res) => `${res}p`); // Convert to string format with "p"
      io.to(RoomId).emit('post-upload-progress', { progress: 40 });

    const videoBuffers: { [resolution: string]: Buffer } = {};
    io.to(RoomId).emit('post-upload-progress', { progress: 42 });

    for (const resolution of availableResolutions) {
      const outputFile = path.join(
        process.cwd(),
        `output-${resolution}-${Date.now()}.mp4`
      );
      io.to(RoomId).emit('post-upload-progress', { progress: 43 });
      // FFmpeg command to process the video at the target resolution
      const ffmpegCommand = `
        ffmpeg -i "${inputFile}" -vf "scale=-2:${parseInt(resolution)}" \
        -c:v libx264 -crf 20 -preset slow \
        -c:a aac -b:a 256k -movflags +faststart \
        "${outputFile}"
      `;
      io.to(RoomId).emit('post-upload-progress', { progress: 45 });
      await execPromise(ffmpegCommand);
      io.to(RoomId).emit('post-upload-progress', { progress: 50 });

      // Read the processed video buffer and store it in the videoBuffers object
      videoBuffers[resolution] = fs.readFileSync(outputFile);
      io.to(RoomId).emit('post-upload-progress', { progress: 52 });

      // Clean up temporary output file
      fs.unlinkSync(outputFile);
      io.to(RoomId).emit('post-upload-progress', { progress: 53 });
    }

    // FFmpeg command to extract the thumbnail
    const ffmpegThumbnailCommand = `
      ffmpeg -i "${inputFile}" -ss 5 -frames:v 1 "${thumbnailFile}"
    `;
    io.to(RoomId).emit('post-upload-progress', { progress: 55 });
    await execPromise(ffmpegThumbnailCommand);
    io.to(RoomId).emit('post-upload-progress', { progress: 57 });

    const thumbnailBuffer = fs.readFileSync(thumbnailFile);
    io.to(RoomId).emit('post-upload-progress', { progress: 58 });

    // Clean up temporary files
    fs.unlinkSync(inputFile);
    fs.unlinkSync(thumbnailFile);
    io.to(RoomId).emit('post-upload-progress', { progress: 60 });

    return { videoBuffers, thumbnailBuffer, availableResolutions };
  } catch (error) {
    console.error('Error processing video:', error);
    throw new Error('Video processing failed');
  }
};


export const processChatVideo = async (
  videoBuffer: Buffer,
  originalFilename: string, RoomId:string
  ): Promise<{ videoBuffer: Buffer; }> => {
  io.to(RoomId).emit('chats-upload-progress', { progress: 22 });
  const fileExtension = path.extname(originalFilename);
  const inputFile = path.join(process.cwd(), `input-${Date.now()}${fileExtension}`);
  const outputFile = path.join(process.cwd(), `output-${Date.now()}.mp4`);
  io.to(RoomId).emit('chats-upload-progress', { progress: 25 });

  // Save the video to a temporary file
  fs.writeFileSync(inputFile, videoBuffer);
  io.to(RoomId).emit('chats-upload-progress', { progress: 30 });

  try {
    // FFmpeg command to process the video
    const ffmpegCommand = `
     ffmpeg -i "${inputFile}" \
     -c:v libx264 -crf 20 -preset slow \
     -c:a aac -b:a 256k -movflags +faststart \
     "${outputFile}"`;

     io.to(RoomId).emit('chats-upload-progress', { progress: 35 });

    await execPromise(ffmpegCommand);
    io.to(RoomId).emit('chats-upload-progress', { progress: 53 });

    // Read the processed video and thumbnail buffers
    const processedVideoBuffer = fs.readFileSync(outputFile);
    io.to(RoomId).emit('chats-upload-progress', { progress: 57 });

    // Clean up temporary files
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);
    io.to(RoomId).emit('chats-upload-progress', { progress: 60 });

    return { videoBuffer: processedVideoBuffer };
  } catch (error) {
    console.error('Error processing video:', error);
    throw new Error('Video processing failed');
  }
};


export const processAudio = async (
  audioBuffer: Buffer,
  originalFilename: string, RoomId:string
): Promise<{ audioBuffer: Buffer; }> => {
  io.to(RoomId).emit('chats-upload-progress', { progress: 22 });
  const fileExtension = path.extname(originalFilename);
  const inputFile = path.join(process.cwd(), `input-${Date.now()}${fileExtension}`);
  const outputFile = path.join(process.cwd(), `output-${Date.now()}.mp3`); // Output as MP3 by default
  io.to(RoomId).emit('chats-upload-progress', { progress: 25 });
  // Save the audio buffer to a temporary file
  fs.writeFileSync(inputFile, audioBuffer);
  io.to(RoomId).emit('chats-upload-progress', { progress: 30 });

  try {
    // FFmpeg command to process the audio
    const ffmpegCommand = `
     ffmpeg -i "${inputFile}" \
     -vn -ar 44100 -ac 2 -b:a 192k \
     "${outputFile}"`;

    await execPromise(ffmpegCommand);
    io.to(RoomId).emit('chats-upload-progress', { progress: 50 });
    // Read the processed audio buffer
    const processedAudioBuffer = fs.readFileSync(outputFile);
    io.to(RoomId).emit('chats-upload-progress', { progress: 55 });

    // Clean up temporary files
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);
    io.to(RoomId).emit('chats-upload-progress', { progress: 60 });

    return { audioBuffer: processedAudioBuffer };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw new Error('Audio processing failed');
  }
};

// else if (type === ChatMessageType.DOCUMENT && file) {
//   // Convert document to PDF
//   const pdfBuffer = await convertToPdf(file.buffer, file.originalname);
//   const documentKey = `documents/${userId}/document/${uniqueFilename}/${Date.now()}-${file.originalname.replace(path.extname(file.originalname), '.pdf')}`;
//   contentUrl = await uploadToS3(pdfBuffer, documentKey, 'application/pdf');
// }

//sudo apt install libreoffice

 export  const convertToPdf = async (fileBuffer: Buffer, originalFilename: string): Promise<Buffer> => {
  const inputFilePath = path.join(process.cwd(), `input-${Date.now()}${path.extname(originalFilename)}`);
  const outputFilePath = path.join(process.cwd(), `output-${Date.now()}.pdf`);

  // Save the original file to a temporary location
  fs.writeFileSync(inputFilePath, fileBuffer);

  try {
    // Run the LibreOffice CLI command to convert the document to PDF
    const command = `libreoffice --headless --convert-to pdf --outdir ${process.cwd()} ${inputFilePath}`;
    await new Promise<void>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error during conversion: ${stderr || error}`);
        } else {
          resolve();
        }
      });
    });

    // Read the converted PDF buffer
    const pdfBuffer = fs.readFileSync(outputFilePath);

    // Clean up the temporary files
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(outputFilePath);

    return pdfBuffer;
  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Document processing failed');
  }
};