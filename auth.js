module.exports = {
  handler : function (host, apiKeys, done, req, res) {
    if(req.query.done) return done();
    if(req.query.extension) return res.download(__dirname + '/extension.crx');
    res.sendfile(__dirname + '/auth.html');
  }
}