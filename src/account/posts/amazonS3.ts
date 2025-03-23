import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config({ path: '../../../../../backend/.env' });


const MY_S3_ACCESS_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_REGION = 'us-east-1'

const s3 = new S3Client({
  region:MY_S3_REGION,
  credentials: {
    accessKeyId:MY_S3_ACCESS_KEY,
    secretAccessKey:MY_S3_SECRET_KEY,
  },
});

export default s3;
