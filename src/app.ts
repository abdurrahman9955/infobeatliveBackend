// src/app.ts
import express from 'express';
import { createServer, ServerOptions } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config({ path: '../../backend/.env' });

import groupRouter from './group/createGroup/groupMain';
import groupAdminRouter from './group/admins/adminMain';
import groupIconRouter from './group/icon/iconMain';
import groupMembersRouter from './group/members/memberMain';
import groupPostRouter from './group/posts/routes';
import groupThumbnailRouter from './group/posts/thumbnail/router';
import groupChatRouter from './group/Chattings/router';
import groupComments from './group/media/comments/comments';
import groupSubComments from './group/media/subComments/subComments';
import groupThirdComments from './group/media/thirdComments/thirdComments';
import groupLikes from './group/media/likes/Posts';
import likeGroupComments from './group/media/likeComment/likeComments';
import likeGroupSubComments from './group/media/likeSubComment/likeSubComments';
import likeGroupThirdComments from './group/media/likeThirdComment/likeThirdComment';
import groupProgramRouter from './group/program/router';

import createClassRouter from './class/createClass/classMain';
import classAnnouncement from './class/announcement/announceRoute';
import classContactRouter from './class/contact/contactRoute';
import classFeedbackRouter from './class/feedback/feedbackRoute';
import classIconRouter from './class/icon/iconMain';
import classInstructorsRouter from './class/instructors/instructorMain';
import classStudentsRouter from './class/students/studentsMain';
import classPostRouter from './class/post/routes';
import classChatRouter from './class/Chattings/router';
import classThumbnailRouter from './class/post/thumbnail/router';
import classCourseRouter from './class/course/course/courseRoute';
import classCourseVideos from './class/course/media/routes';
import classCourseSection from './class/course/section/sectionRoute';

import classComments from './class/media/comments/comments';
import classSubComments from './class/media/subComments/subComments';
import classThirdComments from './class/media/thirdComments/thirdComments';
import classLikes from './class/media/likes/Posts';
import likeClassComments from './class/media/likeComment/likeComments';
import likeClassSubComments from './class/media/likeSubComment/likeSubComments';
import likeClassThirdComments from './class/media/likeThirdComment/likeThirdComment';

import classCourseComments from './class/course/mediaActions/comments/comments';
import classCourseSubComments from './class/course/mediaActions/subComments/subComments';
import classCourseThirdComments from './class/course/mediaActions/thirdComments/thirdComments';
import classCourseLikes from './class/course/mediaActions/likes/Posts';
import likeClassCourseComments from './class/course/mediaActions/likeComment/likeComments';
import likeClassCourseSubComments from './class/course/mediaActions/likeSubComment/likeSubComments';
import likeClassCourseThirdComments from './class/course/mediaActions/likeThirdComment/likeThirdComment';
import classLectureRouter from './class/lecture/router';
import classPayoutRouter from './class/payoutMethods/router';
import classPricingRouter from './class/pricing/router';
import classVerifyRouter from './class/verifyClass/router';
import classPaymentRouter from './class/payment/payment';

import createBootcampRouter from './bootcamp/createBootCamp/bootCampMain';
import bootcampContactRouter from './bootcamp/contact/contactRoute';
import bootcampFeedback from './bootcamp/feedback/feedbackRoute';
import bootcampIconRouter from './bootcamp/icon/iconMain';
import bootCampPostRouter from './bootcamp/posts/routes';
import bootCampThumbnailRouter from './bootcamp/posts/thumbnail/router';
import bootcampProgramRouter from './bootcamp/program/router';
import bootCampPayoutRouter from './bootcamp/payoutMethods/router';

import bootcampComment from './bootcamp/media/comments/comments';
import bootcampSubComment from './bootcamp/media/subComments/subComments';
import bootcampThirdComment from './bootcamp/media/thirdComments/thirdComments';
import likeBootcampMedia from './bootcamp/media/likes/Posts';
import likeBootcampComment from './bootcamp/media/likeComment/likeComments';
import likeBootcampSubComment from './bootcamp/media/likeSubComment/likeSubComments';
import likeBootcampThirdComment from './bootcamp/media/likeThirdComment/likeThirdComment';

