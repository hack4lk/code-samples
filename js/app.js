/*
 * This is the main app file for the entire application
*/

function App(){
	that = {};
	var configFile = null;
	var logoFile = null;
	var viewData = $("#app");
	var fileWriteFlag = null;
	var fileReadFlag = null;
	var catOptions = null;
	var notifyFlag = false;
	var deviceData = {};
	var hideWarning = false;
	var viewsLoaded = 0;
    var viewsTotal = 0;
    var viewsToLoad = [];
    var globalCallBack = "";
	var isPane = false;
	var scrollOffset = 0;
	
	that.isOnline = function(){
		var networkState = navigator.connection.type;
		//var networkState = "test";
		return networkState;
	};
	
	that.checkConfigFile = function(){
		var fileEntry = window.localStorage.getItem("config");
		
		if(fileEntry == "" || fileEntry == null || fileEntry == undefined){
			configFile = -1;
		}else{
			configFile = JSON.parse(fileEntry);
		}
		
		configFileLookupEnd();
	};
	
	/*
	 * This function is triggered when the lookup for the config file ends
	*/
	var configFileLookupEnd = function(){
		//after we find out if the app is online and if the config file exists
		//we load data or show activation screen
		//output.html( "config: " + app.getConfigFileStatus() );
		if ( getConfigFileStatus() == -1 && isOnline == 'none' ){
			loadView('no_access', noAccessLoadComplete);
		}else if( getConfigFileStatus() == -1 && isOnline != 'none'){
			//this will get called when the user is online but
			//the app has not been registered yet
			loadView('pin_access', pinScreenLoadComplete);
		}else{
			if(deviceData.OS != 'Android' ||  ( deviceData.OS == 'Android' && deviceData.OSVersion > 3)){
				setupNotifications();
			}
			addEventHandlers();
			fetchNewData = true;
			readFileData("config", onConfigFileReadEnd);
		}
	};
	
	var getConfigFileStatus = function(){
		return configFile;
	};
	
	function onConfigFileReadEnd(data){
		accountInfo = JSON.parse(data);
		readFileData("feedData", onFeedDataReadEnd);
	};
	
	
	/*
	 * ***************************************************
	 * The next couple functions are associated with the pin screen and
	 * with creating the config file as well as downloading all assets
	 * and saving assets locally as well as the no access screen
	 * ***************************************************
	*/
	
	var noAccessLoadComplete = function(){
		ui.setView('no_access');
	};
	
	//this function is the callback for the PIN screen
	var pinScreenLoadComplete = function(){
		ui.setView('pin_access');
		//createPinScreen();
		$("#pinsubmitbtn").on("click", function(){
			pinCode = $("#pincode").html();
			externalInterface.verifyPin(pinCode);
			
			ui.showLoader();
		});
	};
	
	//this function creates the config file when it comes back with the data.
	that.createConfigFile = function(accountData){
		configFile = null;
		accountInfo = accountData;
		
		window.localStorage.setItem("config", JSON.stringify(accountInfo));
		configFile = 1;
		configFileWriteEnd();
	};
	
	//after the config file is written, we need to download the
	//company logo and save it to the app media
	var configFileWriteEnd = function(){
		if ( getConfigFileStatus() == -1 ){
			var error_obj = {
				submit_text : "Close",
			}; 
			error_obj.header = "Save Error";
			error_obj.content = "Seems we can't save your configuration. Please close the application and try again.";
			ui.callModal(error_obj);
		}else if ( getConfigFileStatus() == 1 ){
			downloadInitData();
		}
	};
	
	//the following 2 methods download the logo and save to app
	//since this is only called once when we download the config settings
	//we can use the 'accountInfo' variable since it holds all the account
	//information and won't be available next time app is run
	var downloadInitData = function(){
		var logoURI = accountInfo.logo;
		clientLogo = logoURI;
		downloadClientLogoEnd(logoURI);		
	};
	
	var downloadClientLogoEnd = function(logoURL){
		if(logoFile == -1){		
			var error_obj = {
				submit_text : "Close",
			}; 
			error_obj.header = "Opps! Download Error";
			error_obj.content = "We're having trouble downloading some application files. Please close the application and try again.";
			ui.callModal(error_obj);
			
			that.deleteConfigFile();
		}else{
			logoFile = clientLogo;
			//download initial stream data...
			saveDataToFile('clientLogo', clientLogo, onLogoFileWriteEnd);
		}
	};
	
	var onLogoFileWriteEnd = function(){
		if(fileWriteFlag == -1){
			that.deleteConfigFile();
			
			var error_obj = {
				submit_text : "Close",
			}; 
			error_obj.header = "Opps! Save Error";
			error_obj.content = "We're having trouble saving files to your device. Please close the application and try again.";
			ui.callModal(error_obj);
			
		}else{
			downloadFeedData();
		}
		
	};
	
	/*--------------------End of PIN screen and config methods-----------------*/
	/* *************************************************************************/
	
	
	/*
	 * ******************************************
	 * The next several function have to do with getting saving and deleting feed data
	 * ******************************************
	 */
	var downloadFeedData = function(){
		externalInterface.getLatestFeedData(accountInfo.dataurl);
	};
	
	that.onDataFeedGet = function(feedData){
		initFeedData = feedData;
		postData = feedData;
		saveDataToFile('feedData', feedData, onFeedDataWriteEnd);
	};
	
	var onFeedDataWriteEnd = function(){
		loadView(['home_feed','header','menu_categories','menu_settings'], homeFeedLoadComplete);
	};
	
	var onFeedDataReadEnd = function(data){
		if(fileReadFlag == 1){
			postData = str2JSON(data);
		}else{
			var error_obj = {
				submit_text : "Close",
			}; 
			error_obj.header = "Opps! Read Error";
			error_obj.content = "We're having trouble reading your news feed data. Please close the application and try again.";
			ui.callModal(error_obj);
		}
		readFileData("clientLogo", onLogoReadEnd);
	};
	
	var onLogoReadEnd = function(data){
		logoFile = data.replace(new RegExp('"', 'g'), '');
		loadView(['home_feed','header','menu_categories','menu_settings'], homeFeedLoadComplete);
	};
	
	that.getLogo = function(){
		return logoFile;
	};
	
	that.updateDataFeed = function(overwriteFlag){
		isOnline = app.isOnline();
		
		if(isOnline != 'none'){
			ui.showLoader();
			//check to see if we should overwrite the feed
			if(overwriteFlag != true){
				overwriteFlag = false;
			}
			//get highest id of content
			var lastID = 0;
			
			for(var i=0; i<postData.length; i++){
				if(postData[i].id > lastID){
					lastID = postData[i].id;
				}
			}	
			
			//gather only the categories that user is subscribed to
			var cats = "";
			var tempCats = accountInfo.options;			
			
			for(var key in tempCats){
				var tempObj = tempCats[key];
				if(tempObj[2] == 'yes'){
					cats += key + ",";
				}
			}
				
			externalInterface.getLatestFeedData(accountInfo.dataurl, true, lastID, cats, overwriteFlag);
		}else{
			var error_obj = {
				submit_text : "Continue"
				//submit_function : "testResponse",
			}; 
			error_obj.header = "Offline Mode";
			error_obj.content = "Your device seems to be offline. Please enable an internet connection on your device to view the latest news.";
			ui.callModal(error_obj);
		}
	};
	
	that.loadMore = function(){
		isOnline = app.isOnline();
		
		if(isOnline != 'none'){
			ui.showLoader();
			var firstID = -1;
			
			for(var i=0; i<postData.length; i++){
				if(postData[i].id < firstID || firstID == -1){
					firstID = postData[i].id;
				}
			}	
			
			//gather only the categories that user is subscribed to
			var cats = "";
			var tempCats = accountInfo.options;			
			
			for(var key in tempCats){
				var tempObj = tempCats[key];
				if(tempObj[2] == 'yes'){
					cats += key + ",";
				}
			}
			externalInterface.getPreviousFeedData(accountInfo.dataurl, firstID, cats);
			
		}else{
			var error_obj = {
				submit_text : "Continue"
				//submit_function : "testResponse",
			}; 
			error_obj.header = "Offline Mode";
			error_obj.content = "Your device seems to be offline. Please enable an internet connection on your device to load more news.";
			ui.callModal(error_obj);
		}
	};
	
	that.onOldDataFeedGet = function(feedData){
		updateHomeFeedOldData(feedData);
		postData = $.merge(postData, feedData);
	};
	
	
	that.onDataFeedUpdateGet = function(updateData, overwriteData){
		if(overwriteData){
			postData = updateData;
		}else{
			sendInAppNotification(updateData.length);
			
			if(updateData.length == 10){
				postData = updateData;
			}else{
				postData = $.merge(updateData, postData);
				postData = postData.slice(0,10);
			}
		}
		saveDataToFile('feedData', postData, onFeedDataWriteEnd);
	};
	
	/*
	 * ***************************************************
	 * Next several function have to do with updating the feed categories and
	 * application settings  
	 * **************************************************
	 */
	
	that.viewCategories = function(){
		loadView('categories', categoriesViewLoadComplete);
				
	};
	
	function categoriesViewLoadComplete(){
		var tempCats = accountInfo.options;			
		createCategoriesScreen(tempCats);
	}
	
	that.saveCategoryChoices = function(){
		isOnline = app.isOnline();
		
		if(isOnline != 'none'){
			var choices = $("#categories-list .listing :input");
			currentStep = 'saveCategoryChoices';
			
			for(var i=0; i<choices.length; i++){
				var target = $( choices[i] );
				var isChecked =  target.is( ":checked" );
				var optionsName = target.attr('id');
				if( isChecked == true){
					accountInfo.options[optionsName][2] = 'yes';
				}else{
					accountInfo.options[optionsName][2] = 'no';
				}
			}
			
			saveDataToFile('config', accountInfo, onConfigFileUpdateWriteEnd);
		}else{
			var error_obj = {
				submit_text : "Continue"
				//submit_function : "testResponse",
			}; 
			error_obj.header = "Offline Mode";
			error_obj.content = "Your device must be online to save your preferences. Please enable an internet connection and try again.";
			ui.callModal(error_obj);
		}
		
	};
	
	function onConfigFileUpdateWriteEnd(){
		if(fileWriteFlag == -1){
			var error_obj = {
				submit_text : "Close",
			}; 
			error_obj.header = "Opps! Save Error";
			error_obj.content = "We're having trouble updating your preferences. Please close the application and try again.";
			ui.callModal(error_obj);
		}else{
			app.updateDataFeed(true);
		}
	}
	
	that.viewSettings = function(){
		loadView('settings', settingsViewLoadComplete);
	};
	
	function settingsViewLoadComplete(){
		//need to add setting components....
	}
	
	that.openHelpEmailWindow = function(){
		var msg = "mailto:" + accountInfo.emailHelp + "?subject=Mobile App Issues";
		msg += "&body=OS ["+device.platform+"] -- ";
		msg += "VERSION ["+device.version+"]\n\n";
		
		window.location.href = msg;
	};
	
	/*
	 * *********************************************
	 * The next several function have to deal with digesting
	 * post data gotten from the feed
	 * *********************************************
	 */
	that.getPostData = function(){
		return postData;
	};
	
	that.getPost = function(postID){
		targetPost = postID;
		loadView('single_post', singlePostLoadComplete, true);
	};
	
	var singlePostLoadComplete = function(){
		createSinglePostScreen();
		ui.setView('single_post');
		ui.togglePane();
	};
	
	that.showNewsFeed = function(backButtonPressed){
		if(backButtonPressed == true){
			hideWarning = true;
		}
		loadView(['home_feed','header','menu_categories','menu_settings'], homeFeedLoadComplete);
	};
	
	var homeFeedLoadComplete = function(){
		createHomeFeedScreen();
		ui.setView('home_feed');
		//if the app is just starting, it's going to read the cached data
		//and if so, lets make a call online to see if there is anything else new?
		isOnline = app.isOnline();

		if(isOnline != 'none'){
			if(fetchNewData == true){
				fetchNewData = false;
				app.updateDataFeed();
				ui.showLoader();
			}
		}else{
			if(!hideWarning){
				var error_obj = {
					submit_text : "Continue"
					//submit_function : "testResponse",
				}; 
				error_obj.header = "Offline Mode";
				error_obj.content = "Your device seems to be offline. Please enable an internet connection on your device to view the latest news.";
				ui.callModal(error_obj);
			}
			hideWarning = false;
		}
	};
	
	/*
	 * *****************************************
	 * Below are the functions responsible for local
	 * notifications
	 * *****************************************
	 */
	var setupNotifications = function(){
		document.addEventListener("pause", startBGnotifications, false);
		document.addEventListener("resume", stopBGnotifications, false);

		window.plugin.notification.local.onclick = function (id, state, json) {
		   //need to add a message about new stories added
		};
	};
	
	var startBGnotifications = function(){
		noticeTimer = setInterval(function(){
			app.updateDataFeed();
		}, 300000);
	};
	
	var stopBGnotifications = function() {
	    clearInterval(noticeTimer);
	};
	
	var sendInAppNotification = function(numbNewStories){
		if(deviceData.OS != 'Android' ||  ( deviceData.OS == 'Android' && deviceData.OSVersion > 3)){
			
			if(numbNewStories > 0){
				window.plugin.notification.local.add({
				    id:         22,  // A unique id of the notifiction
				    date:       new Date(),    // This expects a date object
				    message:    numbNewStories + " new article(s)",  // The message that is displayed
				    title:      "New Articles Available",  // The title of the message
				    //repeat:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
				    badge:      numbNewStories,  // Displays number badge to notification
				    // sound:      String,  // A sound to be played
				    json:       '{"newStories":"' + numbNewStories + '"}'  // Data to be passed through the notification
				    //autoCancel: Boolean, // Setting this flag and the notification is automatically canceled when the user clicks it
				    //ongoing:    Boolean, // Prevent clearing of notification (Android only)
				});
			}
		}
	};
	
	/*
	 ********************************************
	 * Below are all App helper functions and other functions
	 * which are not tied to any specific view or action
	 ********************************************
	 */
	var addEventHandlers = function(){
		//if the device is Android
		if(deviceData.OS == 'Android'){
			document.addEventListener("backbutton", onBackKeyDown, false);
		}
	};
	
	function onBackKeyDown() {
		if($('#bodycontent').hasClass('out')){
			ui.hideMenu();
		}else if(currentPage != 'home_feed' && currentPage != 'pin_access' && currentPage != 'no_access' && currentPage != null){
			app.showNewsFeed();
		}else{
			//exit app
			navigator.app.exitApp();
		}
	}
	
	var loadView = function(view, callbackFunction, isPane){
		//check to see if we're loading the data into the starndard app
		//containe or to the slide in page
		if(isPane != '' && isPane == true){
			viewData = $("#pane");
		}else{
			viewData = $("#app");
		}
		
		if($.isArray(view)){
			viewsLoaded = 0;
            viewsTotal = $(view).length;
            viewsToLoad = view;
            globalCallBack = callbackFunction;
            viewData.html("");
            
            loadSingleView();
		}else{
		  viewData.html("");
		  var fullName = "views/" + view + ".html";
		  $.ajax({
			  url: fullName
			  }).done(function(result) {
				  viewData.html(result);
				  //callback function to update css on views
				  if(callbackFunction != ""){					  
					  callbackFunction();
				  }	
			  });
		}
			
	};
	
	var loadSingleView = function(){
		var tempIndex = viewsToLoad[viewsLoaded];
        if(viewsLoaded == viewsTotal){
            createCategoryOptions(accountInfo.options);
            if(globalCallBack != ""){					  
			  globalCallBack();
			}	
        }else{
			var file_path = (_includes_pages.indexOf(viewsToLoad[viewsLoaded]) > -1) ? 'views/includes/' : 'views/';
			var fullName = file_path + viewsToLoad[viewsLoaded] + ".html";
			
			$.ajax({
			url: fullName
			}).done(function(result) {
				if(tempIndex == 'header'){
					$('#bodycontent #appHeader').append(result);
				}else{
					viewData.append(result);
				}
				
				viewsLoaded++;
            	loadSingleView(viewsLoaded);
			});
        }
   };

	
	that.deleteConfigFile = function(){
		window.localStorage.removeItem("config");
		window.localStorage.removeItem("feedData");
		configFile = 1;
		configFileDeleteEnd();
	};
	
	var configFileDeleteEnd = function(){
		if ( getConfigFileStatus() == -1 ){
			var error_obj = {
				submit_text : "Close"
				//submit_function : "testResponse",
			}; 
			error_obj.header = "Oops! Update Error";
			error_obj.content = "Seems like we're having an updating the application. Please try again later.";
			ui.callModal(error_obj);
		}else if ( getConfigFileStatus() == 1 ){
			//check if we're online first and then show the correct screen
			isOnline = app.isOnline();
			if(isOnline != 'none'){
				loadView('pin_access', pinScreenLoadComplete);	
			}else{
				loadView('no_access', noAccessLoadComplete);
			}
			
		}		
	};
	
	that.resetApp = function(){
		var confirm_obj = {
			submit_text : "Confirm",
			cancel_text : "Cancel",
			submit_function : "deleteConfigFile",
		}; 
		confirm_obj.header = "Confirm Reset";
		confirm_obj.content = "Please note that resetting the application will delete all your data and preferences!";
		ui.callModal(confirm_obj);	
	};
	
	var saveDataToFile = function(file, fileData, callbackFunction){
		window.localStorage.setItem(file, JSON.stringify(fileData));
		fileWriteFlag = 1;
		callbackFunction();
	};
	
	var readFileData = function(file, callbackFunction){
		var fileData = window.localStorage.getItem(file);
		
		if(fileData == "" || fileData == null || fileData == undefined){
			fileReadFlag = -1;
			callbackFunction();	
		}else{
			fileReadFlag = 1;
			callbackFunction(fileData);
		}
	};
	
	var alertObject = function(object){
		alert( JSON.stringify(object) );
	};
	
	that.setVersionData = function(){
		var OS = device.platform;
		var OSversion = device.version;
		OSversion = OSversion.substr(0,1);
		OSversion = parseInt(OSversion);
		
		deviceData.OS = device.platform;
		deviceData.OSVersion = OSversion;
	};
	
	return that;
}