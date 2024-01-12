export const errorhandler = (err, req, res, next) => {
  res.status(500).json({ error: err.message });
};
