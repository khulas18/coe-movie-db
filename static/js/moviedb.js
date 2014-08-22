var apiKey = "dcce25287b437a887af549709e56a789";
var baseUrl = "http://api.themoviedb.org/3";
var prevQuery;
var functionToCall;
var totalPages;
function formatMovieHTML(movie){
	//make an html layout for a movie
	if(movie.original_title.length>40){
		movie.original_title = movie.original_title.substr(0,40)+".."
	}
	var html = '<div class="col-md-3 portfolio-item">'+
        '<a href="#">'+
            '<img height="100px"class="img-responsive" src="'+'https://image.tmdb.org/t/p/w130/'+movie.poster_path+'" alt="/static/img/gplus_sign_in.png">'+
        '</a>'+
        '<h4>'+
        '    <a href="#">'+movie.original_title+'</a>'+
        '</h4>'+
    '</div>';
    return html;
}
function searchMovie(query, page, callback){
	prevQuery = query;
	page = (page>1000)?1000:page;
	functionToCall = searchMovie;
	var url = baseUrl + "/search/movie";
	var reqParam = {
		api_key : apiKey,
		query : query,
		page : page
	}
	$.get(url,reqParam,callback);
	$(".page-header").html("Search Results");
}
function getMovies(query, page, callback){
	var url = baseUrl +"/movie/" +query;
	functionToCall = getMovies;
	prevQuery = query;
	var reqParam = {
		api_key : apiKey,
		page : page
	}
	$.get(url,reqParam,callback);
	$(".page-header").html($("#"+query).html()+" Movies");
}
function assignPage(result){
	console.log(result);
	$(".pagination").html("");
	totalPages = result.total_pages;
	var startingPage = (result.page<4)? 1:result.page-3;
	var endPage = (result.total_pages-result.page>7)? startingPage+7: totalPages;
	endPage = (endPage>1000)?1000:endPage;
	var html = '<li><a href="#" onclick="goToPage(1)">&laquo;</a></li>';
	$(".pagination").append(html);
	
	for(var i =startingPage;i<=endPage;i++){
		var html = (result.page==i)?'<li class="active"><span>'+i+'<span class="sr-only">(current)</span></span></li>'
			:'<li><a href="#" class="page-click">'+i+'</a></li>';
		$(".pagination").append(html);
	}

	var html = '<li><a href="#" onclick="goToPage(0)">&raquo;</a></li>';
	$(".pagination").append(html);
	var b = (result.page ==1)? 0:result.page-1;
	var a = (result.page==totalPages || totalPages==0)?result.total_results:(totalPages>0)?b*20+20:0;
	
	$("#page-number").html(b*20+"-"+a+" out of "+ result.total_results);
	
	displayMovies(result);
	$(".page-click").click(function(callback){
		var pageToSearch = $(this).text();
		functionToCall(prevQuery,pageToSearch,assignPage);
	});
}
function goToPage(pageToSearch){
	totalPages=(totalPages>1000)?1000:totalPages;
	pageToSearch = (pageToSearch==0)? totalPages : 1;

	functionToCall(prevQuery,pageToSearch,assignPage);
}
function displayMovies(result){
	$("#movie-list").html("");
	var movies = result.results;
	if(movies.length<1){
			$("#movie-list").html("<h2>No Result Found</h2>");
	}
	var movieFormatHTML;
	for(var i=0; i<movies.length;i++){
		movieFormatHTML = formatMovieHTML(movies[i]);
		var html = (i%4>0)?movieFormatHTML: '<div style="margin-top:10px;"></div>'+movieFormatHTML;
		$("#movie-list").append(html);
	}
}



$(document).ready(function() {
	getMovies("popular",1,assignPage);
	$("#movie-search").submit(function(){
		var val = $("#movie-search input").val();
		searchMovie(val,1,assignPage);
		return false;
	});
	$(".filter-link").click(function(){
		var query = $(this).attr("id");
		getMovies(query,1,assignPage);
	})

});