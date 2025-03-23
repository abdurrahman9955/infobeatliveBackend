import express from 'express';
import {followUser, unfollowUser, getFollowerCount, getFollowingCount } from './followingController';

const following = express.Router();

following.get('/following/followers',  getFollowerCount);
following.get('/following/following',  getFollowingCount);
following.post('/following/follow', followUser);
following.delete('/following/unfollow', unfollowUser);

export default following;