import createBeginnerClass from './bootcamp/beginner_class/createClass/classMain';
import bootCampBeginnerChatRouter from './bootcamp/beginner_class/Chattings/router';
import bootcampBeginnerClassContact from './bootcamp/beginner_class/contact/contactRoute';
import bootcampBeginnerClassFeedback from './bootcamp/beginner_class/feedback/feedbackRoute';
import bootcampBeginnerClassIcon from './bootcamp/beginner_class/icon/iconMain';
import bootcampBeginnerClassInstructors from './bootcamp/beginner_class/instructors/instructorMain';
import bootCampBeginnerClassPostRouter from './bootcamp/beginner_class/post/routes';
import bootCampBeginnerClassThumbnailRouter from './bootcamp/beginner_class/post/thumbnail/router';
import bootcampClassStudentsRouter from './bootcamp/beginner_class/students/studentsMain';
import bootcampBeginnerLectureRouter from './bootcamp/beginner_class/lecture/router';
import bootCampBeginnerClassPricingRouter from './bootcamp/beginner_class/pricing/router';

import bootcampClassCourseRouter from './bootcamp/beginner_class/course/course/courseRoute';
import bootcampClassCourseSection from './bootcamp/beginner_class/course/section/sectionRoute';
import bootcampClassCourseVideos from './bootcamp/beginner_class/course/media/routes';

import bootcampClassComments from './bootcamp/beginner_class/media/comments/comments';
import bootcampClassSubComments from './bootcamp/beginner_class/media/subComments/subComments';
import bootcampClassThirdComments from './bootcamp/beginner_class/media/thirdComments/thirdComments';
import bootcampClassLikes from './bootcamp/beginner_class/media/likes/Posts';
import bootcampLikeClassComments from './bootcamp/beginner_class/media/likeComment/likeComments';
import likeBootcampClassThirdComments from './bootcamp/beginner_class/media/likeThirdComment/likeThirdComment';
import likeBootcampClassSubComments from './bootcamp/beginner_class/media/likeSubComment/likeSubComments';

import bootcampClassCourseComments from './bootcamp/beginner_class/course/mediaActions/comments/comments';
import bootcampClassCourseSubComments from './bootcamp/beginner_class/course/mediaActions/subComments/subComments';
import bootcampClassCourseThirdComments from './bootcamp/beginner_class/course/mediaActions/thirdComments/thirdComments';
import bootcampClassCourseLikes from './bootcamp/beginner_class/course/mediaActions/likes/Posts';
import likeBootcampClassCourseComments from './bootcamp/beginner_class/course/mediaActions/likeComment/likeComments';
import likeBootcampClassCourseSubComments from './bootcamp/beginner_class/course/mediaActions/likeSubComment/likeSubComments';
import likeBootcampClassCourseThirdComments from './bootcamp/beginner_class/course/mediaActions/likeThirdComment/likeThirdComment';

import createIntermediateClassRouter from './bootcamp/intermediate_class/createClass/classMain';
import bootCampIntermediateChatRouter from './bootcamp/intermediate_class/Chattings/router';
import bootcampIntermediateClassContact from './bootcamp/intermediate_class/contact/contactRoute';
import bootcampIntermediateClassFeedback from './bootcamp/intermediate_class/feedback/feedbackRoute';
import bootcampIntermediateClassIcon from './bootcamp/intermediate_class/icon/iconMain';
import bootcampIntermediateClassInstructors from './bootcamp/intermediate_class/instructors/instructorMain';
import bootcampIntermediateClassStudentsRouter from './bootcamp/intermediate_class/students/studentsMain';
import bootcampIntermediateLectureRouter from './bootcamp/intermediate_class/lecture/router';
import bootCampIntermediateClassPostRouter from './bootcamp/intermediate_class/post/routes';
import bootCampIntermediateClassThumbnailRouter from './bootcamp/intermediate_class/post/thumbnail/router';
import bootCampIntermediateClassPricingRouter from './bootcamp/intermediate_class/pricing/router';

import bootcampIntermediateClassCourseRouter from './bootcamp/intermediate_class/course/course/courseRoute';
import bootcampIntermediateClassCourseSection from './bootcamp/intermediate_class/course/section/sectionRoute';
import bootcampIntermediateClassCourseVideos from './bootcamp/intermediate_class/course/media/routes';

