import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config({ path: '../../../../../backend/.env' });


const MY_S3_REGION = process.env.MY_S3_REGION!;

const s3 = new S3Client({
  region:MY_S3_REGION,
});

export default s3;
