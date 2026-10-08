const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
 
router.get('/latest', authMiddleware , userController.getLatestUsers);
router.post('/follow', authMiddleware, userController.toggleFollow);
router.get('/most-followed', authMiddleware , userController.getMostFollowed);
router.get('/profile/:username', authMiddleware , userController.getUserProfile);
router.get('/activity/:username', userController.getUserActivity);

module.exports = router;