import bootcampIntermediateClassComments from './bootcamp/intermediate_class/media/comments/comments';
import bootcampIntermediateClassSubComments from './bootcamp/intermediate_class/media/subComments/subComments';
import bootcampIntermediateClassThirdComments from './bootcamp/intermediate_class/media/thirdComments/thirdComments';
import bootcampIntermediateClassLikes from './bootcamp/intermediate_class/media/likes/Posts';
import bootcampIntermediateLikeClassComments from './bootcamp/intermediate_class/media/likeComment/likeComments';
import likeBootcampIntermediateClassSubComments from './bootcamp/intermediate_class/media/likeSubComment/likeSubComments';
import likeBootcampIntermediateClassThirdComments from './bootcamp/intermediate_class/media/likeThirdComment/likeThirdComment';

import bootcampIntermediateClassCourseComments from './bootcamp/intermediate_class/media/comments/comments';
import bootcampIntermediateClassCourseSubComments from './bootcamp/intermediate_class/course/mediaActions/subComments/subComments';
import bootcampIntermediateClassCourseThirdComments from './bootcamp/intermediate_class/course/mediaActions/thirdComments/thirdComments';
import bootcampIntermediateClassCourseLikes from './bootcamp/intermediate_class/course/mediaActions/likes/Posts';
import likeBootcampIntermediateClassCourseComments from './bootcamp/intermediate_class/course/mediaActions/likeComment/likeComments';
import likeBootcampIntermediateClassCourseSubComments from './bootcamp/intermediate_class/course/mediaActions/likeSubComment/likeSubComments';
import likeBootcampIntermediateClassCourseThirdComments from './bootcamp/intermediate_class/course/mediaActions/likeThirdComment/likeThirdComment';

import createAdvanceClassRouter from './bootcamp/advance_class/createClass/classMain';
import bootCampAdvanceChatRouter from './bootcamp/advance_class/Chattings/router';
import bootcampAdvanceClassContact from './bootcamp/advance_class/contact/contactRoute';
import bootcampAdvanceClassFeedback from './bootcamp/advance_class/feedback/feedbackRoute';
import bootcampAdvanceClassIcon from './bootcamp/advance_class/icon/iconMain';
import bootcampAdvanceClassInstructors from './bootcamp/advance_class/instructors/instructorMain';
import bootcampAdvanceClassStudentsRouter from './bootcamp/advance_class/students/studentsMain';
import bootcampAdvanceLectureRouter from './bootcamp/advance_class/lecture/router';
import bootCampAdvanceClassPostRouter from './bootcamp/advance_class/post/routes';
import bootCampAdvanceClassThumbnailRouter from './bootcamp/advance_class/post/thumbnail/router';
import bootcampAdvanceClassCourseRouter from './bootcamp/advance_class/course/course/courseRoute';
import bootcampAdvanceClassCourseSection from './bootcamp/advance_class/course/section/sectionRoute';
import bootcampAdvanceClassCourseVideos from './bootcamp/advance_class/course/media/routes';
import bootCampAdvanceClassPricingRouter from './bootcamp/advance_class/pricing/router';

import bootcampAdvanceClassComments from './bootcamp/advance_class/media/comments/comments';
import bootcampAdvanceClassSubComments from './bootcamp/advance_class/media/subComments/subComments';
import bootcampAdvanceClassThirdComments from './bootcamp/advance_class/media/thirdComments/thirdComments';
import bootcampAdvanceClassLikes from './bootcamp/advance_class/media/likes/Posts';
import bootcampAdvanceLikeClassComments from './bootcamp/advance_class/media/likeComment/likeComments';
import likeBootcampAdvanceClassSubComments from './bootcamp/advance_class/media/likeSubComment/likeSubComments';
import likeBootcampAdvanceClassThirdComments from './bootcamp/advance_class/media/likeThirdComment/likeThirdComment';

