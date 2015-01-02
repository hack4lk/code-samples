var Portfolio = function() {
 	that = {};
	
	//create initial content holder objects
	var desktopMobile = {};
	var newsBlogs = {};
	var socialMedia = {};
	var traditional = {};
	var initialIndex = []; // this array holds the initial array of items when page loads
	var contentHolder = $('#content');
	var currentContent = [];
	var itemsPositionHolder = [];
	var showIndex = null;
	var showItems = [];
	var showDelay = 100;
	var tempIndex = null;
	var mPadding = 30;
	var nodeWidth = 280;
	var expandWidth = 600;
	var expandRatio = expandWidth/nodeWidth*0.9;
	var tolerance = 100;
	var dWidth = null;
	var bHeight = null;
	var mobileWidth = 670;
	var currentThumb = 1;
	var thumbCount = 1;
	var currentItem = null;
	var forceReload = false;
	/*----
	 * Create and populate Desktop/Mobile category
	 -----*/
	desktopMobile.name = "Desktop and Mobile";
	var tempItems = [];
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/inpulse_small.jpg';
	tempPiece.thumb2 = 'images/inpulse_small2.jpg';
	tempPiece.thumbCount = 2;
	tempPiece.headline = 'InPULSE Mobile Application';
	tempPiece.abstract = 'Internal communications mobile application for Android and iOS platforms including offline caching, Push Notification, PIN access screens, multiple accounts, and many more features.';
	tempPiece.fullText = '<strong>Client:</strong> MWW Group<span class="content-break"> </span> <strong>Project:</strong> Designed and developed a mobile application for Android and iOS platforms using the Cordova/Phonegap frameworks. The application utilizes offline caching, Push Notification, PIN access screens, multiple accounts, and many more features. Application is currently in private beta testing.';
	tempPiece.id = 0;
	tempItems[0] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/file_drop_small.jpg';
	tempPiece.thumbCount = 1;
	tempPiece.headline = 'Adobe AIR Application Development';
	tempPiece.abstract = 'Adobe AIR desktop applications to facilitate workflow and data management.';
	tempPiece.fullText = '<strong>Client:</strong> MWW Group<span class="content-break"> </span> <strong>Project:</strong> Designed and developed internal file sharing desktop application for employees to quickly share files within the company network. Additionally, designed and development website information management application, stock photography management application and desktop-based cron application. Launched the applications to the company with great success and positive feedback from the employees.';
	tempPiece.id = 1;
	tempItems[1] = tempPiece;
	
	desktopMobile.items = tempItems;
	
	/*----
	 * Create and populate News/Blogs category
	 -----*/
	newsBlogs.name = "News and Blogs";
	var tempItems = [];
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/casio_small.jpg';
	tempPiece.thumb2 = 'images/casio_small2.jpg';
	tempPiece.thumb3 = 'images/casio_small3.jpg';
	tempPiece.thumbCount = 3;
	tempPiece.headline = 'Casio Exilim Newsroom';
	tempPiece.abstract = 'Product-centric pressroom for Casio line of cameras with robust search feature.';
	tempPiece.fullText = '<strong>Client:</strong> Casio<span class="content-break"> </span> <strong>Project:</strong> Designed and developed a product-centric pressroom for Casio line of cameras. The pressroom architecture allowed media to search all pressroom information including images, press kits and press releases. The backend of the website was built on WordPress and frontend of the website was built on CodeIgniter.';
	tempPiece.id = 2;
	tempItems[0] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/nikon_press-305x350.jpg';
	tempPiece.thumbCount = 1;
	tempPiece.headline = 'Nikon USA Pressroom';
	tempPiece.abstract = 'Pressroom allowing media to gather and digest latest information about the Nikon line of digital.';
	tempPiece.fullText = '<strong>Client:</strong> Nikon USA<span class="content-break"> </span> <strong>Project:</strong> Designed and developed pressroom for Nikon digital cameras, lenses and accessories. The website served as the information center for Nikon for North America. The front-end of the website was custom and the backend was run on WordPress CMS.';
	tempPiece.id = 3;
	tempItems[1] = tempPiece;
	
	newsBlogs.items = tempItems;
	
	/*----
	 * Create and populate Social Media category
	 -----*/
	socialMedia.name = "Social Media";
	var tempItems = [];
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/nkh_partial.jpg';
	tempPiece.thumb2 = 'images/nkh_partial2.jpg';
	tempPiece.thumb3 = 'images/nkh_partial3.jpg';
	tempPiece.thumbCount = 3;
	tempPiece.headline = 'Facebook Application Development';
	tempPiece.abstract = 'Facebook applications to support consumer campaigns and support brand initiatives.';
	tempPiece.fullText = '<strong>Client:</strong> Various<span class="content-break"> </span> <strong>Project:</strong> Designed and developed myriad of Facebook applications for clients. Initiatives included coupons, contests and informational tabs in support of national marketing campaigns.';
	tempPiece.id = 4;
	tempItems[0] = tempPiece;
	
	socialMedia.items = tempItems;
	
	/*----
	 * Create and populate Traditional category
	 -----*/
	traditional.name = "Traditional Websites";
	var tempItems = [];
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/stts_small.jpg';
	tempPiece.thumb2 = 'images/stts_small2.jpg';
	tempPiece.thumb3 = 'images/stts_small3.jpg';
	tempPiece.thumbCount = 3;
	tempPiece.headline = 'Stronger than the Storm';
	tempPiece.abstract = 'Stronger Than the Storm Campaign Among Highest Recognized Programs in History Of Public Relations With More Than Thirty Major PR Industry Awards.';
	tempPiece.fullText = '<strong>Client:</strong> State of New Jersey<span class="content-break"> </span> <strong>Project:</strong> The website was created in a 3-phase process. Initially built on Twitter Bootstrap and CodeIgniter frameworks, Phase 2 and Phase 3 versions of the website were developed on WordPress. Phase 1 of the website ran on a custom multi-server LAMP stack. <em>Stronger Than the Storm campaign is among the highest recognized programs in history of public relations with more than thirty major PR industry awards</em>';
	tempPiece.id = 5;
	tempItems[0] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/dentist.jpg';
	tempPiece.thumb2 = 'images/dentist2.jpg';
	tempPiece.thumb3 = 'images/dentist3.jpg';
	tempPiece.thumb4 = 'images/dentist4.jpg';
	tempPiece.thumbCount = 4;
	tempPiece.headline = 'Natural Dentist Family of Websites';
	tempPiece.abstract = 'Family of responsive websites for consumer and corporate audiences showcasing wide array of natural products with multi-language support.';
	tempPiece.fullText = '<strong>Client:</strong> The Natural Dentist<span class="content-break"> </span> <strong>Project:</strong> Created responsive websites for consumer and corporate audiences showcasing wide array of natural products. Over the course of 12 months, 3 websites were designed and built based on strict client guidelines. Currently, all three website are under monthly maintenance.';
	tempPiece.id = 6;
	tempItems[1] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/lsg_small.jpg';
	tempPiece.thumbCount = 1;
	tempPiece.headline = 'Lighting Science Group';
	tempPiece.abstract = 'Product-centric website on the Joomla! CMS platform with over 200 products.';
	tempPiece.fullText = '<strong>Client:</strong> Ligthing Science Group<span class="content-break"> </span> <strong>Project:</strong> Designed and built a global product-centric website on the Joomla! CMS platform. over 200 products were included along with a myriad of product details for each product including product spec sheets, product galleries and features. Additionally, system was able to select and display products.';
	tempPiece.id = 7;
	tempItems[2] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/kwl_small1.jpg';
	tempPiece.thumb2 = 'images/kwl_small2.jpg';
	tempPiece.thumb3 = 'images/kwl_small3.jpg';
	tempPiece.thumbCount = 3;
	tempPiece.headline = 'KWL Management';
	tempPiece.abstract = 'Responsive website to showcase the supreme talent of KWL Management.';
	tempPiece.fullText = '<strong>Client:</strong> KWL Management<span class="content-break"> </span> <strong>Project:</strong> Design and develop a responsive website to showcase the top talent of KWL Management. Since launch, client has redesigned and relaunched the website.';
	tempPiece.id = 8;
	tempItems[3] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/bergen.jpg';
	tempPiece.thumbCount = 1;
	tempPiece.headline = 'BergenPAC Website';
	tempPiece.abstract = 'Website to promote the numerous events and ticket sales of BergenPac.';
	tempPiece.fullText = '<strong>Client:</strong> BergenPAC<span class="content-break"> </span> <strong>Project:</strong> Redesigned and developed a fully custom website running on WordPress CMS platform. The website included an events calendar for all the organization’s events as well as a customized back-end solution allowing website administrators to edit most of the website content including all events-related content.';
	tempPiece.id = 9;
	tempItems[4] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/cmos_small.jpg';
	tempPiece.thumbCount = 1;
	tempPiece.headline = 'Charles Moving and Storage';
	tempPiece.abstract = 'Visually appealing website to assist in lead generation and to educate prospects on business offerings.';
	tempPiece.fullText = '<strong>Client:</strong> Charles Moving and Storage<span class="content-break"> </span> <strong>Project:</strong> Designed and developed a website for moving company with extensive SEO support. Website was comprised of over 200 pages and was developed on WordPress CMS.';
	tempPiece.id = 10;
	tempItems[5] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/mww.jpg';
	tempPiece.thumb2 = 'images/mww2.jpg';
	tempPiece.thumb3 = 'images/mww3.jpg';
	tempPiece.thumbCount = 3;
	tempPiece.headline = 'MWW Group Corporate Website';
	tempPiece.abstract = 'Dynamic and agile website for a one of the nation’s top PR agencies.';
	tempPiece.fullText = '<strong>Client:</strong>  MWW Group<span class="content-break"> </span> <strong>Project:</strong> Redesigned and developed official corporate website on CodeIgniter framework. Additionally, website has a completely custom backend system allowing administrators to easily edit website content. Additionally, the website infrastructure allows for unlimited micro and sub-sites.';
	tempPiece.id = 10;
	tempPiece.id = 11;
	tempItems[6] = tempPiece;
	
	var tempPiece = {};
	tempPiece.thumb1 = 'images/cnob-partial.jpg';
	tempPiece.thumbCount = 1;
	tempPiece.headline = 'ConnectOne Bank Corporate Website';
	tempPiece.abstract = 'New website based on newly-developed branding and renaming.';
	tempPiece.abstract = 'Dynamic and agile website for a one of the nation’s top PR agencies.';
	tempPiece.fullText = '<strong>Client:</strong> ConnectOne Bank<span class="content-break"> </span> <strong>Project:</strong> Created a branded website based on newly-developed branding and renaming. The website was relaunched alongside the complete relaunch of the new bank name and brand.';
	tempPiece.id = 12;
	tempItems[7] = tempPiece;
	
	traditional.items = tempItems;
	
	/*
	 * This is the init function to start render of the items
	 */
	that.init = function(){
		dWidth = $(document).width();
		
		//populate initial index with the order of the items to show
		initialIndex[0] = desktopMobile.items[0];
		initialIndex[1] = traditional.items[0];
		initialIndex[2] = traditional.items[1];
		initialIndex[2] = traditional.items[1];
		initialIndex[3] = traditional.items[2];
		initialIndex[4] = desktopMobile.items[1];
		initialIndex[5] = socialMedia.items[0];
		initialIndex[6] = traditional.items[3];
		initialIndex[7] = traditional.items[4];
		initialIndex[8] = newsBlogs.items[0];
		initialIndex[9] = traditional.items[5];
		initialIndex[10] = traditional.items[6];
		initialIndex[11] = traditional.items[7];
		initialIndex[12] = newsBlogs.items[1];
		
		that.renderItems(initialIndex);
		
		//set some button states
		$("#logo").click(function(){
			that.init();
		});
		
		$("#mobileMenuBtn").click(function(){
			toggleMobileMenu();
		});
		
		$(window).scroll(function(){
			var sTop = $(document).scrollTop();
			if(sTop > 100){
				$("#header").addClass('header-less-alpha');
				$("#footer").addClass('footer-less-alpha');
			}else{
				$("#header").removeClass('header-less-alpha');
				$("#footer").removeClass('footer-less-alpha');
			}
		});
		
		for(var i=1; i<6; i++){
			$("#cat"+i).click(function(){
				var data = $(this).data();
				chooseCategory(data.cat);
			});
			
			$("#cat"+i + "-m").click(function(){
				var data = $(this).data();
				chooseCategory(data.cat);
				toggleMobileMenu();
			});
		}
	};
	
	var toggleMobileMenu = function(){
		$(".mobileNav").toggle();
	};
		
	var chooseCategory = function(item){
		for(var i=1; i<6; i++){
			$("#cat"+i).removeClass("selected");
		}
		$("#cat"+item).addClass("selected");
		
		if(item == 1) that.renderItems(initialIndex);
		if(item == 2) that.renderItems(desktopMobile.items);
		if(item == 3) that.renderItems(newsBlogs.items);
		if(item == 4) that.renderItems(socialMedia.items);
		if(item == 5) that.renderItems(traditional.items);
	};
	
	that.renderItems = function(itemArray){
		//reset bg color
		$("body").css("background-color", "#f3f3f3");
		$("body").css("height", "auto");
		currentContent = itemArray;
		contentHolder.html('<div class="nav-arrow left-arrow" id="leftArrow"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></div><div class="nav-arrow right-arrow" id="rightArrow"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>');

		for(var i=0; i<itemArray.length; i++){
			var tempDiv = "";
			var tempItem = itemArray[i];
			var itemID = "item" + i;
			tempDiv += '<div id="' + itemID + '" data-id="' + tempItem.id + '" data-index="' + i + '" class="p-item">';
			tempDiv += '<img id="' + itemID + '" data-id="' + tempItem.id + '" data-index="' + i + '" src="' + tempItem.thumb1 + '" class="item-thumb" />';
			tempDiv += '<h2>' + tempItem.headline + '</h2>';
			tempDiv += '<p class="node-content">' + tempItem.abstract + '</p>';
			tempDiv += '</div>';
			
			tempDiv = contentHolder.html() + tempDiv;
			contentHolder.html(tempDiv);
			
			if(dWidth > mobileWidth){
				$(document).on("click", ("#"+itemID + " img.item-thumb"), function(){
					selectItem( $(this).data().id, $(this).data().index);
				});
			}
		}
		
		//add all items into the masonry layout if not mobile
		if(dWidth > mobileWidth){
			$(window).load(function(){ 
				forceReload = true;
				var container = document.querySelector('#content');
				var msnry = new Masonry( container, {
				  // options
				  columnWidth: nodeWidth,
				  itemSelector: '.p-item',
				  gutter: mPadding
				});
				
				for(var i=0; i<itemArray.length; i++){
					var tempItem = itemArray[i];
					itemsPositionHolder[i] = {
						left: $("#item"+i).css("left"),
						top: $("#item"+i).css("top")
					};
				}
				
				//show all the items
				showItems = itemArray;
				//console.log(showItems);
				transitionItems();
			});
			
			//force reload masonry if page is already loaded....
			if(forceReload){
				var container = document.querySelector('#content');
				var msnry = new Masonry( container, {
				  // options
				  columnWidth: nodeWidth,
				  itemSelector: '.p-item',
				  gutter: mPadding
				});
				
				for(var i=0; i<itemArray.length; i++){
					var tempItem = itemArray[i];
					itemsPositionHolder[i] = {
						left: $("#item"+i).css("left"),
						top: $("#item"+i).css("top")
					};
				}
				
				//show all the items
				showItems = itemArray;
				//console.log(showItems);
				transitionItems();
			}
		}
	};
	
	var transitionItems = function(){
		if(showIndex == null){
			showIndex = 0;
			showSingleItem(showIndex);
		}else{
			if(showIndex <= showItems.length-1){
				showSingleItem();
			}else{
				showIndex = null;
			}
		}
	};
	
	var showSingleItem = function(){
		var temp = setTimeout(function(){
			$("#item"+ showIndex).addClass("show");
			showIndex++;
			transitionItems();
		}, showDelay);
		
	};
	
	var selectItem = function(itemID, arrayIndex){
		currentItem = null;
		var currentWidth = $("#item"+ arrayIndex).css("width");
		currentWidth = Number(currentWidth.replace("px", ""));
		currentItem = currentContent[arrayIndex];
		var pageMarginOffset = (dWidth - $("#content").width())/2;
		var currentThumb = 1;
		//reset the content of the current node item
		$("#item"+ arrayIndex + " p.node-content").html(currentItem.abstract);
		
		//first reset all item....wait 1 second and move again
		for(var i=0; i<currentContent.length; i++){
			var existingLeft = String(itemsPositionHolder[i].left);
			var existingTop = String(itemsPositionHolder[i].top); 
			var existingLeftOffset = Number(existingLeft.substr(0, existingLeft.length-2));
			var existingTopOffset = Number(existingTop.substr(0, existingTop.length-2));
			$("#item"+ i).css("width", nodeWidth);
			$("#item"+ i).css("left", existingLeftOffset);
			$("#item"+ i).css("top", existingTopOffset);
			$("#item"+ i).css("opacity", 1);
			$("#item"+ i).removeClass("show");
			$("#item"+ i).removeClass("large-shadow");
			$("body").css("background-color", "#f3f3f3");
			$('body').height(bHeight);
			$("#leftArrow").css("left", -999);
			$("#rightArrow").css("left", -999);
			$("#leftArrow").removeClass("enabled");
			$("#rightArrow").removeClass("enabled");
			$("#leftArrow").removeClass("disabled");
			$("#rightArrow").removeClass("disabled");
		}
		
		
		//check to see if the iteam is alrady open...
		//...if it is just reset the items
		if(currentWidth == nodeWidth){
			$("#item"+ arrayIndex).addClass("large-shadow");
			$("#item"+ arrayIndex + " p.node-content").html(currentItem.fullText);
			$("body").css("background-color", "#333");
			var leftCenterOffset = 0;
			var leftMargin = 0;
			var tempLeft = String(itemsPositionHolder[arrayIndex].left);
			var tempTop = String(itemsPositionHolder[arrayIndex].top); 
			var tempLeftOffset = Number(tempLeft.substr(0, tempLeft.length-2));
			var tempTopOffset = Number(tempTop.substr(0, tempTop.length-2));
			
			//first, expand the current item to a predetermined width...
			$("#item"+ arrayIndex).css("width", expandWidth);

			//if the width is too far to the right...shift the item to the left.
			var pageCenter = dWidth /2;
			var itemCenterOnPage = tempLeftOffset + (expandWidth/2);
			if(itemCenterOnPage > pageCenter){
				leftCenterOffset = itemCenterOnPage - pageCenter;
				leftMargin = tempLeftOffset-leftCenterOffset;
				$("#item"+ arrayIndex).css("left", (tempLeftOffset-leftCenterOffset));
			}else{
				leftMargin = tempLeftOffset;
			}
			
			//show left/right arrows if the item has more than one thumb
			if(currentItem.thumbCount != 1){
				$("#leftArrow").unbind();
				$("#rightArrow").unbind();
				var leftArrowLeftOffset = leftMargin-70;
				var leftArrowTopOffset =  tempTopOffset + 180;
				var arrowWidth = $("#leftArrow").width();
				
				currentThumb = 1; 
				thumbCount = currentItem.thumbCount;
				
				$("#leftArrow").click(function(){
					if(currentThumb == 1){
						var newThumb = currentItem["thumb"+thumbCount];
						$("#item"+ arrayIndex + " img.item-thumb").prop("src", newThumb);
						currentThumb = thumbCount;
					}else{
						currentThumb--;
						var newThumb = currentItem["thumb"+currentThumb];
						$("#item"+ arrayIndex + " img.item-thumb").prop("src", newThumb);
					}
				});
				
				$("#rightArrow").click(function(){
					if(currentThumb == thumbCount){
						var newThumb = currentItem.thumb1;
						$("#item"+ arrayIndex + " img.item-thumb").prop("src", newThumb);
						currentThumb = 1;
					}else{
						currentThumb++;
						var newThumb = currentItem["thumb"+currentThumb];
						$("#item"+ arrayIndex + " img.item-thumb").prop("src", newThumb);
					}
				});
				
				//set a slight delay to show arrows to allow time for div to expand
				setTimeout(function(){
					$("#leftArrow").css("left", leftArrowLeftOffset);
					$("#leftArrow").css("top", leftArrowTopOffset);
					$("#rightArrow").css("left", (leftArrowLeftOffset+expandWidth+70));
					$("#rightArrow").css("top", leftArrowTopOffset);
					$("#leftArrow").addClass("show");
					$("#rightArrow").addClass("show");
				}, 800);
			}
			
			var initheight = $("#item" + arrayIndex).height() + tempTopOffset + (mPadding/2);
			var alteredHeight = Math.round($("#item"+ arrayIndex).height()*expandRatio);
			var vOffsetPlusHeight  = Number(tempTopOffset) + alteredHeight + (mPadding/2);
			
			bHeight = $('body').height();
			if(vOffsetPlusHeight > bHeight){
				$('body').height(vOffsetPlusHeight);
			}
			
			for(var i=0; i<currentContent.length; i++){
				if(arrayIndex != i){
					$("#item"+ i).css("opacity", 0.1);
					var tempLeft2 = String(itemsPositionHolder[i].left);
					var tempTop2 = String(itemsPositionHolder[i].top); 
					var tempLeftOffset2 = Number(tempLeft2.substr(0, tempLeft2.length-2));
					var tempTopOffset2 = Number(tempTop2.substr(0, tempTop2.length-2));
					
					//adjust top offset of item to include height of item
					tempTopOffset2 = tempTopOffset2 + $("#item"+i).height();
					
					if(tempLeftOffset2 > tempLeftOffset && tempTopOffset2 >= tempTopOffset){
						var rightMargin = tempLeftOffset + expandWidth + mPadding;
						var rightOffset = rightMargin - tempLeftOffset2;
						
						//move items left and right
						if(rightOffset > 0){
							if(rightOffset > tolerance){
								$("#item"+i).css("left", tempLeftOffset2+rightOffset-leftCenterOffset);
							}else{
								$("#item"+i).css("left", tempLeftOffset2+tolerance-leftCenterOffset);
							}
						}
					}else if(tempTopOffset2 >= tempTopOffset){
						var leftItemRightMargin = tempLeftOffset2 + nodeWidth + mPadding;
						var leftMarginDelta = Number(leftMargin) - Number(tempLeftOffset);
						if(leftMarginDelta < 0){
							$("#item"+i).css("left", tempLeftOffset2 + leftMarginDelta);
						}else if(leftMarginDelta > 0){
							$("#item"+i).css("left", tempLeftOffset2 - tolerance);
						}
						
						//move items up and down expandRatio
						if(tempLeftOffset2 == tempLeftOffset){
							var offset2 = vOffsetPlusHeight - tempTopOffset2;
							$("#item"+i).css("top", (tempTopOffset2+offset2));
						}
					}
				}
			}
		}//end if(currentWidth > nodeWidth)
	};
	
	return that;
};
