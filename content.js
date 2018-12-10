console.log('running');
window.addEventListener('mouseup', contentInput);

function contentInput(){
  var selection = window.getSelection().toString();
  if(selection.length > 0){
    var message = { text: selection};
    chrome.runtime.sendMessage(message);
    }
  
  }
