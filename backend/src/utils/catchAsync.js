/* Async Controller Exception Wrapper */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