import bootcampAdvanceClassCourseComments from './bootcamp/advance_class/course/mediaActions/comments/comments';
import bootcampAdvanceClassCourseSubComments from './bootcamp/advance_class/course/mediaActions/subComments/subComments';
import bootcampAdvanceClassCourseThirdComments from './bootcamp/advance_class/course/mediaActions/thirdComments/thirdComments';
import bootcampAdvanceClassCourseLikes from './bootcamp/advance_class/course/mediaActions/likes/Posts';
import likeBootcampAdvanceClassCourseComments from './bootcamp/advance_class/course/mediaActions/likeComment/likeComments';
import likeBootcampAdvanceClassCourseSubComments from './bootcamp/advance_class/course/mediaActions/likeSubComment/likeSubComments';
import likeBootcampAdvanceClassCourseThirdComments from './bootcamp/advance_class/course/mediaActions/likeThirdComment/likeThirdComment';
import bootcampVerifyRouter from './bootcamp/verifyBootCamp/router';
import academyClassPaymentRouter from './bootcamp/payment/payment';


import registerRoutes from './account/auth/register/route';
import loginRoutes from './account/auth/login/route';
import resetPasswordRouter from './account/auth/forgotPassword/route';
import logoutRoute from './account/auth/logout/logout';
import routerOtpVerification from './account/auth/verify/verifyRegister';
import routerOtpLogin from './account/auth/verify/verifyLogin';
import routerOtpReset from './account/auth/verify/verifyResetPassword';
import getCurrentUser from './account/auth/getUserDetails/UserDetails';
import checkUserId from './account/auth/getUserDetails/UsersId';
import postRouter from './account/posts/routes';
import bannerRoutes from './account/profile/banner';

import contactRouter from './account/contact/contactRoute';
import feedbackRouter from './account/feedback/feedbackRoute';
import profileRoutes from './account/profile/profile';
import followers from './account/followers/followers';
import following from './account/following/following';
import rePostRouter from './account/rePost/repostMain';

import comments from './account/comments/comments';
import subComments from './account/subComments/subComments';
import thirdComments from './account/thirdComments/thirdComments';
import userChatRouter from './account/chatting/router';
import likes from './account/likes/Posts';
import likeComments from './account/likeComment/likeComments';
import likeSubComments from './account/likeSubComment/likeSubComments';
import likeThirdComments from './account/likeThirdComment/likeThirdComment';
import userSupportChatRouter from './account/support/router';
import googleRouter from './account/auth/googleAuth/google';
import routerHealth from './health/health';
import prisma from './utils/prisma';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import {RedisStore} from "connect-redis"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'https://www.infobeatlive.com' || origin === 'https://infobeatlive.com') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});


// Logging and cookie parsing
app.use(morgan('combined'));
app.use(cookieParser());

// const redisHost = process.env.REDIS_HOST!;

// const pubClient = createClient({ url:`redis://${redisHost}:6379` });
// const subClient = pubClient.duplicate();

// const redisClient = createClient({ url:`redis://${redisHost}:6379`});
// redisClient.connect().catch(console.error);

const redisOptions = {
  username: 'default',
  password: 'nsaJjlEOc17qOFZUxJJWQWsrsjxRVxno',
  socket: {
    host: 'redis-19147.c39206.us-east-1-mz.ec2.cloud.rlrcp.com',
    port: 19147,
  },
};

const pubClient = createClient(redisOptions);
const subClient = pubClient.duplicate();

const redisClient = createClient(redisOptions);
(async () => {
  await redisClient.connect().catch(console.error);
})();

const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "session:", 
});

app.use(
  session({
    store: sessionStore, 
    secret: process.env.SESSION_SECRET! as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

prisma
  .$connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err: any) => {
    console.error('Error connecting to the database', err);
  });

const server = createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*', 
  },
});

app.use('/health', routerHealth);
app.use('/account/auth/register', registerRoutes);
app.use('/account/auth/login', loginRoutes);
app.use('/account/auth/forgotPassword', resetPasswordRouter);
app.use('/account/auth/verify', routerOtpVerification);
app.use('/account/auth/verify', routerOtpLogin);
app.use('/account/auth/verify', routerOtpReset);
app.use('/account/auth/getUserDetails', getCurrentUser);
app.use('/account/auth/getUserDetails', checkUserId);
app.use('/account/auth/googleAuth', googleRouter);

