/**
 * Global error handling middleware
 */
module.exports = function (err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const payload = {
    error: err.message || 'Internal Server Error',
    code: err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR')
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
};
