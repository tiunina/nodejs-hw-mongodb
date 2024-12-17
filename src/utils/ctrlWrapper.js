export const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
      //   const { status = 500 } = error;
      //   res.status(500).json({
      //     status,
      //     message: error.message,
      //   });
    }
  };
  return func;
};
