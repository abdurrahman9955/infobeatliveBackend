-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('VIDEO', 'IMAGE', 'TEXT');

-- CreateEnum
CREATE TYPE "ClassLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "BootCampEnum" AS ENUM ('BOOTCAMP', 'ACADEMY', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "AcademyClassLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "MediaTypeCourse" AS ENUM ('VIDEO', 'PDF', 'IMAGE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('SHORT_VIDEO', 'NORMAL_VIDEO', 'IMAGE', 'AUDIO', 'DOCUMENT', 'VIDEO', 'TEXT', 'RECORDING');

-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'RECORDING');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYE', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT,
    "count" SERIAL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "handle" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isEmployee" BOOLEAN NOT NULL DEFAULT false,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "email_verified" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "handle" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "otp" TEXT,
    "otpExpiration" TIMESTAMP(3),
    "tempPassword" TEXT,
    "emailVerified" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeleteActivities" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "postsDeleted" INTEGER DEFAULT 0,
    "accountDeleted" INTEGER DEFAULT 0,
    "groupDeleted" INTEGER DEFAULT 0,
    "classDeleted" INTEGER DEFAULT 0,
    "bootCampDeleted" INTEGER DEFAULT 0,
    "academyDeleted" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "CreateActivities" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "postsCreated" INTEGER DEFAULT 0,
    "accountCreate" INTEGER DEFAULT 0,
    "groupCreate" INTEGER DEFAULT 0,
    "classDelete" INTEGER DEFAULT 0,
    "bootCampDelete" INTEGER DEFAULT 0,
    "academyDelete" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "GroupActivities" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT,
    "email" TEXT NOT NULL,
    "posts" INTEGER DEFAULT 0,
    "videoCall" INTEGER DEFAULT 0,
    "VoiceCall" INTEGER DEFAULT 0,
    "chats" INTEGER DEFAULT 0,
    "program" INTEGER DEFAULT 0,
    "programVideo" INTEGER DEFAULT 0,
    "programVoice" INTEGER DEFAULT 0,
    "programChats" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "ClassActivities" (
    "id" SERIAL NOT NULL,
    "classId" TEXT,
    "email" TEXT NOT NULL,
    "posts" INTEGER DEFAULT 0,
    "videoCall" INTEGER DEFAULT 0,
    "VoiceCall" INTEGER DEFAULT 0,
    "chats" INTEGER DEFAULT 0,
    "lectures" INTEGER DEFAULT 0,
    "lecturesVideo" INTEGER DEFAULT 0,
    "lecturesVoice" INTEGER DEFAULT 0,
    "lecturesChats" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BootCampActivities" (
    "id" SERIAL NOT NULL,
    "classId" TEXT,
    "email" TEXT NOT NULL,
    "posts" INTEGER DEFAULT 0,
    "videoCall" INTEGER DEFAULT 0,
    "VoiceCall" INTEGER DEFAULT 0,
    "chats" INTEGER DEFAULT 0,
    "lectures" INTEGER DEFAULT 0,
    "lecturesVideo" INTEGER DEFAULT 0,
    "lecturesVoice" INTEGER DEFAULT 0,
    "lecturesChats" INTEGER DEFAULT 0,
    "level" "BootCampEnum" NOT NULL DEFAULT 'BOOTCAMP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "contentUrl" TEXT,
    "thumbnailUrl" TEXT,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Support" (
    "id" TEXT NOT NULL,
    "roomId" TEXT,
    "friendId" TEXT,
    "userId" TEXT,
    "content" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "ChatMessageType",
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "roomId" TEXT,
    "friendId" TEXT,
    "userId" TEXT,
    "content" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "ChatMessageType",
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RePost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoResolution" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoResolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "handle" TEXT,
    "icon" TEXT,
    "adminsCount" INTEGER NOT NULL DEFAULT 0,
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "isSuspend" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isMember" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isChatsBlock" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupAdmin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaUpload" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "contentUrl" TEXT,
    "thumbnailUrl" TEXT,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeGroupMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeGroupMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeGroupComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeGroupComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeGroupSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeGroupSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeGroupThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeGroupThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupChat" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "type" "ChatMessageType" NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "participantLimit" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "handle" TEXT,
    "instructorsCount" INTEGER NOT NULL DEFAULT 1,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isChatsBlock" BOOLEAN NOT NULL DEFAULT false,
    "grade" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CLassSubscription" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CLassSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CLassEarning" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "payout" INTEGER NOT NULL DEFAULT 0,
    "Total" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CLassEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CLassPricing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "benefit1" TEXT NOT NULL,
    "benefit2" TEXT NOT NULL,
    "benefit3" TEXT NOT NULL,
    "benefit4" TEXT NOT NULL,
    "benefit5" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CLassPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CLassPayoutMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "country" TEXT,
    "currency" TEXT,
    "city" TEXT,
    "email" TEXT,
    "fullName" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankAddress" TEXT,
    "swiftOrBic" TEXT,
    "iBan" TEXT,
    "routingNumber" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT,
    "accountType" TEXT,
    "postalCode" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CLassPayoutMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAnnouncement" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassFeedback" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassContact" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "isInstructor" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isStudent" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassMediaUpload" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "contentUrl" TEXT,
    "thumbnailUrl" TEXT,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassMediaUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" "PostType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassChat" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "type" "ChatMessageType" NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "participantLimit" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSection" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseMedia" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "url" TEXT NOT NULL,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassCourseComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassCourseComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassCourseSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassCourseSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassCourseThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassCourseThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassCourseComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassCourseComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassCourseSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassCourseSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassCourseThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassCourseThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeClassCourseVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeClassCourseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bootcamp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "handle" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "grade" INTEGER NOT NULL DEFAULT 1,
    "creatorId" TEXT NOT NULL,
    "instructorsCount" INTEGER NOT NULL DEFAULT 1,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bootcamp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampMeetings" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "participantLimit" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampMeetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampAnnouncement" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampMediaUpload" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "contentUrl" TEXT,
    "thumbnailUrl" TEXT,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampMediaUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampContact" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampFeedback" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "handle" TEXT,
    "instructorsCount" INTEGER NOT NULL DEFAULT 1,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isChatsBlock" BOOLEAN NOT NULL DEFAULT false,
    "grade" INTEGER NOT NULL DEFAULT 1,
    "bootcampId" TEXT NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "BootcampClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassSubscription" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampCLassEarning" (
    "id" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "payout" INTEGER NOT NULL DEFAULT 0,
    "Total" INTEGER NOT NULL DEFAULT 0,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampCLassEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampCLassPricing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "benefit1" TEXT NOT NULL,
    "benefit2" TEXT NOT NULL,
    "benefit3" TEXT NOT NULL,
    "benefit4" TEXT NOT NULL,
    "benefit5" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampCLassPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampPayoutMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bootcampId" TEXT NOT NULL,
    "country" TEXT,
    "currency" TEXT,
    "city" TEXT,
    "email" TEXT,
    "fullName" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankAddress" TEXT,
    "swiftOrBic" TEXT,
    "iBan" TEXT,
    "routingNumber" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT,
    "accountType" TEXT,
    "postalCode" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampPayoutMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassAnnouncement" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassFeedback" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassContact" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampInstructor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "isInstructor" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampInstructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampStudent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isStudent" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "level" "ClassLevel" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassMediaUpload" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "contentUrl" TEXT,
    "thumbnailUrl" TEXT,
    "level" "ClassLevel" NOT NULL,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassMediaUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" "MediaType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassChat" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "type" "ChatMessageType" NOT NULL,
    "fileUrl" TEXT,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampLecture" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "participantLimit" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampCourse" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampCourseSection" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampCourseSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampCourseVideo" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaTypeCourse" NOT NULL,
    "level" "ClassLevel" NOT NULL,
    "resolutions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampCourseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampCourseVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampCourseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassCourseComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassCourseComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassCourseSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassCourseSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampClassCourseThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampClassCourseThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassCourseComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassCourseComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassCourseSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassCourseSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeBootcampClassCourseThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "type" "MediaTypeCourse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeBootcampClassCourseThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeSubComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subCommentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeSubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeThirdComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thirdCommentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeThirdComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "bannerUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Following" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "access" JSONB NOT NULL,
    "isEmployee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_count_key" ON "User"("count");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_id_key" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_handle_key" ON "accounts"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "DeleteActivities_id_key" ON "DeleteActivities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeleteActivities_email_key" ON "DeleteActivities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CreateActivities_id_key" ON "CreateActivities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CreateActivities_email_key" ON "CreateActivities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GroupActivities_id_key" ON "GroupActivities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupActivities_email_key" ON "GroupActivities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClassActivities_id_key" ON "ClassActivities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassActivities_email_key" ON "ClassActivities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BootCampActivities_id_key" ON "BootCampActivities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BootCampActivities_email_key" ON "BootCampActivities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Group_handle_key" ON "Group"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "GroupAdmin_userId_groupId_key" ON "GroupAdmin"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_userId_groupId_key" ON "GroupMember"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_handle_key" ON "Class"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_classId_key" ON "Instructor"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_classId_key" ON "Student"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Bootcamp_handle_key" ON "Bootcamp"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "BootcampClass_handle_key" ON "BootcampClass"("handle");

-- CreateIndex
CREATE INDEX "BootcampClass_bootcampId_idx" ON "BootcampClass"("bootcampId");

-- CreateIndex
CREATE INDEX "BootcampClass_createdBy_idx" ON "BootcampClass"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "BootcampInstructor_userId_classId_key" ON "BootcampInstructor"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "BootcampStudent_userId_classId_key" ON "BootcampStudent"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RePost" ADD CONSTRAINT "RePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RePost" ADD CONSTRAINT "RePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoResolution" ADD CONSTRAINT "VideoResolution_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupAdmin" ADD CONSTRAINT "GroupAdmin_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupAdmin" ADD CONSTRAINT "GroupAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUpload" ADD CONSTRAINT "MediaUpload_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUpload" ADD CONSTRAINT "MediaUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupComment" ADD CONSTRAINT "GroupComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupComment" ADD CONSTRAINT "GroupComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSubComment" ADD CONSTRAINT "GroupSubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "GroupComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSubComment" ADD CONSTRAINT "GroupSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupThirdComment" ADD CONSTRAINT "GroupThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "GroupSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupThirdComment" ADD CONSTRAINT "GroupThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupMedia" ADD CONSTRAINT "LikeGroupMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupMedia" ADD CONSTRAINT "LikeGroupMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupComment" ADD CONSTRAINT "LikeGroupComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "GroupComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupComment" ADD CONSTRAINT "LikeGroupComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupSubComment" ADD CONSTRAINT "LikeGroupSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "GroupSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupSubComment" ADD CONSTRAINT "LikeGroupSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupThirdComment" ADD CONSTRAINT "LikeGroupThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "GroupThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeGroupThirdComment" ADD CONSTRAINT "LikeGroupThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassSubscription" ADD CONSTRAINT "CLassSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassSubscription" ADD CONSTRAINT "CLassSubscription_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassEarning" ADD CONSTRAINT "CLassEarning_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassPricing" ADD CONSTRAINT "CLassPricing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassPricing" ADD CONSTRAINT "CLassPricing_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassPayoutMethod" ADD CONSTRAINT "CLassPayoutMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLassPayoutMethod" ADD CONSTRAINT "CLassPayoutMethod_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAnnouncement" ADD CONSTRAINT "ClassAnnouncement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAnnouncement" ADD CONSTRAINT "ClassAnnouncement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeedback" ADD CONSTRAINT "ClassFeedback_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeedback" ADD CONSTRAINT "ClassFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassContact" ADD CONSTRAINT "ClassContact_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassContact" ADD CONSTRAINT "ClassContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMediaUpload" ADD CONSTRAINT "ClassMediaUpload_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMediaUpload" ADD CONSTRAINT "ClassMediaUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassComment" ADD CONSTRAINT "ClassComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ClassMediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassComment" ADD CONSTRAINT "ClassComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubComment" ADD CONSTRAINT "ClassSubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ClassComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubComment" ADD CONSTRAINT "ClassSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassThirdComment" ADD CONSTRAINT "ClassThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "ClassSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassThirdComment" ADD CONSTRAINT "ClassThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassComment" ADD CONSTRAINT "LikeClassComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ClassComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassComment" ADD CONSTRAINT "LikeClassComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassSubComment" ADD CONSTRAINT "LikeClassSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "ClassSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassSubComment" ADD CONSTRAINT "LikeClassSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassThirdComment" ADD CONSTRAINT "LikeClassThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "ClassThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassThirdComment" ADD CONSTRAINT "LikeClassThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassMedia" ADD CONSTRAINT "LikeClassMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "ClassMediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassMedia" ADD CONSTRAINT "LikeClassMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassChat" ADD CONSTRAINT "ClassChat_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassChat" ADD CONSTRAINT "ClassChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCourseComment" ADD CONSTRAINT "ClassCourseComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CourseMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCourseComment" ADD CONSTRAINT "ClassCourseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCourseSubComment" ADD CONSTRAINT "ClassCourseSubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ClassCourseComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCourseSubComment" ADD CONSTRAINT "ClassCourseSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCourseThirdComment" ADD CONSTRAINT "ClassCourseThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "ClassCourseSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCourseThirdComment" ADD CONSTRAINT "ClassCourseThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseComment" ADD CONSTRAINT "LikeClassCourseComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ClassCourseComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseComment" ADD CONSTRAINT "LikeClassCourseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseSubComment" ADD CONSTRAINT "LikeClassCourseSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "ClassCourseSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseSubComment" ADD CONSTRAINT "LikeClassCourseSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseThirdComment" ADD CONSTRAINT "LikeClassCourseThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "ClassCourseThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseThirdComment" ADD CONSTRAINT "LikeClassCourseThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseVideo" ADD CONSTRAINT "LikeClassCourseVideo_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "CourseMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeClassCourseVideo" ADD CONSTRAINT "LikeClassCourseVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bootcamp" ADD CONSTRAINT "Bootcamp_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampMeetings" ADD CONSTRAINT "BootcampMeetings_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampMeetings" ADD CONSTRAINT "BootcampMeetings_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampAnnouncement" ADD CONSTRAINT "BootcampAnnouncement_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampAnnouncement" ADD CONSTRAINT "BootcampAnnouncement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampMediaUpload" ADD CONSTRAINT "BootcampMediaUpload_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampMediaUpload" ADD CONSTRAINT "BootcampMediaUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampComment" ADD CONSTRAINT "BootcampComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BootcampMediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampComment" ADD CONSTRAINT "BootcampComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampSubComment" ADD CONSTRAINT "BootcampSubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BootcampComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampSubComment" ADD CONSTRAINT "BootcampSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampThirdComment" ADD CONSTRAINT "BootcampThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "BootcampSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampThirdComment" ADD CONSTRAINT "BootcampThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampComment" ADD CONSTRAINT "LikeBootcampComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BootcampComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampComment" ADD CONSTRAINT "LikeBootcampComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampSubComment" ADD CONSTRAINT "LikeBootcampSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "BootcampSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampSubComment" ADD CONSTRAINT "LikeBootcampSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampThirdComment" ADD CONSTRAINT "LikeBootcampThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "BootcampThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampThirdComment" ADD CONSTRAINT "LikeBootcampThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampMedia" ADD CONSTRAINT "LikeBootcampMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "BootcampMediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampMedia" ADD CONSTRAINT "LikeBootcampMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampContact" ADD CONSTRAINT "BootcampContact_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampContact" ADD CONSTRAINT "BootcampContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampFeedback" ADD CONSTRAINT "BootcampFeedback_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampFeedback" ADD CONSTRAINT "BootcampFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClass" ADD CONSTRAINT "BootcampClass_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClass" ADD CONSTRAINT "BootcampClass_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassSubscription" ADD CONSTRAINT "BootcampClassSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassSubscription" ADD CONSTRAINT "BootcampClassSubscription_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassSubscription" ADD CONSTRAINT "BootcampClassSubscription_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCLassEarning" ADD CONSTRAINT "BootcampCLassEarning_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCLassEarning" ADD CONSTRAINT "BootcampCLassEarning_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCLassPricing" ADD CONSTRAINT "BootcampCLassPricing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCLassPricing" ADD CONSTRAINT "BootcampCLassPricing_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCLassPricing" ADD CONSTRAINT "BootcampCLassPricing_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampPayoutMethod" ADD CONSTRAINT "BootcampPayoutMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampPayoutMethod" ADD CONSTRAINT "BootcampPayoutMethod_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassAnnouncement" ADD CONSTRAINT "BootcampClassAnnouncement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassAnnouncement" ADD CONSTRAINT "BootcampClassAnnouncement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassFeedback" ADD CONSTRAINT "BootcampClassFeedback_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassFeedback" ADD CONSTRAINT "BootcampClassFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassContact" ADD CONSTRAINT "BootcampClassContact_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassContact" ADD CONSTRAINT "BootcampClassContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampInstructor" ADD CONSTRAINT "BootcampInstructor_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampInstructor" ADD CONSTRAINT "BootcampInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampStudent" ADD CONSTRAINT "BootcampStudent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampStudent" ADD CONSTRAINT "BootcampStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassMediaUpload" ADD CONSTRAINT "BootcampClassMediaUpload_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassMediaUpload" ADD CONSTRAINT "BootcampClassMediaUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassComment" ADD CONSTRAINT "BootcampClassComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BootcampClassMediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassComment" ADD CONSTRAINT "BootcampClassComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassSubComment" ADD CONSTRAINT "BootcampClassSubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BootcampClassComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassSubComment" ADD CONSTRAINT "BootcampClassSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassThirdComment" ADD CONSTRAINT "BootcampClassThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "BootcampClassSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassThirdComment" ADD CONSTRAINT "BootcampClassThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassComment" ADD CONSTRAINT "LikeBootcampClassComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BootcampClassComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassComment" ADD CONSTRAINT "LikeBootcampClassComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassSubComment" ADD CONSTRAINT "LikeBootcampClassSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "BootcampClassSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassSubComment" ADD CONSTRAINT "LikeBootcampClassSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassThirdComment" ADD CONSTRAINT "LikeBootcampClassThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "BootcampClassThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassThirdComment" ADD CONSTRAINT "LikeBootcampClassThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassMedia" ADD CONSTRAINT "LikeBootcampClassMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "BootcampClassMediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassMedia" ADD CONSTRAINT "LikeBootcampClassMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassChat" ADD CONSTRAINT "BootcampClassChat_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassChat" ADD CONSTRAINT "BootcampClassChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampLecture" ADD CONSTRAINT "BootcampLecture_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampLecture" ADD CONSTRAINT "BootcampLecture_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCourse" ADD CONSTRAINT "BootcampCourse_classId_fkey" FOREIGN KEY ("classId") REFERENCES "BootcampClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCourse" ADD CONSTRAINT "BootcampCourse_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCourseSection" ADD CONSTRAINT "BootcampCourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "BootcampCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCourseSection" ADD CONSTRAINT "BootcampCourseSection_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCourseVideo" ADD CONSTRAINT "BootcampCourseVideo_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampCourseVideo" ADD CONSTRAINT "BootcampCourseVideo_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "BootcampCourseSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampCourseVideo" ADD CONSTRAINT "LikeBootcampCourseVideo_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "BootcampCourseVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampCourseVideo" ADD CONSTRAINT "LikeBootcampCourseVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassCourseComment" ADD CONSTRAINT "BootcampClassCourseComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BootcampCourseVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassCourseComment" ADD CONSTRAINT "BootcampClassCourseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassCourseSubComment" ADD CONSTRAINT "BootcampClassCourseSubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BootcampClassCourseComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassCourseSubComment" ADD CONSTRAINT "BootcampClassCourseSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassCourseThirdComment" ADD CONSTRAINT "BootcampClassCourseThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "BootcampClassCourseSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootcampClassCourseThirdComment" ADD CONSTRAINT "BootcampClassCourseThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassCourseComment" ADD CONSTRAINT "LikeBootcampClassCourseComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BootcampClassCourseComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassCourseComment" ADD CONSTRAINT "LikeBootcampClassCourseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassCourseSubComment" ADD CONSTRAINT "LikeBootcampClassCourseSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "BootcampClassCourseSubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassCourseSubComment" ADD CONSTRAINT "LikeBootcampClassCourseSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassCourseThirdComment" ADD CONSTRAINT "LikeBootcampClassCourseThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "BootcampClassCourseThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBootcampClassCourseThirdComment" ADD CONSTRAINT "LikeBootcampClassCourseThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubComment" ADD CONSTRAINT "SubComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubComment" ADD CONSTRAINT "SubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdComment" ADD CONSTRAINT "ThirdComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "SubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdComment" ADD CONSTRAINT "ThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeComment" ADD CONSTRAINT "LikeComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeComment" ADD CONSTRAINT "LikeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeSubComment" ADD CONSTRAINT "LikeSubComment_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "SubComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeSubComment" ADD CONSTRAINT "LikeSubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeThirdComment" ADD CONSTRAINT "LikeThirdComment_thirdCommentId_fkey" FOREIGN KEY ("thirdCommentId") REFERENCES "ThirdComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeThirdComment" ADD CONSTRAINT "LikeThirdComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
