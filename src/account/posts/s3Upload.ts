// import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// import s3 from './amazonS3';
// import path from 'path';


// const MY_S3_REGION = process.env.MY_S3_REGION!;
// const MY_S3_BUCKET_NAME  =  process.env.S3_BUCKET_NAME!;


// export const uploadToS3 = async (
//   buffer: Buffer,
//   key: string,
//   mimeType: string
// ): Promise<string> => {
//   const params = {
//     Bucket: MY_S3_BUCKET_NAME!,
//     Key: key,
//     Body: buffer,
//     ContentType: mimeType,
//   };

//   const command = new PutObjectCommand(params);
//   await s3.send(command);

//   return `https://${MY_S3_BUCKET_NAME}.s3.${MY_S3_REGION}.amazonaws.com/${key}`;
// };

// export const deleteFromS3 = async (key: string) => {
//   const deleteParams = {
//     Bucket:MY_S3_BUCKET_NAME!,
//     Key: key,
//   };

//   const command = new DeleteObjectCommand(deleteParams);
//   await s3.send(command);
// };


import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from './amazonS3';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config({ path: '../../../../../backend/.env' });

const MY_DO_S3_BUCKET_NAME = process.env.MY_DO_S3_BUCKET_NAME!;
const MY_DO_S3_REGION = process.env.MY_DO_S3_REGION!;

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> => {
  const params = {
    Bucket: MY_DO_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params as any);
  await s3.send(command);

  // DigitalOcean Spaces URL format
  return `https://${MY_DO_S3_BUCKET_NAME}.${MY_DO_S3_REGION}.cdn.digitaloceanspaces.com/${key}`;

};

export const deleteFromS3 = async (key: string) => {
  const deleteParams = {
    Bucket:MY_DO_S3_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3.send(command);
};

