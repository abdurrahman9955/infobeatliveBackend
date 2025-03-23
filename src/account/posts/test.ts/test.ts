// export const createPost = async (req: Request, res: Response) => {
//   try {
//     const { title, description, type } = req.body;
//     const file = req.file;

//     if (!title || !description || !type) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     if (!['VIDEO', 'IMAGE', 'TEXT'].includes(type)) {
//       return res.status(400).json({ message: 'Invalid post type' });
//     }

//     const uniqueFilename = uuidv4();
//     const userId = req.headers['user-id'] as string;

//     let thumbnailUrl: string | undefined;

//     const post = await prisma.post.create({
//       data: {
//         title,
//         description,
//         type,
//         thumbnailUrl: null, // Temporarily null, will update later if needed
//         userId,
//       },
//     });

//     if (type === 'VIDEO' && file) {
//       const processedVideo = await processVideo(file.buffer, file.originalname);

//       for (const resolution in processedVideo) {
//         if (resolution === 'thumbnailBuffer') {
//           const thumbnailKey = `thumbnails/${userId}/${uniqueFilename}-${Date.now()}.jpeg`;
//           thumbnailUrl = await uploadToS3(processedVideo[resolution], thumbnailKey, 'image/jpeg');

//           // Update the post with the thumbnail URL
//           await prisma.post.update({
//             where: { id: post.id },
//             data: { thumbnailUrl },
//           });
//         } else {
//           const videoKey = `videos/${userId}/${uniqueFilename}-${resolution}-${Date.now()}.mp4`;
//           const videoUrl = await uploadToS3(processedVideo[resolution], videoKey, 'video/mp4');

//           // Create a VideoResolution entry
//           await prisma.videoResolution.create({
//             data: {
//               resolution,
//               url: videoUrl,
//               postId: post.id,
//             },
//           });
//         }
//       }
//     } else if (type === 'IMAGE' && file) {
//       const processedImage = await processImage(file.buffer);
//       const key = `images/${userId}/${uniqueFilename}-${Date.now()}-${file.originalname}`;
//       thumbnailUrl = await uploadToS3(processedImage, key, 'image/jpeg');

//       // Update the post with the thumbnail URL
//       await prisma.post.update({
//         where: { id: post.id },
//         data: { thumbnailUrl },
//       });
//     } else if (type === 'TEXT') {
//       // Text posts don't have associated content, so nothing extra to process
//     } else {
//       return res.status(400).json({ message: 'Invalid or missing file' });
//     }

//     res.status(201).json({ message: 'Post created successfully', post });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json({ message: 'An error occurred while creating the post' });
//   }
// };