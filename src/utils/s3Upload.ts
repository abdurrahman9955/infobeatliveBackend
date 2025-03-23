import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from './amazonS3';
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner'; // Corrected import
import dotenv from "dotenv";

dotenv.config();

const MY_S3_REGION = 'us-east-1'
const MY_S3_BUCKET_NAME  =  'infobeatlivebucket'


export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> => {
  const params = {
    Bucket: MY_S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return `https://${MY_S3_BUCKET_NAME}.s3.${MY_S3_REGION}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (key: string) => {
  const deleteParams = {
    Bucket:MY_S3_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3.send(command);
};

export const getSignedUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: MY_S3_BUCKET_NAME,
    Key: key,
  });

  return getPresignedUrl(s3, command, { expiresIn: 60 * 60 }); // URL valid for 1 hour
};