app.use('/account/posts/routes', postRouter);
app.use('/account/contact', contactRouter);
app.use('/account/chatting', userChatRouter);
app.use('/account/support', userSupportChatRouter);
app.use('/account/feedback', feedbackRouter);
app.use('/account/followers', followers);
app.use('/account/following', following);
app.use('/account/profile', profileRoutes);
app.use('/account/rePost', rePostRouter);
app.use('/account/profile', bannerRoutes);

app.use('/account/comments', comments);
app.use('/account/subComments', subComments);
app.use('/account/thirdComments', thirdComments);

app.use('/account/likes', likes);
app.use('/account/likeComment', likeComments);
app.use('/account/likeSubComment', likeSubComments);
app.use('/account/likeThirdComment', likeThirdComments);

app.use('/group/createGroup', groupRouter);
app.use('/group/admins', groupAdminRouter);
app.use('/group/icon', groupIconRouter);
app.use('/group/members', groupMembersRouter);
app.use('/group/chats', groupChatRouter);
app.use('/group/posts', groupPostRouter);
app.use('/group/posts/thumbnail', groupThumbnailRouter);
app.use('/group/media/comments', groupComments);
app.use('/group/media/subComments', groupSubComments);
app.use('/group/media/thirdComments', groupThirdComments);
app.use('/group/media/likes', groupLikes);
app.use('/group/media/likeComment', likeGroupComments);
app.use('/group/media/likeSubComment', likeGroupSubComments);
app.use('/group/media/likeThirdComment', likeGroupThirdComments);
app.use('/group/program', groupProgramRouter);

app.use('/class/createClass', createClassRouter);
app.use('/class/contact', classContactRouter);
app.use('/class/feedback', classFeedbackRouter);
app.use('/class/icon', classIconRouter);
app.use('/class/instructors', classInstructorsRouter);
app.use('/class/students', classStudentsRouter);
app.use('/class/post', classPostRouter);
app.use('/class/post/thumbnail', classThumbnailRouter);
app.use('/class/Chattings', classChatRouter);
app.use('/class/course', classCourseRouter);
app.use('/class/course', classCourseVideos );
app.use('/class/course', classCourseSection);
app.use('/class/lecture', classLectureRouter);
app.use('/class/payoutMethods', classPayoutRouter);
app.use('/class/pricing', classPricingRouter);

app.use('/class/media/comments', classComments);
app.use('/class/media/subComments', classSubComments);
app.use('/class/media/thirdComments', classThirdComments);
app.use('/class/media/likes', classLikes);
app.use('/class/media/likeComment', likeClassComments);
app.use('/class/media/likeSubComment', likeClassSubComments);
app.use('/class/media/likeThirdComment', likeClassThirdComments);

app.use('/class/course/mediaActions/comments', classCourseComments);
app.use('/class/course/mediaActions/subComments', classCourseSubComments);
app.use('/class/course/mediaActions/thirdComments', classCourseThirdComments);
app.use('/class/course/mediaActions/likes', classCourseLikes);
app.use('/class/course/mediaActions/likeComment', likeClassCourseComments);
app.use('/class/course/mediaActions/likeSubComment', likeClassCourseSubComments);
app.use('/class/course/mediaActions/likeThirdComment', likeClassCourseThirdComments);
app.use('/class/verifyClass', classVerifyRouter);
app.use('/class/payment', classPaymentRouter);


app.use('/bootcamp/createBootCamp', createBootcampRouter);
app.use('/bootcamp/contact', bootcampContactRouter);
app.use('/bootcamp/feedback', bootcampFeedback);
app.use('/bootcamp/icon', bootcampIconRouter);
app.use('/bootcamp/posts', bootCampPostRouter);
app.use('/bootcamp/posts/thumbnail', bootCampThumbnailRouter);
app.use('/bootcamp/program', bootcampProgramRouter);
app.use('/bootcamp/payoutMethods', bootCampPayoutRouter);

app.use('/bootcamp/media/comments', bootcampComment);
app.use('/bootcamp/media/subComments', bootcampSubComment);
app.use('/bootcamp/media/thirdComments', bootcampThirdComment);
app.use('/bootcamp/media/likes', likeBootcampMedia);
app.use('/bootcamp/media/likeComment', likeBootcampComment);
app.use('/bootcamp/media/likeSubComment', likeBootcampSubComment);
app.use('/bootcamp/media/likeThirdComment', likeBootcampThirdComment);

