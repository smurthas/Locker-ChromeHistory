module.exports = {
  handler : function (host, apiKeys, done, req, res) {
    if(req.query.done) return done();
    res.sendfile(__dirname + '/auth.html');
  }
}