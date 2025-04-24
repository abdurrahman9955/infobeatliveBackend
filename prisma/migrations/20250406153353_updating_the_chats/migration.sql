-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_friendId_fkey";

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "accounts"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "accounts"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "accounts"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "accounts"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
