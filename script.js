$(function() {

  $("#search").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=" + request.term,
        dataType: "json",
        data: {
          term: request.term
        },
        success: function(data) {
          var transformed = data.items.map(function(book) {
            return {
              title: book.volumeInfo.title,
              author: book.volumeInfo.authors,
              image: book.volumeInfo.imageLinks.thumbnail,
              info: book.volumeInfo.infoLink
            };
          });
          response(transformed);
        }
      });
    }
  }).autocomplete("instance")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append('<a href="'+ item.info +'" class="my-1" target="_blank">' + 
      '<img src="'+item.image +'"' +  "/>" + "<small>" +
      item.title + "</small>" + " - " + "<small>" +
      item.author+"</small>" +
      "</a>")
      .appendTo(ul);
  };
});

var start=0;


function getBooks(search) {
  bookSearch(search, start);
}


var totalItems;

function bookSearch(search, start){
  var search = document.getElementById('search').value
  document.getElementById('results').innerHTML = ""
  
  $.ajax({

    url:"https://www.googleapis.com/books/v1/volumes?q=" + search + "&maxResults=40&start=" + start,
    dataType: "json",

    success: function(data){
      totalItems = data.items;
 
      if(data.items){
      for(i = 0; i < data.items.length; i++){
        if(data.items[i].volumeInfo){
           var title = data.items[i].volumeInfo.title
           var subtitle = data.items[i].volumeInfo.subtitle
           var img = data.items[i].volumeInfo.imageLinks.thumbnail
           var date = data.items[i].volumeInfo.publishedDate
           var info = data.items[i].volumeInfo.infoLink
          results.innerHTML += 
          '<div class="card my-3" style="max-width: 540px;">'+
          '<div class="row no-gutters">'+
          '<div class="col-md-4">'+
          '<img src="'+img+'" class="card-img-top img-card" alt="...">'+
          '</div>'+
          '<div class="col-md-8">'+
          '<div class="card-body">'+
          '<h5 class="card-title">'+title+'</h5>'+
          '<p class="card-text subtitle">'+ subtitle  +'</p>'+
          '<p class="card-text"><small class="text-muted">'+ date +'</small></p>'+
          '<a href="'+info +'"target="_blank" class="btn bg-main text-second info">Book Info</a>'+
          '</div>'+
          '</div>'+
          '</div>'+
          '</div>'
        }
        numberOfPages = getNumberOfPages();
      }  
      if(totalItems > 40){
        start+=40;
        bookSearch("", start);
      }
    }
  },
  type: 'GET'
});
}
document.getElementById('button').addEventListener('click', bookSearch, false)

function load() {
  bookSearch();
  loadTotalItems();
}

var list = totalItems;
var numberPerPage = 5;
var pageList = new Array();
var currentPage = 1;
var numberOfPages = 0;



function getNumberOfPages(){
  return Math.ceil(list.length / numberPerPage)
}

function nextPage(){

  currentPage +=1;
  loadTotalItems();
}

function previousPage() {
  currentPage -= 1;
  loadTotalItems();
}

function firstPage() {
  currentPage = 1;
  loadTotalItems();
}

function lastPage() {
  currentPage = numberOfPages;
  loadTotalItems();
}

function loadTotalItems() {
  var begin = ((currentPage - 1) * numberPerPage);
  var end = begin + numberPerPage;

  pageList = list.slice(begin, end);
  bookSearch();
  check();
}


function check() {
  document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
  document.getElementById("previous").disabled = currentPage == 1 ? true : false;
  document.getElementById("first").disabled = currentPage == 1 ? true : false;
  document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}