const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide an image file to upload', 400));
  }

  // Convert buffer to base64 data URI for instant preview / storage fallback
  const base64Data = req.file.buffer.toString('base64');
  const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

  res.status(200).json({
    status: 'success',
    data: {
      imageUrl,
      filename: req.file.originalname,
      size: req.file.size
    }
  });
});
