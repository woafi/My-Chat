function nextRespone(bool) {
  return function (req, res, next) {
    res.locals.next = bool;
    next();
  };
}

module.exports = nextRespone;
