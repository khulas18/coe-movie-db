var apiKey = "dcce25287b437a887af549709e56a789";
var baseUrl = "http://api.themoviedb.org/3";
var prevQuery;
var functionToCall;
var totalPages;
var hist=new Array();
var firstBack=true;
function init(){
	$(document).ready(function() {
		getMovies("popular",1,assignPage);
		$("#movie-search").submit(function(){
			var val = $("#movie-search input").val();
			searchMovie(val,1,assignPage);
			showResults();
			return false;
		});
		$(".filter-link").click(function(){
			var query = $(this).attr("id");
			getMovies(query,1,assignPage);
			showResults();
		});
		$(".similar-toggle").click(function(){
			$("#similar-movies2").toggle();
			$(".similar-toggle").toggle();	

		});
		$("#movie-view").hide();
		$("#back").click(goBack);
	});
}
function formatMovieHTML(movie){
	//make an html layout for a movie
	var imageUrl = 'https://image.tmdb.org/t/p/w130/';
	if(movie.original_title.length>40){
		movie.original_title = movie.original_title.substr(0,40)+"..";
	}
	if(!movie.poster_path){
		imageUrl = "/static/img/movie.jpg";
	}else{
		imageUrl +=movie.poster_path;
	}
	var html = '<div class="col-md-3 portfolio-item" data-id="'+movie.id+'">'+
        '<a href="#">'+
            '<img height="100px"class="img-responsive" src="'+imageUrl+'" alt="/static/img/logo.png">'+
        '</a>'+
        '<h4>'+
        '    <a href="#" >'+movie.original_title+'</a>'+
        '</h4>'+
    '</div>';
    return html;
}
function makeEmbed(key){
	return '<embed width="500" height="400" src="https://www.youtube.com/v/'+key+'" type="application/x-shockwave-flash">'
}
function createMovieLink(movie){
	movie.title = (movie.title.length<1)? movie.original_title : movie.title;
	var html = '<a href="javascript:void(0)" data-id="'+movie.id+'" class="similar-click">'+movie.title+'</a>';
	return html;
}
function createImg(key){
	var imageUrl = 'https://image.tmdb.org/t/p/w130/';
	return "<span class='img'><img src='"+imageUrl+key+"'></span>";
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
	$(".col-md-3").click(movieClick);
}
function queryMovie(id){
	url = baseUrl + "/movie/"+id;

	reqParam = {api_key:apiKey};
	$.get(url,reqParam,showMovie);
}
function showMovie(result){
	showViewPage();
	$(".page-header").text(result.original_title);
	var synopsis = result.overview;
	$("#synopsis").text(synopsis);
	var url = baseUrl + "/movie/"+result.id+"/videos";
	reqParam = {api_key:apiKey};
	$.get(url,reqParam,showVideos);
	url = baseUrl + "/movie/"+result.id+"/credits";
	$.get(url,reqParam,showCasts);
	url = baseUrl + "/movie/"+result.id+"/similar";
	$.get(url,reqParam,showSimiralMovies);
}
function showVideos(result){
	result = result.results;
	var youtubeUrl = "https://www.youtube.com/v/";
	var embed;
	if(result.length>1){
		embed = makeEmbed(result[0].key);
		$("#Trailer1").html(embed);
		embedUrl = youtubeUrl + result[1].key;
		$("#Trailer2").html(embed);
		$("[href = '#Trailer2'").show();	
	}else if(result.length>0){
		embed = makeEmbed(result[0].key);
		$("#Trailer1").html(embed);
		$("Trailer1").tab("show");
		$("[href = '#Trailer2'").hide();	
	}else{
		embed = "<br>No Trailer Available"
		$("#Trailer1").html(embed);
		$("Trailer1").tab("show");
		$("[href = '#Trailer2'").hide();
	}
}
function showCasts(result){
	var casts="";
	var imageUrl = 'https://image.tmdb.org/t/p/w130/';
	console.log(result);
	for(var i=0;i<result.cast.length;i++){

		casts = createImg(result.cast[i].profile_path)+"<div class='name'>"+result.cast[i].name+" as " +result.cast[i].character+"</div><hr>";
		if(i<4){
			$("#casts").append(casts);
		}
		else{
			$("#casts2").append(casts);
		}
	}
	$("#showCasts").click(function(){
		$("#casts2").toggle();
		var text = ($(this).text()=="Show All")? "<a href='javascript:void(0)'>Show Less</a>": "<a href='javascript:void(0)'>Show All</a>";
		$(this).html(text);
	});
}
function showSimiralMovies(result){
	var similarMovies = result.results;
	console.log(similarMovies);
	var movies;
	$("#similar-movies1").html("");
	$("#similar-movies2").html("");
	for(var i=0;i<similarMovies.length;i++){
		movies= createImg(similarMovies[i].poster_path)+'<div class="movie-title">'+createMovieLink(similarMovies[i])+"</div><hr>";
		if(i<4){
			$("#similar-movies1").append(movies);
		}else{
			$("#similar-movies2").append(movies);
		}
	}
	$(".similar-click").click(function(){
		var id=$(this).attr("data-id");
		hist.push(id);
		firstBack=true;
		queryMovie(id);
	});	
}
function movieClick(){
	var id = $(this).attr("data-id");
	queryMovie(id);
	hist.push(id);
	firstBack=true;
}
function goBack(a){
	if(firstBack){
		hist.pop();
	}
	if(hist.length<1){
		showResults();
	}else{
		var id = hist.pop();
		console.log(id)
		queryMovie(id);
	}
	firstBack=false;
}
function showViewPage(){
	$("#movie-list, #page-number,.pagination").hide();
	$("#movie-view").show();
}
function showResults(){
	$("#movie-list, #page-number,.pagination").show();
	$("#movie-view").hide();
}
