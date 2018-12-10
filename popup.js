var bgpage = chrome.extension.getBackgroundPage();

var contents = bgpage.content;
var url;
var summary;
var DestinationLanguage;
var file;//for doc summarization
var sentences; //how many sentences the user wants 
var data; //API request URL
var translation;

//get the url for summary
chrome.tabs.getSelected(function(tab){
  url = tab.url;
});

window.onload = function(){
  
  //Language detection
  if(contents !== ""){
    console.log(contents);
    document.getElementById('source').style.display = "block";
    
    document.getElementsByTagName('h4')[0].innerHTML = contents;
    data = "https://translate.yandex.net/api/v1.5/tr.json/detect?&key=trnsl.1.1.20180531T234252Z.82613c68e922b54c.2dad1fb9aa266d035797c85261e62026b6ec1827&text="+contents+"&hint=en,fr";

    var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === this.DONE) {
            var SourceLanguage = this.responseText.substring(this.responseText.indexOf('lang')+7,this.responseText.length-2);
            document.getElementById('containerTranslation').style.display = "block"; //visible
            if(SourceLanguage !== ""){
              document.getElementById(SourceLanguage).style.display = "none"; //except the source language
            }
            //try to see why sourcelanguage doesn't work
            var e = document.getElementById('selection');
            e.addEventListener('change', function(){
              DestinationLanguage = e.options[e.selectedIndex].value;
              data = "https://translate.yandex.net/api/v1.5/tr.json/translate?&key=trnsl.1.1.20180531T234252Z.82613c68e922b54c.2dad1fb9aa266d035797c85261e62026b6ec1827&text="+contents+"&lang="+SourceLanguage+"-"+DestinationLanguage;
              DisplayTranslation(data);
            });
  
          }
        });
        
        xhr.open("POST", "https://translate.yandex.net/api/v1.5/tr.json/detect?");
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        
        xhr.send(data);
  
  }
  else{
    console.log('no content is selected');
  }
  
  //SUMMARY
  
  //From text
  document.getElementById('GetSummaryTxt').addEventListener('click', function(){
    //hide the 2 other buttons
    
    document.getElementById('GetSummaryUrl').style.display ="none";
    document.getElementById('GetSummaryDoc').style.display ="none";
    document.getElementById('GetSummaryTxt').style.position ="relative";
    $("#GetSummaryTxt").animate({
      height:'80px',
      width:'280px',
      fontSize:'30px'
    },"slow");
    $("#GetSummaryTxt").animate({top:'40px'});
    

    document.getElementById('SentencesPicker').style.display = "block";
          //get the sentences onclick
    document.getElementsByClassName('sentences-input')[1].addEventListener('change', function(){
      sentences = document.getElementsByClassName('sentences-input')[1].value; 
      data = "http://api.meaningcloud.com/summarization-1.0&key=05fa0a4ae283d0f8a1e0be9070fa11a7&txt="+contents+"&sentences="+sentences;
      
        document.getElementById('sentences-input').addEventListener('click', function(){
        document.getElementById('SentencesPicker').style.display = "none";
        document.getElementsByClassName('btnContainer')[0].style.display = "none";
        document.getElementsByClassName('loader')[0].style.display = "block";
        setTimeout(function(){
          document.getElementsByClassName('loader')[0].style.display = "none";
          DisplaySummary(data);
        }, "3000");
       
      });
      
    });
  });

  //From URL
  document.getElementById("GetSummaryUrl").addEventListener("click", function(){
    //hide the 2 other buttons
    document.getElementById('GetSummaryTxt').style.display ="none";
    document.getElementById('GetSummaryDoc').style.display ="none";
    $("#GetSummaryUrl").animate({
      height:'80px',
      width:'240px',
      fontSize:'30px'
});

    document.getElementById('SentencesPicker').style.display = "block";
          //get the sentences onclick
    document.getElementsByClassName('sentences-input')[1].addEventListener('change', function(){
          sentences = document.getElementsByClassName('sentences-input')[1].value; 
          data = "http://api.meaningcloud.com/summarization-1.0&key=05fa0a4ae283d0f8a1e0be9070fa11a7&url="+url+"&sentences="+sentences;
          
            document.getElementById('sentences-input').addEventListener('click', function(){
            document.getElementById('SentencesPicker').style.display = "none";
            document.getElementsByClassName('btnContainer')[0].style.display = "none";
            document.getElementsByClassName('loader')[0].style.display = "block";
            setTimeout(function(){
              document.getElementsByClassName('loader')[0].style.display = "none";
              DisplaySummary(data);
            }, "3000");
          });
          
        });
  });
    
  //From Doc
  document.getElementById("GetSummaryDoc").addEventListener("click", function(){
      //hide the 2 other buttons
      document.getElementById('GetSummaryTxt').style.display ="none";
      document.getElementById('GetSummaryUrl').style.display ="none";
      document.getElementById('GetSummaryDoc').style.position ="relative";
      $("#GetSummaryDoc").animate({         
                height:'80px',
                width:'240px',
                fontSize:'30px'
      },"slow");
      $("#GetSummaryDoc").animate({bottom:'40px'});

      document.getElementById("file-input").click();
      document.getElementById("file-input").addEventListener('change', function(){
          file = document.getElementById("file-input").files[0];
          document.getElementById('docTitle').innerHTML = file.name;
          //Get number of sentences to summarize
          document.getElementById('SentencesPicker').style.display = "block";
          //get the sentences onclick
          document.getElementById('sentences-input').addEventListener('click', function(){
              document.getElementById('SentencesPicker').style.display = "none";
              document.getElementsByClassName('btnContainer')[0].style.display = "none";
              document.getElementsByClassName('loader')[0].style.display = "block";
              sentences = document.getElementsByClassName('sentences-input')[1].value; 
              var params = new FormData();
              params.append('key', "05fa0a4ae283d0f8a1e0be9070fa11a7");
              params.append('doc', $('#file-input')[0].files[0]);
              params.append('sentences', sentences);
              $.ajax({
                  url: 'https://api.meaningcloud.com/summarization-1.0',
                  data: params,
                  contentType: false,
                  processData: false,
                  type: 'POST',
                  dataType : 'json',
                  success: function(data){
                    summary = data.summary;
                    document.getElementsByClassName('loader')[0].style.display = "none";
                    document.getElementById('textSum').innerHTML = summary;
                  },
                  error: function() {
                    console.log('error');
                  }
                });
              });
          });
      });     
    
}

function DisplaySummary(data) {
  var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      console.log('in it!');
      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
          document.getElementsByClassName('loader')[0].style.display = "none";
          console.log(this.responseText);
          summary = this.responseText.substring(this.responseText.indexOf('summary')+10,this.responseText.length-2);
          document.getElementById('textSum').innerHTML = summary;
        }
      });
      
      xhr.open("POST", "http://api.meaningcloud.com/summarization-1.0");
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      
      xhr.send(data);
    
}

function DisplayTranslation(data) {
  var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      
      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
          translation = this.responseText.substring(this.responseText.indexOf('text')+8,this.responseText.length-3);
          //document.getElementById('Translated').innerHTML = translation;
          document.getElementsByTagName('h4')[0].style.color = "#000";
          document.getElementById('translateTitle').style.display = "block";
          //animation countries
          var selectedCountry = document.getElementById('selection').value;
          console.log(selectedCountry);
          var bg = document.getElementById('translation');
          bg.className ='';
          bg.classList.add(selectedCountry);
          
          document.getElementsByTagName('h4')[0].innerHTML = translation;

        }
      });
      
      xhr.open("POST", "https://translate.yandex.net/api/v1.5/tr.json/translate?");
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      
      xhr.send(data);
    
}