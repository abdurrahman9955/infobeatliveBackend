// import { S3Client } from '@aws-sdk/client-s3';
// import dotenv from 'dotenv';

// dotenv.config();

// dotenv.config({ path: '../../../../../backend/.env' });


// const MY_S3_REGION = process.env.MY_S3_REGION!;

// const s3 = new S3Client({
//   region:MY_S3_REGION,
// });

// export default s3;


import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config({ path: '../../../../../backend/.env' });

const s3 = new S3Client({
  region: process.env.MY_DO_S3_REGION!,
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
  forcePathStyle: false,
});

export default s3;
