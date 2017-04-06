window.onload=function(){

/*
  //get name from input
  $('#input-form').submit(function(e) {
    e.preventDefault();
    var nameSearched= $('#input').val();
    getMarvelResponse(nameSearched);
  });*/

  getMarvelResponse();

  function getMarvelResponse() {

    var PRIV_KEY = "c489aff329d83d09815b554f38d843ba42a5061a";
    var PUBLIC_KEY = "2a7fca050595ffa66aaf74e2b1bae70f";

    // new ts every request
    var ts = new Date().getTime();
    var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();

    var url = 'http://gateway.marvel.com/v1/public/comics';

    $.getJSON(url, {
      ts: ts,
      apikey: PUBLIC_KEY,
      limit: 100,
      //name: nameSearched,
      hash: hash
    })
    .done(function(data) {
      var imageWrapper = $('#imageWrapper');
      var listOfComics= data.data.results;

      listOfComics.forEach(function(singleComic){
        // append imgWrapper, overlayer and img only if the img is available
        if(singleComic.thumbnail.path.split('_')[2]!=="available"){
          var title= singleComic.title;
          console.log(singleComic);
          //create overlayer and img-tag
          var imgWrapper= "<div class='imgWrapper'>" +
                          "<div class='overlayer'><p>" + singleComic.title + "</p><p>Number of pages: " + singleComic.pageCount + "</p></div>" +
                          "<img src= '" + singleComic.thumbnail.path + "." + singleComic.thumbnail.extension + "' /> "+
                          "</div>";
          $('.content').append(imgWrapper);
        }
      })
    })
    .fail(function(err){
      console.log(err);
    });
  }
};
