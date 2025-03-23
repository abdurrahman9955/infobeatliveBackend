import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const MY_S3_ACCESS_KEY =  process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY =  process.env.MY_S3_ACCESS_KEY!;
const MY_S3_REGION = 'us-east-1'

//MY_S3_ACCESS_KEY=AKIAWPPO6DV26J45T2U7
//AWS_SECRET_ACCESS_KEY=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


const s3 = new S3Client({
  region:MY_S3_REGION,
  credentials: {
    accessKeyId:MY_S3_ACCESS_KEY,
    secretAccessKey:MY_S3_SECRET_KEY,
  },
});

export default s3;
