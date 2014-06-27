// Authentication utility middleware
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

exports.isAdmin = function(req, res, next) {
  if(req.user.role === 'admin'){ return next(); }
  res.redirect('/');
};