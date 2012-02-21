module.exports = {
  handler : function (host, apiKeys, done, req, res) {
    if(!req.query.done) {
      res.sendfile(__dirname + '/auth.html');
    } else {
      res.send('wahoooo!');
    }
  }
}