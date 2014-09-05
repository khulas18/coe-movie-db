
    // your code here
    var apiKey = "dcce25287b437a887af549709e56a789";
	var baseUrl = "http://api.themoviedb.org/3/";
	var config;

	function initialize(callback) {
        $.get(baseUrl + 'configuration', {
            api_key: apiKey
        },function(res) {
            config = res;
            callback();
        });
    }
    function setEventHandlers(){
    	$(".filter-link").click(function(){
    		showHideList(true);
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
    	console.log("click");
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
    	//casts
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
			"config":config,
			"header": query.toUpperCase().replace("_"," ")
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
				page: i,
			}
			if(i==result.page){
				pageObj.active = true;
			}
			pages.push(pageObj);
		}
		templateValues={
			"pages": pages,
			"currentPage":result.page,
			"query":query,
			"startingPage" : (result.page==1)? true: false,
			"endPage" : (result.page==endPage)? true: false,
			"lastPage": (result.total_pages>1000)?1000:result.total_pages
		}
		console.log(templateValues);
		var page = getTemplate("tpl-page",templateValues);
		html = html + page;
		$("#movie-list").html(html);

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
    	showHideList(false);
    	var url = baseUrl+"movie/"+id;
    	var reqParam = {
    		api_key: apiKey
    	}
    	$.get(url,reqParam,showSingleMovie)
    }
    function showSingleMovie(movie){
    	var templateValues = {
			"movie":movie,
			"config":config
		}
		reqParam = {
			api_key: apiKey
		}
		var url = baseUrl + "movie/"+ movie.id + "/credits";
		$.get(url,reqParam,function(casts){
			movie.casts= casts;

			url = baseUrl + "movie/"+ movie.id + "/videos";
			$.get(url,reqParam,function(videos){
				movie.videos = videos;

				url = baseUrl + "movie/"+ movie.id + "/images";
				 $.get(url,reqParam,function(images){
				 	movie.images= images;

				 	url = baseUrl + "movie/"+ movie.id + "/similar";
				 	$.get(url,reqParam,function(similar){
				 		movie.similar = similar;
				 		console.log(movie);
				 		writeTemplate("tpl-movie-view",templateValues,"movie-view");


				 	});
				 });
			});
		});

    	
    }
    function writeTemplate(sourceID,values,outputID){
		var html = getTemplate(sourceID,values)
		$("#"+outputID).html(html);
    }
    function getTemplate(sourceID,values){
    	var source   = $("#"+sourceID).html();
		var template = Handlebars.compile(source);	
		var html = template(values);
		return html;
    }
    function showHideList(visibility){
    	if(visibility){
    		$("#movie-list").show();
    		$("#movie-view").hide();
    	}else{
    		$("#movie-list").hide();
    		$("#movie-view").show();
    	}
    }

    //Handlebars helpers
    Handlebars.registerHelper('each_upto', function(ary, max, options) {
	    if(!ary || ary.length == 0)
	        return options.inverse(this);
	    var result = [ ];
	    for(var i = 0; i < max && i < ary.length; ++i)
	        result.push(options.fn(ary[i]));
	    return result.join('');
	});
	Handlebars.registerHelper('each_from', function(ary, starting, options) {
	    if(!ary || ary.length == 0)
	        return options.inverse(this);
	    var result = [ ];
	    for(var i = starting; i < ary.length; ++i)
	        result.push(options.fn(ary[i]));
	    return result.join('');
	});


    initialize(setEventHandlers);


	function togglePrevDiv(a){
		$(a).parent().prev().slideToggle();
	}