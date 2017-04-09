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
      parseData(data)
    })
    .fail(function(err){
      console.log(err);
    });
  }

  function parseData(data) {
    var listOfComics= data.data.results;
    var myComicsDetails= [];
    listOfComics.forEach(function(singleComic){

      var imgUrl=singleComic.thumbnail.path;

      if(imgUrl.split('_')[1]!=="not"){
        var comic= createComicsDetails(singleComic, myComicsDetails);
        //console.log(comic.id);

        var comicWrapper= "<div class='comicWrapper' >" +
                        "<div class='overlayer'><p class='comic-title' id='" + comic.id + "'>" + comic.title + "</p></div>" +
                        "<img src= '" + comic.imageSrc + "' /> "+
                        "</div>";
        $('.content').append(comicWrapper);
      }
    })
    openOnClick(myComicsDetails);
  };

  function createComicsDetails(singleComic, myComicsDetails){

    var charactersName=[]
    var listOfAllChars= singleComic.characters.items

    for (item of listOfAllChars){
      charactersName.push(item.name)
    }
    //console.log(singleComic.id);
    var comic={
      title: singleComic.title,
      id: singleComic.id,
      imageSrc: singleComic.thumbnail.path + "." + singleComic.thumbnail.extension,
      description: singleComic.description,
      characters: charactersName,
      pageCount: singleComic.pageCount
    }
    myComicsDetails.push(comic);
    return comic;
  }

  function openOnClick(myComicsDetails){
    $('.content').click(function(e){
      if(e.target.tagName === "P"){
        openModal(e.target.innerHtml, myComicsDetails, e.target.id);
      }
    })
  }

  function findDetails(comicID, myComicsDetails){

    for (item of myComicsDetails){
      // parseInt because otherwise one is a string and the other is a number
      if(parseInt(comicID,10) === item.id){
        var modalData= {
          description: item.description,
          imageSrc:item.imageSrc,
          characters: item.characters,
          pageCount: item.pageCount
        }
        return modalData;
      }
    }
  }

  var modal = document.getElementById('myModal');

  function openModal(title, myComicsDetails, comicID){
    //modal.style.display = "block";
    modal.style.opacity = "1";
    modal.style.zIndex = "1";
    $('.modal-content').addClass('slide-in');
    $('body').addClass('bg-noscroll');
    //finds the data relative to the comic clicked on
    var modalData = findDetails(comicID, myComicsDetails);
    // and updates it to the modal
    addContent(modalData,title);
  }

  function addContent(modalData,title){
    $('#title').html(title);

    $('#comicImage').attr("src", modalData.imageSrc);

    if(modalData.pageCount>0){
      $('#pageCount').html('Number of pages: ' + modalData.pageCount);
    }else{
      $('#pageCount').empty();
    }

    if(modalData.description){
      $('#description').html(modalData.description);
    }else{
      $('#description').html('Description not available.');
    }

    if(modalData.characters.length===0){
      $('#characters').empty();
      $('#characters').append("<li>Characters not available.</li>")
    }else{
      $('#characters').empty();
      for (item of modalData.characters){
        $('#characters').append("<li>" + item + "</li>")
      }
    }
  }

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    closeModal()
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal()
    }
  }

  function closeModal(){
    //modal.style.display = "none";
    $('body').removeClass('bg-noscroll');
    $('.modal-content').removeClass('slide-in');
    modal.style.opacity = "0";
    modal.style.zIndex = "0";
  }
};