app.use('/bootcamp/beginner_class/createClass', createBeginnerClass);
app.use('/bootcamp/beginner_class/Chattings', bootCampBeginnerChatRouter);
app.use('/bootcamp/beginner_class/contact', bootcampBeginnerClassContact);
app.use('/bootcamp/beginner_class/feedback', bootcampBeginnerClassFeedback);
app.use('/bootcamp/beginner_class/icon', bootcampBeginnerClassIcon);
app.use('/bootcamp/beginner_class/instructors', bootcampBeginnerClassInstructors);
app.use('/bootcamp/beginner_class/post', bootCampBeginnerClassPostRouter);
app.use('/bootcamp/beginner_class/post/thumbnail', bootCampBeginnerClassThumbnailRouter);
app.use('/bootcamp/beginner_class/students', bootcampClassStudentsRouter);
app.use('/bootcamp/beginner_class/lecture', bootcampBeginnerLectureRouter);
app.use('/bootcamp/beginner_class/course/course', bootcampClassCourseRouter);
app.use('/bootcamp/beginner_class/course/section', bootcampClassCourseSection);
app.use('/bootcamp/beginner_class/course/media', bootcampClassCourseVideos);
app.use('/bootcamp/beginner_class/media/comments', bootcampClassComments);
app.use('/bootcamp/beginner_class/media/subComments', bootcampClassSubComments);
app.use('/bootcamp/beginner_class/media/thirdComments', bootcampClassThirdComments);
app.use('/bootcamp/beginner_class/media/likes', bootcampClassLikes);
app.use('/bootcamp/beginner_class/media/likeComment', bootcampLikeClassComments);
app.use('/bootcamp/beginner_class/media/likeSubComment', likeBootcampClassSubComments);
app.use('/bootcamp/beginner_class/media/likeThirdComment', likeBootcampClassThirdComments);
app.use('/bootcamp/beginner_class/course/mediaActions/comments', bootcampClassCourseComments);
app.use('/bootcamp/beginner_class/course/mediaActions/subComments', bootcampClassCourseSubComments);
app.use('/bootcamp/beginner_class/course/mediaActions/thirdComments', bootcampClassCourseThirdComments);
app.use('/bootcamp/beginner_class/course/mediaActions/likes', bootcampClassCourseLikes);
app.use('/bootcamp/beginner_class/course/mediaActions/likeComment', likeBootcampClassCourseComments);
app.use('/bootcamp/beginner_class/course/mediaActions/likeSubComment', likeBootcampClassCourseSubComments);
app.use('/bootcamp/beginner_class/course/mediaActions/likeThirdComment', likeBootcampClassCourseThirdComments);
app.use('/bootcamp/beginner_class/pricing', bootCampBeginnerClassPricingRouter);

