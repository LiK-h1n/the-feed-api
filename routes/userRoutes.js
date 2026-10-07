const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
router.get('/latest', userController.getLatestUsers);

module.exports = router;