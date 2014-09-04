$(function() {
    // your code here
    var apiKey = "dcce25287b437a887af549709e56a789";
	var baseUrl = "http://api.themoviedb.org/3/";
	var config;

	function initialize(callback) {
        $.get(baseUrl + 'configuration', {
            api_key: '0b1c30459eac1e2bbf48dbd4f72830fa'
        },function(res) {
            config = res;
            callback();
        });
    }
    function setEventHandlers(){
    	$(".filter-link").click(function(){
    		var query = $(this).attr("id");
    		queryMovies($(this).attr("id"),1);
    	});
    	$("#movie-search").submit(function(){
    		movieSearch($("#movie-search input").val(),1);
    		return false;
    	});
    	$("#top_rated").click();
    }
    function queryMovies(filter,page){
    	var url = baseUrl +"movie/" +filter;
		var reqParam = {
			api_key : apiKey,
			page : page
		}
		$.get(url,reqParam,function(response){showMovies(response,filter,"filter")});
		$(".page-header").html(filter.toUpperCase().replace("_"," "));
    }
    function movieSearch(query,page){
		var url = baseUrl + "search/movie";
		var reqParam = {
			api_key : apiKey,
			query : query,
			page : page
		}
		$.get(url,reqParam,function(response){showMovies(response,query,"search")});
		$(".page-header").html("Search Results");
    }
    function showMovies(result,query,type){
    	for(var i=0; i<result.results.length;i++){
    		var url = baseUrl + "movie/"+result.results[i].id +"/credits"
    		var reqParam = {
    			api_key : apiKey
    		}
    		 $.get(url,reqParam,function(response){
    		 	var count = (response.cast.length>4)?4:response.cast.length
    			for(var i=0;i<count;i++){
    				var cast = (i==cast-1)? response.cast[i].name: response.cast[i].name+", ";
    				$("#"+response.id).append(cast);
    			}
    			});
    		}

    	var templateValues = {
			"result":result,
			"config":config
		}
    	var html = getTemplate("tpl-list",templateValues);
    	//Pagination

    	var startingPage = (result.page);
    	var startingPage = (result.page<4)? 1:result.page-3;
		var endPage = (result.total_pages-result.page>7)? startingPage+7: result.total_pages;
		endPage = (endPage>1000)?1000:endPage;
		var pages = [];
		for (var i=startingPage;i<endPage;i++){
			var pageObj={
				page: i
			}
			pages.push(pageObj);
		}
		templateValues={
			"pages": pages,
			"currentPage":result.page,
			"query":query,
			"startingPage" : (result.page==1)? true: false,
			"endPage" : (result.page==endPage)? true: false
		}
		var page = getTemplate("tpl-page",templateValues);
		html = html + page;
		$("#movie-list").html(html);
		$(".page-link:contains('"+result.page+"')").parent().addClass("active");
		//Set Event for page Click
		$(".page-link").click(function(){
			if(type=="search"){
				var pageToView = $(this).data("id");
				movieSearch(query,pageToView);	
			}else{
				var pageToView = $(this).data("id");
				queryMovies(query,pageToView);
			}
		});

		//set Event for Movie Click

		$(".movie-link").click(function(){
			
			singleMovieQuery($(this).data("id"));
		});
    }
    function singleMovieQuery(id){
    	var url = baseUrl+"movie/"+id;
    	var reqParam = {
    		api_key: apiKey
    	}
    	$.get(url,reqParam,showSingleMovie)
    }
    function showSingleMovie(result){
    	
    }
    
    function getTemplate(sourceID,values){
    	var source   = $("#"+sourceID).html();
		var template = Handlebars.compile(source);	
		var html = template(values);
		return html;
    }

    initialize(setEventHandlers);

});