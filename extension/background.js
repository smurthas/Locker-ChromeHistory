if (typeof HistoMine === 'undefined') HistoMine = {};
HistoMine.Background = (function() {
  var postUrl;

  function init() {
    postUrl = 'https://api.' + HistoMine.config.host + '/';
    authCallback(function() { console.log('auth called back'); });
    HistoMine.Utils.getApiToken(function(apiToken) {
      if(!(apiToken && apiToken.length > 0)) return window.open(chrome.extension.getURL('options.html'));
      start(apiToken);
    });
  }

  function start(apiToken) {
    postUrl += apiToken;
    chrome.history.onVisited.addListener(handleVisit);
    postHistory();
  }

  function authCallback(callback) {
    if(HistoMine.Utils.isAuthed()) return callback();
    $.ajax({url:'https://' + HistoMine.config.host + '/auth/chromehistory?done=true', success: function() {
      HistoMine.Utils.authCompleted();
      callback();
    }});
  }

  function postVisits(visitItems, callback) {
    return doPost(visitItems, 'visits', callback).error(function(b) { console.log('error', b); });
  }

  function postHistories(historyItem, callback) {
    return doPost(historyItem, 'history', callback).error(function(b) { console.log('error', b); });
  }

  function doPost(items, nameSpace, callback) {
    if(!(items instanceof Array)) items = [items];
    var itms = [];
    for(var i in items) itms.push({obj:items[i]});
    console.error("DEBUG: itms", itms.length);
    return $.post(postUrl + '/push/chromehistory-' + nameSpace, {data: itms}, callback);
  }

  var PAGE_SIZE = 200;
  //grabs all urls since the last successful post and posts them
  function postHistory() {
    var endTime = HistoMine.Utils.getEndTime();
    var search = {text:'', maxResults:PAGE_SIZE, startTime:0};
    if(typeof endTime !== 'undefined') search.endTime = endTime;
    chrome.history.search(search, function(historyItems) {
      console.error("DEBUG: historyItems", historyItems.length);
      if(!historyItems || historyItems.length < 1) return;
      handleHistories(historyItems, function() {
        HistoMine.Utils.setEndTime(historyItems[historyItems.length-1].lastVisitTime);
        postHistory();
      });
    });
  }

  var VISIT_CHUNK_SIZE = 2000;
  function handleHistories(historyItems, callback) {
    var visitQueue = [];
    async.forEachSeries(historyItems, function(historyItem, next) {
      var start = Date.now();
      getVisits(historyItem, function(visitItems) {
        visitQueue = visitQueue.concat(visitItems);
        if(visitQueue.length < VISIT_CHUNK_SIZE) return setTimeout(next, 10);
        postVisits(visitQueue, function() {
          visitQueue = [];
          var et = Date.now() - start;
          console.error("DEBUG: et", et);
          setTimeout(next, et * 2);
        });
      });
    }, function() {
      postHistories(historyItems, function() {
        console.log('phew!');
        callback();
      });
    });
  }

  function getVisits(historyItem, callback) {
    chrome.history.getVisits({url:historyItem.url}, callback);
  }

  function handleVisit(historyItem) {
    getVisits(historyItem, function(visitsArray) {
      var visit = visitsArray[visitsArray.length-1];
      console.log('visitsArray...', visit);
      postVisits(visit);
    });
    postHistories(historyItem, function() {
      console.log('historyItem...', historyItem);
    });
  }

  return {
    init: init
  };
})();

$(HistoMine.Background.init);