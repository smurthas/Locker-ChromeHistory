if (typeof HistoMine === 'undefined') HistoMine = {};
HistoMine.Utils = (function() {
  function setApiToken(apiToken) {
    set('apiToken', apiToken);
  }

  function getApiToken(callback) {
    var apiToken = get('apiToken');
    if(apiToken) return callback(apiToken);
    $.getJSON('https://' + HistoMine.config.host + '/users/me/apiToken', function(resp) {
      apiToken = resp.apiToken;
      if(apiToken) HistoMine.Utils.setApiToken(apiToken);
      callback(apiToken);
    }).error(callback);
  }

  function getEndTime() {
    get('endTime');
  }

  function setEndTime(endTime) {
    set('endTime', endTime);
  }

  function set(key, val) {
    localStorage.setItem(getLSKey(key), val);
  }

  function get(key) {
    return localStorage.getItem(getLSKey(key));
  }

  function isAuthed() {
    return get('authed') === 'true';
  }

  function authCompleted() {
    set('authed', 'true');
  }

  function getLSKey(key) {
    return HistoMine.config.host + '_' + key;
  }

  return {
    setApiToken: setApiToken,
    getApiToken: getApiToken,
    getEndTime: getEndTime,
    setEndTime: setEndTime,
    isAuthed: isAuthed,
    authCompleted: authCompleted
  };
})();