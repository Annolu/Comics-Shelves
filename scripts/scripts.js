window.onload=function(){

/*
  //get name from input
  $('#input-form').submit(function(e) {
    e.preventDefault();
    var nameSearched= $('#input').val();
    getMarvelResponse(nameSearched);
  });*/

  function createLoader(){
    $('.spinner-wrapper').prepend("<div class='spinner-content'></div>")
    $('.spinner-wrapper').append("<p>Loading</p>")
    for (var i = 1; i < 5; i++) {
      $('.spinner-content').append("<div class='spinner buble-" + i + "'></div>")
    }
  }

  createLoader()

  getMarvelResponse();

  function getMarvelResponse() {

    var PRIV_KEY = "c489aff329d83d09815b554f38d843ba42a5061a";
    var PUBLIC_KEY = "2a7fca050595ffa66aaf74e2b1bae70f";
    // new ts every request
    var ts = new Date().getTime();
    var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
    var url = 'https://gateway.marvel.com/v1/public/comics';

    $.getJSON(url, {
      ts: ts,
      apikey: PUBLIC_KEY,
      limit: 100,
      //name: nameSearched,
      hash: hash
    })
    .done(function(data) {
      parseData(data)
      hideLoader()
    })
    .fail(function(err){
      console.log(err);
    });
  }

  function hideLoader(){
    preloaderFadeOutTime= 500;
    function hidePreloader(){
      var preloader= $('.spinner-wrapper');
      preloader.fadeOut(preloaderFadeOutTime)
    }
    hidePreloader();
  }

  function parseData(data) {
    var listOfComics= data.data.results;
    var myComicsDetails= [];
    listOfComics.forEach(function(singleComic){
      var imgUrl=singleComic.thumbnail.path;

      if(imgUrl.split('_')[1]!=="not"){
        var comic= gatherComicsDetails(singleComic, myComicsDetails);
        var comicWrapper= "<div class='comic-wrapper' >" +
                        "<div class='overlayer'><p class='comic-title' id='" + comic.id + "'>" + comic.title + "</p></div>" +
                        "<img src= '" + comic.imageSrc + "' /> "+
                        "</div>";
        $('#content').append(comicWrapper);
      }
    })
    //detects the click that opens the modal
    openOnClick(myComicsDetails);
  };

  function gatherComicsDetails(singleComic, myComicsDetails){

    var charactersNames=[];
    var creatorsNames=[]
    var listOfAllChars= singleComic.characters.items;
    var listOfAllCreators= singleComic.creators.items;

    for (item of listOfAllCreators){
      creatorsNames.push(item.name + " as: " + item.role)
    }

    for (item of listOfAllChars){
      charactersNames.push(item.name)
    }
    //console.log(singleComic.id);
    var comic={
      title: singleComic.title,
      id: singleComic.id,
      imageSrc: singleComic.thumbnail.path + "." + singleComic.thumbnail.extension,
      description: singleComic.description,
      characters: charactersNames,
      creators: creatorsNames,
      pageCount: singleComic.pageCount
    }
    myComicsDetails.push(comic);
    return comic;
  }

  function openOnClick(myComicsDetails){
    $('#content').click(function(e){
      //the model opens if I click on the title p-tag
      if(e.target.tagName === "P"){
        //open modal with data depending on which comic I clicked on
        openModal(myComicsDetails, e.target.id);
      }
    })
  }

  var modal = document.getElementById('myModal');

  function openModal(myComicsDetails, comicID){
    modal.style.opacity = "1";
    modal.style.zIndex = "1";
    $('#modal-content').addClass('slide-in');
    $('body').addClass('bg-noscroll');
    //finds the data relative to the comic clicked on, based on the id
    findDetails(comicID, myComicsDetails);
  }

  function findDetails(comicID, myComicsDetails){

    for (item of myComicsDetails){
      // parseInt because otherwise one is a string and the other is a number
      if(parseInt(comicID,10) === item.id){
        //date of the comic I clicked on
        var modalData= {
          title:item.title,
          description: item.description,
          imageSrc:item.imageSrc,
          characters: item.characters,
          pageCount: item.pageCount,
          creators: item.creators
        }
        //add content to modal
        addContent(modalData);
      }
    }
  }

  function addContent(modalData){
    //ecmascript6 destructing assignment
    let {title, description, imageSrc,characters, pageCount, creators} = modalData;

    $('#title').html(title);
    $('#comicImage').attr("src", imageSrc);

    if(pageCount>0){
      $('#pageCount').html('Number of pages: ' + pageCount);
    }else{
      $('#pageCount').empty();
    }

    if(description){
      $('#description').html(description);
    }else{
      $('#description').html('Description not available.');
    }

    if(creators.length===0){
      $('#creators').empty();
      $('#creators').append("<li>Creators not available.</li>")
    }else{
      $('#creators').empty();
      for (item of creators){
        $('#creators').append("<li>" + item + "</li>")
      }
    }

    if(characters.length===0){
      $('#characters').empty();
      $('#characters').append("<li>Characters not available.</li>")
    }else{
      $('#characters').empty();
      for (item of characters){
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
    $('#modal-content').removeClass('slide-in');
    modal.style.opacity = "0";
    modal.style.zIndex = "0";
  }
};