app.use('/bootcamp/intermediate_class/createClass', createIntermediateClassRouter);
app.use('/bootcamp/intermediate_class/Chattings', bootCampIntermediateChatRouter);
app.use('/bootcamp/intermediate_class/contact', bootcampIntermediateClassContact);
app.use('/bootcamp/intermediate_class/feedback', bootcampIntermediateClassFeedback);
app.use('/bootcamp/intermediate_class/course/course', bootcampIntermediateClassCourseRouter);
app.use('/bootcamp/intermediate_class/course/section',bootcampIntermediateClassCourseSection);
app.use('/bootcamp/intermediate_class/course/media', bootcampIntermediateClassCourseVideos);
app.use('/bootcamp/intermediate_class/icon', bootcampIntermediateClassIcon);
app.use('/bootcamp/intermediate_class/instructions',bootcampIntermediateClassInstructors);
app.use('/bootcamp/intermediate_class/lecture', bootcampIntermediateLectureRouter);
app.use('/bootcamp/intermediate_class/post', bootCampIntermediateClassPostRouter);
app.use('/bootcamp/intermediate_class/post/thumbnail', bootCampIntermediateClassThumbnailRouter)
app.use('/bootcamp/intermediate_class/students', bootcampIntermediateClassStudentsRouter);
app.use('/bootcamp/intermediate_class/media/comments', bootcampIntermediateClassComments);
app.use('/bootcamp/intermediate_class/media/subComments', bootcampIntermediateClassSubComments);
app.use('/bootcamp/intermediate_class/media/thirdComments', bootcampIntermediateClassThirdComments);
app.use('/bootcamp/intermediate_class/media/likes', bootcampIntermediateClassLikes);
app.use('/bootcamp/intermediate_class/media/likeComment', bootcampIntermediateLikeClassComments);
app.use('/bootcamp/intermediate_class/media/likeSubComment', likeBootcampIntermediateClassSubComments);
app.use('/bootcamp/intermediate_class/media/likeThirdComment', likeBootcampIntermediateClassThirdComments);
app.use('/bootcamp/intermediate_class/course/mediaActions/comments', bootcampIntermediateClassCourseComments);
app.use('/bootcamp/intermediate_class/course/mediaActions/subComments', bootcampIntermediateClassCourseSubComments);
app.use('/bootcamp/intermediate_class/course/mediaActions/thirdComments', bootcampIntermediateClassCourseThirdComments);
app.use('/bootcamp/intermediate_class/course/mediaActions/likes', bootcampIntermediateClassCourseLikes);
app.use('/bootcamp/intermediate_class/course/mediaActions/likeComment', likeBootcampIntermediateClassCourseComments);
app.use('/bootcamp/intermediate_class/course/mediaActions/likeSubComment', likeBootcampIntermediateClassCourseSubComments);
app.use('/bootcamp/intermediate_class/course/mediaActions/likeThirdComment', likeBootcampIntermediateClassCourseThirdComments);
app.use('/bootcamp/intermediate_class/pricing', bootCampIntermediateClassPricingRouter );

app.use('/bootcamp/advance_class/createClass', createAdvanceClassRouter);
app.use('/bootcamp/advance_class/Chattings', bootCampAdvanceChatRouter);
app.use('/bootcamp/advance_class/contact', bootcampAdvanceClassContact);
app.use('/bootcamp/advance_class/course/course', bootcampAdvanceClassCourseRouter);
app.use('/bootcamp/advance_class/course/section', bootcampAdvanceClassCourseSection);
app.use('/bootcamp/advance_class/course/media', bootcampAdvanceClassCourseVideos);
app.use('/bootcamp/advance_class/feedback', bootcampAdvanceClassFeedback);
app.use('/bootcamp/advance_class/icon', bootcampAdvanceClassIcon);
app.use('/bootcamp/advance_class/instructors', bootcampAdvanceClassInstructors);
app.use('/bootcamp/advance_class/lecture', bootcampAdvanceLectureRouter);
app.use('/bootcamp/advance_class/post', bootCampAdvanceClassPostRouter);
app.use('/bootcamp/advance_class/post/thumbnail', bootCampAdvanceClassThumbnailRouter);
app.use('/bootcamp/advance_class/students', bootcampAdvanceClassStudentsRouter);
app.use('/bootcamp/advance_class/media/comments', bootcampAdvanceClassComments);
app.use('/bootcamp/advance_class/media/subComment', bootcampAdvanceClassSubComments);
app.use('/bootcamp/advance_class/media/thirdComment', bootcampAdvanceClassThirdComments);
app.use('/bootcamp/advance_class/media/likes', bootcampAdvanceClassLikes);
app.use('/bootcamp/advance_class/media/likeComment', bootcampAdvanceLikeClassComments);
app.use('/bootcamp/advance_class/media/likeSubComment', likeBootcampAdvanceClassSubComments);
app.use('/bootcamp/advance_class/media/likeThirdComment',likeBootcampAdvanceClassThirdComments);
app.use('/bootcamp/advance_class/course/mediaActions/comments', bootcampAdvanceClassCourseComments);
app.use('/bootcamp/advance_class/course/mediaActions/subComments', bootcampAdvanceClassCourseSubComments);
app.use('/bootcamp/advance_class/course/mediaActions/thirdComments', bootcampAdvanceClassCourseThirdComments);
app.use('/bootcamp/advance_class/course/mediaActions/likes', bootcampAdvanceClassCourseLikes);
app.use('/bootcamp/advance_class/course/mediaActions/likeComment', likeBootcampAdvanceClassCourseComments);
app.use('/bootcamp/advance_class/course/mediaActions/likeSubComment', likeBootcampAdvanceClassCourseSubComments);
app.use('/bootcamp/advance_class/course/mediaActions/likeThirdComment', likeBootcampAdvanceClassCourseThirdComments);
app.use('/bootcamp/advance_class/pricing', bootCampAdvanceClassPricingRouter);
app.use('/bootcamp/verifyBootCamp', bootcampVerifyRouter);
app.use('/bootcamp/payment', academyClassPaymentRouter);
app.use('/account/auth/logout', logoutRoute);

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

