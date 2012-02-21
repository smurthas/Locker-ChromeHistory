HistoMineOptions = (function() {
  function init() {
    $('#fetchApiToken').click(fetchApiToken);
    $('#apiHost').change(updateToken);
    $('#save').click(saveOptions);
    restoreOptions();
  }

  function restoreOptions() {
    var host = localStorage.getItem('apiHost') || 'singly.com';
    var token = localStorage.getItem(host + '_apiToken');
    $('#apiHost').val(host);
    if (token && token.length > 0) {
      $('#apiToken').val(token);
    } else {
      fetchApiToken();
    }
  }

  function saveOptions() {
    var host = $('#apiHost').val();
    var token = $('#apiToken').val();
    localStorage.setItem('apiHost', host);
    localStorage.setItem(host + '_apiToken', token);
  }

  function updateToken() {
    var host = $('#apiHost').val();
    var token = localStorage.getItem(host + '_apiToken');
    if (token && token.length > 0) {
      $('#apiToken').val(token);
      saveOptions();
    }
  }

  function fetchApiToken(evt) {
    if (typeof(evt) !== 'undefined') evt.preventDefault();
    var host = $('#apiHost').val();
    $.getJSON('https://' + host + '/users/me/apiToken', function(resp) {
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

$(HistoMineOptions.init);
