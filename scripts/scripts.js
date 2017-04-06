window.onload=function(){

/*
  //get name from input
  $('#input-form').submit(function(e) {
    e.preventDefault();
    var nameSearched= $('#input').val();
    getMarvelResponse(nameSearched);
  });*/
  var modal = document.getElementById('myModal');
  function openModal(){
    console.log("hello");

    modal.style.display = "block";
  }
  $( "#content" ).click(function(e) {
    openModal();
  });
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
          //create overlayer and img-tag
          var imgWrapper= "<div class='imgWrapper' >" +
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

  // Get the modal

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

};
