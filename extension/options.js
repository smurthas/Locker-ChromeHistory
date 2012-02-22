if (typeof HistoMine === 'undefined') HistoMine = {};
HistoMine.Options = (function() {
  function init() {
    $('#fetchApiToken').click(fetchApiToken);
    $('#save').click(saveOptions);
    restoreOptions();
  }

  function restoreOptions() {
    HistoMine.Utils.getApiToken(function(apiToken) {
      if (apiToken && apiToken.length > 0) {
        $('#apiToken').val(apiToken);
      } else {
        fetchApiToken();
      }
    });
  }

  function saveOptions() {
    var apiToken = $('#apiToken').val();
    HistoMine.Utils.setApiToken(apiToken);
    setTimeout(chrome.extension.getBackgroundPage().HistoMine.Background.init, 0);
    window.close();
  }

  function fetchApiToken(evt) {
    if (typeof(evt) !== 'undefined') evt.preventDefault();
    $.getJSON('https://' + HistoMine.config.host + '/users/me/apiToken', function(resp) {
      if (resp && resp.apiToken) {
        $('.error').slideUp('fast');
        $('#apiToken').val(resp.apiToken);
        saveOptions();
      }
    }).error(function() {
      $('#couldntFetchToken').slideDown('fast').delay(5000).slideUp('fast');
    });
  }

  return {
    init : init
  };
})();

$(HistoMine.Options.init);