interface UsersRoom {
  roomId?: string;
  userId: string;
}

const usersRoom = new Map<string, UsersRoom>();

io.on('connection', (socket:Socket) => {
  console.log('New user connected:', socket.id);


  socket.on('join-user', ({  userId }: {  userId: string }) => {

    const roomId = `user-${userId}`;

    usersRoom.set(socket.id, { roomId  } as any);
    console.log(`User  joined : ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit('user-joined', {  roomId });
  });

  socket.on('leave-user', ({  userId }: {  userId: string }) => {

    const roomId = `user-${userId}`;

    console.log(`User left room: ${roomId}`);
    socket.leave(roomId);
    io.to(roomId).emit('user-left', {  roomId });
  });


  socket.on('join-private-chat', ({ userId, friendId }: { userId: string; friendId: string }) => {
    const roomId = `private-${[userId, friendId].sort().join('-')}`; 
  
    usersRoom.set(socket.id, { roomId, userId });
    console.log(`User ${userId} joined private room: ${roomId}`);
    
    socket.join(roomId);
    
    io.to(roomId).emit('user-joined', { userId, roomId });
  });

 
  socket.on('leave-private-chat', ({ userId, friendId }: { userId: string; friendId: string }) => {
    const roomId = `private-${[userId, friendId].sort().join('-')}`;
  
    console.log(`User ${userId} left private room: ${roomId}`);
    socket.leave(roomId);
  
    io.to(roomId).emit('user-left', { userId, roomId });
  });


  socket.on('join-group', ({ groupId, userId }: { groupId: string; userId: string }) => {

    const roomId = `group-${groupId}`;
 
    usersRoom.set(socket.id, { roomId, userId });
    console.log(`User ${userId} joined room: ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit('user-joined', { userId, roomId });
  });

  socket.on('join-class', ({ classId, userId }: { classId: string; userId: string }) => {

    const roomId = `class-${classId}`;

    usersRoom.set(socket.id, { roomId, userId });
    console.log(`User ${userId} joined room: ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit('user-joined', { userId, roomId });
  });


  socket.on('join-bootcamp-class', ({ classId, userId }: { classId: string; userId: string }) => {

    const roomId = `bootcamp-class-${classId}`;

    usersRoom.set(socket.id, { roomId, userId });
    console.log(`User ${userId} joined room: ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit('user-joined', { userId, roomId });
  });


  socket.on('leave-group', ({ groupId, userId }: { groupId: string; userId: string }) => {

    const roomId = `group-${groupId}`;

    console.log(`User ${userId} left room: ${roomId}`);
    socket.leave(roomId);
    io.to(roomId).emit('user-left', { userId, roomId });
  });

  socket.on('leave-class', ({ classId, userId }: { classId: string; userId: string }) => {

    const roomId = `class-${classId}`;

    console.log(`User ${userId} left room: ${roomId}`);
    socket.leave(roomId);
    io.to(roomId).emit('user-left', { userId, roomId });
  });

  socket.on('leave-bootcamp-class', ({ classId, userId }: { classId: string; userId: string }) => {

    const roomId = `bootcamp-class-${classId}`;

    console.log(`User ${userId} left room: ${roomId}`);
    socket.leave(roomId);
    io.to(roomId).emit('user-left', { userId, roomId });
  });

  socket.on('disconnect', () => {
    const user = usersRoom.get(socket.id);
    if (user?.roomId) {
      io.to(user.roomId).emit('user-left', { userId: user.userId, roomId: user.roomId });
    }
    usersRoom.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT!;
server.listen(PORT, '0.0.0.0' as any, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error disconnecting Prisma:', err);
  } finally {
    process.exit();
  }
});

