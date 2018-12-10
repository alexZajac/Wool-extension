console.log('bg running');

window.content = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.content = request.text.trim(); 
    if(window.content.indexOf(" ") === -1){
        window.soloWord = true;
    } 
});

    


