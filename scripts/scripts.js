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
      var listOfComics= data.data.results;
      var comicsDetails= [];
      listOfComics.forEach(function(singleComic){

        if(singleComic.thumbnail.path.split('_')[2]!=="available"){

          var comic={
            title: singleComic.title,
            id: singleComic.id,
            imageSrc: singleComic.thumbnail.path + "." + singleComic.thumbnail.extension,
            description: singleComic.description,
            characters: singleComic.characters.items
          }

          comicsDetails.push(comic);

          var comicWrapper= "<div class='comicWrapper' >" +
                          "<div class='overlayer'><p class='comic-title'>" + comic.title + "</p></div>" +
                          "<img src= '" + comic.imageSrc + "' /> "+
                          "</div>";
          $('.content').append(comicWrapper);
        }
      })

      $('.content').click(function(e){
        if(e.target.tagName === "P"){
          openModal(e.target.innerHTML, comicsDetails);
        }
      })
    })
    .fail(function(err){
      console.log(err);
    });
  }

  function findDetails(title, comicsDetails){
    for (item of comicsDetails){
      if(title === item.title){
        return item.imageSrc;

      }
    }
  }

  // Get the modal
  var modal = document.getElementById('myModal');

  function openModal(title, comicsDetails){
    modal.style.display = "block";
    $('#title').html(title);
    var details = findDetails(title, comicsDetails);
    $('#comicImage').attr("src", details);
  }

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
