function Interface(){
	that = {};
	
	that.verifyPin = function(pin){
		 var error_obj = {
			header:"",
			content:"",
			submit_text : "Try again",
			cancel_text : "Cancel",
			callback: function(){  }
		}; 
			
		if(pin == "" || pin == null || isNaN(pin)){
			error_obj.header = "Opps! PIN Error";
			error_obj.content = "Please enter a PIN before submitting.";
			ui.callModal(error_obj);
		}else{
			//if a pin is in correct format...pass it along to the website
			$.ajax({
			url: basePINurl + "?task=verifyPin",
			type: "GET",
			data: {pinData: pin, authcode: 'verifyPin'}
			}).error(function(error){
				ui.hideLoader();
				if(error == "error"){
					error_obj.header = "Opps! PIN Error";
					error_obj.content = "There was an error communicating with the server. Please try again.";
					ui.callModal(error_obj);
				}
			}).done(function(result) {
				ui.hideLoader();
				if(result == "invalid pin"){
					error_obj.header = "Opps! PIN Error";
					error_obj.content = "The PIN you entered was not valid. Please try again";
					ui.callModal(error_obj);
				}else{
					var jsonObject = str2JSON(result);
					app.createConfigFile(jsonObject);
				}
			});
		}
	};
	
	that.getLatestFeedData = function(feedURL, updateOnly, latestID, categories, overwrite){
		var passedData = {};
		
		if(updateOnly == true){
			if(overwrite){
				latestID = -1;
			}
			passedData = {action: 'mobilefeed', method: 'category', latestPostID: latestID, category: categories};
		}else{
			passedData = {action: 'mobilefeed', method: 'home',};
		}
		
		$.ajax({
			url:feedURL,
			type: "GET",
			data: passedData
			}).error(function(error){
				ui.hideLoader();
				if(error == "error"){
					var error_obj = {
						header:"",
						content:"",
						submit_text : "Close",
						//callback: function(){  }
					}; 
					error_obj.header = "Oops! Connection Error";
					error_obj.content = "We're having trouble communicating with the server. Please try again later.";
					ui.callModal(error_obj);
				}
			}).done(function(result) {
				ui.hideLoader();
				if(result == "error"){
					var error_obj = {
						header:"",
						content:"",
						submit_text : "Close",
					}; 
					error_obj.header = "Oops! Connection Error";
					error_obj.content = "We're having trouble communicating with the server. Please try again later.";
					ui.callModal(error_obj);
				}else{
					//if the updateOnly flag is passed, the user has chosen to update the feed
					//the first time this function is called, it is without that flag as it's the first
					//time the app is getting the data
					if(updateOnly == true){
						if(result != "" && result != "0" && result.substr(0,2) == '[{'){
							var jsonObject = str2JSON(result);
							app.onDataFeedUpdateGet(jsonObject, overwrite);	
						}else{
							if(currentStep == 'saveCategoryChoices'){
							  var error_obj = {
								  header:"",
								  content:"",
								  submit_text : "Close"
							  }; 
							  error_obj.header = "Empty Category";
							  error_obj.content = "Your selected categories haven't had any posts. Please select other one!";
							  ui.callModal(error_obj);
							}
						}
					}else{
						if(result != "" && result != "0" && result.substr(0,2) == '[{'){
							var jsonObject = str2JSON(result);
							app.onDataFeedGet(jsonObject);
						}else{
							var error_obj = {
								header:"",
								content:"",
								submit_text : "Close",
							}; 
							error_obj.header = "Oops! Connection Error";
							error_obj.content = "We're having trouble communicating with the server. Please try again later.";
							ui.callModal(error_obj);
						}
						
					}
				}
			});
			currentStep  = '';
	};
	
	that.getPreviousFeedData = function(feedURL, firstID, categories){
		passedData = {action: 'mobilefeed', method: 'category', latestPostID: firstID, category: categories, type: 'older'};
		
		$.ajax({
			url:feedURL,
			type: "GET",
			data: passedData
			}).error(function(error){
				ui.hideLoader();
				if(error == "error"){
					var error_obj = {
						header:"",
						content:"",
						submit_text : "Close",
						//callback: function(){  }
					}; 
					error_obj.header = "Oops! Connection Error";
					error_obj.content = "We're having trouble communicating with the server. Please try again later.";
					ui.callModal(error_obj);
				}
			}).done(function(result) {
				ui.hideLoader();
				if(result == "error"){
					var error_obj = {
						header:"",
						content:"",
						submit_text : "Close",
					}; 
					error_obj.header = "Oops! Connection Error";
					error_obj.content = "We're having trouble communicating with the server. Please try again later.";
					ui.callModal(error_obj);
				}else{
					//grab the older posts and add them to the view but don't save them to the feed file as it's stale data
					if(result != "" && result != "0" && result.substr(0,2) == '[{'){
						var jsonObject = str2JSON(result);
						app.onOldDataFeedGet(jsonObject);
					}else if(result.substr(0,2) != '[{' && result != "" && result != "0"){
						var error_obj = {
							header:"",
							content:"",
							submit_text : "Close",
						}; 
						error_obj.header = "Oops! Connection Error";
						error_obj.content = "We're having trouble communicating with the server. Please try again later.";
						ui.callModal(error_obj);
					}else{
						var error_obj = {
							header:"",
							content:"",
							submit_text : "Close",
						}; 
						error_obj.header = "Sorry, No More News";
						error_obj.content = "Looks like there is no older news available at this point.";
						ui.callModal(error_obj);
					}
				}
			});
	};

	return that;
}

//helper function to parse string to JSON Object
function str2JSON(str){
	return JSON.parse(str);
}