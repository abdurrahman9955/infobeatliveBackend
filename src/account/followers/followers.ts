import express from 'express';
import { getFollowers,followUser, unfollowUser, getFollowing, getFollowerCount, getFollowingCount, checkFollowingStatus } from './followersController';

const followers = express.Router();

followers.get('/getFollowerCount/:userId',  getFollowerCount);
followers.get('/getFollowingCount/:userId',  getFollowingCount);
followers.get('/get/followers/:userId',  getFollowers);
followers.get('/get/following/:userId',  getFollowing);
followers.post('/:followerId/:userId/follow', followUser);
followers.delete('/:followerId/:userId/unfollow', unfollowUser);
followers.get('/followingStatus/:followerId/:userId',  checkFollowingStatus);

export default followers;
