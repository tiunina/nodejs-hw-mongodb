export const errorHandler = (error, req, res, next) => {
  // console.log('res object:', res);
  res.status(500).json({
    message: 'Server error',
    error: error.message,
  });
};
