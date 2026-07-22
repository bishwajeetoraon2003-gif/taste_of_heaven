const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', protect, restrictTo('admin', 'staff'), upload.single('image'), uploadController.uploadImage);

module.exports = router;
