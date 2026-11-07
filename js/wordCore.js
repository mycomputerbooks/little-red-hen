var words = {}; //a words namespace to encapsulate the logic
words.previouskbArrayIndex = -1;
words.previousPageIndex = -1;
words.kbArray = [];
words.index = 0;


var fromSwitchPage = false;
var pageTurn = false;

words.timeSingle01_Base = 800;

var selfieIndex = 0;
var pageLoadedArray = [];
var titlePageId;
var galleryPageId;

var pageArr = [],
pageIndex = 0,

navLoaded = false,
timer1,
timer2,
timer3,
timer4,
timer5,
timer6,
timer7,
timer8,
videoTimer= null;
var picturePlaying = false;
//====== scratch ===========
var image = null;
var canvas = {'temp':null, 'draw':null}; // temp and draw canvases
var mouseDown = false;
//==========================
AdobeEdge.bootstrapCallback(function(compId){
    words.Sym = AdobeEdge.getComposition('words').getStage();
});
		
		function loadToolbar(){
				
				$("#Stage_toolBar_groupListen").show();
				$("#Stage_toolBar_groupRead").hide();
				
				$("#Stage_toolBar_groupEspanol_x").hide();
				$("#Stage_toolBar_groupEspanol").show();

				//$("#Stage_toolBar").show();
				//$("#Stage_toolBar").css("z-index", "1");
	
				$("#Stage_toolBar_groupReadOnOff").show();
				$("#Stage_toolBar_groupEspanolOnOff").show();
				$("#Stage_toolBar_groupEspanolOnOff").css({"position": "absolute", "left": "134px"});
				$("#Stage_toolBar_groupTractor").show();
				$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "229px"});
				$("#Stage_toolBar_recBG").css("width",282);
				
				$("#Stage_toolBar_lineGearRight").show();
				$("#Stage_toolBar_lineReadingRight").show();
				$("#Stage_toolBar_lineEspanolRight").show();
				if (preferencesArray[0].showWordsBtn === false && preferencesArray[0].showEspanolBtn === false && preferencesArray[0].showSlamBtn === true){
						$("#Stage_toolBar_groupReadOnOff").hide();
						$("#Stage_toolBar_groupEspanolOnOff").hide();
						$("#Stage_toolBar_groupTractor").show();
						$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "48px"});
						$("#Stage_toolBar_recBG").css("width",101);
				}else if (preferencesArray[0].showWordsBtn === false && preferencesArray[0].showEspanolBtn === false && preferencesArray[0].showSlamBtn === false){		
						$("#Stage_toolBar_groupReadOnOff").hide();
						$("#Stage_toolBar_groupEspanolOnOff").hide();
						$("#Stage_toolBar_groupTractor").hide();
						$("#Stage_toolBar_lineGearRight").hide();
						$("#Stage_toolBar_recBG").css("width",46);
				}else if (preferencesArray[0].showWordsBtn === false && preferencesArray[0].showSlamBtn === true){
						$("#Stage_toolBar_groupReadOnOff").hide();
						$("#Stage_toolBar_lineEspanolRight").show();
						$("#Stage_toolBar_groupEspanolOnOff").show();
						$("#Stage_toolBar_groupEspanolOnOff").css({"position": "absolute", "left": "48px"});
						$("#Stage_toolBar_groupTractor").show();
						$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "141px"});
						$("#Stage_toolBar_recBG").css("width",194);
				}else if (preferencesArray[0].showWordsBtn === false && preferencesArray[0].showSlamBtn === false){
						$("#Stage_toolBar_groupReadOnOff").hide();
						$("#Stage_toolBar_lineEspanolRight").hide();
						$("#Stage_toolBar_groupEspanolOnOff").show();
						$("#Stage_toolBar_groupEspanolOnOff").css({"position": "absolute", "left": "48px"});
						$("#Stage_toolBar_groupTractor").hide();
						$("#Stage_toolBar_recBG").css("width",145);
				}else if (preferencesArray[0].showEspanolBtn === false && preferencesArray[0].showSlamBtn === true){
						$("#Stage_toolBar_groupEspanolOnOff").hide();
						$("#Stage_toolBar_groupReadOnOff").show();
						$("#Stage_toolBar_lineReadingRight").show();
						$("#Stage_toolBar_groupTractor").show();
						$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "133px"});
						$("#Stage_toolBar_recBG").css("width",186);
				}else if (preferencesArray[0].showEspanolBtn === false && preferencesArray[0].showSlamBtn === false){
						$("#Stage_toolBar_groupEspanolOnOff").hide();
						$("#Stage_toolBar_groupReadOnOff").show();
						$("#Stage_toolBar_lineReadingRight").hide();
						$("#Stage_toolBar_groupTractor").hide();
						$("#Stage_toolBar_recBG").css("width",136);
				}
				else if (preferencesArray[0].showSlamBtn === false){
						$("#Stage_toolBar_groupTractor").hide();
						$("#Stage_toolBar_lineEspanolRight").hide();
						$("#Stage_toolBar_recBG").css("width",232);
				}
				
				
				
				//switch(pageType) {
				//		case 'selfie':
				//				//alert('selfie');
				//				$("#Stage_toolBar").show();
				//				$("#Stage_toolBar").css("z-index", "1");
				//				if (preferencesArray[0].showEspanolBtn === false) {
				//						$("#Stage_toolBar_groupEspanol").hide();
				//						$("#Stage_toolBar_groupEspanol_x").hide();
				//						$("#Stage_toolBar_rec03").hide();
				//						$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "133px"});
				//						$("#Stage_toolBar_recBG").css("width",184);
				//				}
				//				if (preferencesArray[0].showWordsBtn === false) {
				//						$("#Stage_toolBar_groupListen").hide();
				//						$("#Stage_toolBar_groupRead").hide();
				//						$("#Stage_toolBar_rec02").hide();
				//						$("#Stage_toolBar_rec03").css({"position": "absolute", "left": "141px"});
				//						$("#Stage_toolBar_groupEspanol_x").css({"position": "absolute", "left": "48px"});
				//						$("#Stage_toolBar_groupEspanol").css({"position": "absolute", "left": "48px"});
				//						$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "143px"});
				//						$("#Stage_toolBar_recBG").css("width",184);
				//				}
				//				
				//				if (preferencesArray[0].showWordsBtn === false && preferencesArray[0].showWordsBtn === false) {
				//						$("#Stage_toolBar_groupListen").hide();
				//						$("#Stage_toolBar_groupRead").hide();
				//						$("#Stage_toolBar_rec02").hide();
				//						$("#Stage_toolBar_rec03").hide();
				//						$("#Stage_toolBar_groupTractor").css({"position": "absolute", "left": "48px"});
				//						$("#Stage_toolBar_recBG").css("width",95);
				//				}
				//				
				//				if (preferencesArray[0].showSlamBtn === false){
				//						$("#Stage_toolBar_rec03").hide();
				//						$("#Stage_toolBar_groupTractor").hide();
				//						$("#Stage_toolBar_recBG").css("width",233);
				//				}
				//				
				//				
				//				break;
				//		case 'picOnlySelfie':
				//				//$("#Stage_toolBar").css({"position": "absolute",  "top" : "344px", "left": "66px"});
				//				$("#Stage_toolBar").show();
				//				$("#Stage_toolBar").css("z-index", "1");
				//				toolBarComponents("gearOnly");
				//				break;
				//		default:
				//				alert('problem with pageType');
				//}
				
		}
		
		//function toolBarComponents(toolType){
		//		switch(toolType) {
		//				case 'gearOnly':
		//						$("#Stage_toolBar_rec01").hide();
		//						$("#Stage_toolBar_rec02").hide();
		//						$("#Stage_toolBar_rec03").hide();
		//						$("#Stage_toolBar_groupTractor").hide();
		//						$("#Stage_toolBar_groupEspanol").hide();
		//						$("#Stage_toolBar_groupEspanol_x").hide();
		//						$("#Stage_toolBar_groupListen").hide();
		//						$("#Stage_toolBar_groupRead").hide();
		//						$("#Stage_toolBar_recBG").css("width",45);
		//						break;
		//				case 'picOnlySelfie':
		//						 toolBarComponents("gearOnly");
		//						break;
		//				default:
		//						alert('problem with pageType');
		//		}
		//}
		
    function navBarSelect(sender){
				if (pageIndex != parseInt($(sender).attr("index"))){
						//closePreferences();
						killPageWords();
						if (recordingOpen() === false){
								var previousPageIndex = pageIndex;
								pageIndex = parseInt($(sender).attr("index"));										
								//======
								if (createSurroundingPages() === true){
										setTimeout(function(){
												$(pageArr[pageIndex].pageId).show();
												$(pageArr[previousPageIndex].pageId).hide();
												switchPage(previousPageIndex);		
										}, 125);
								}else{					
										$(pageArr[previousPageIndex].pageId).hide();
										$(pageArr[pageIndex].pageId).show();
										switchPage(previousPageIndex);
								}			
						}
				}
				closePreferences();
				hideNavButtons();
		}
		function getPage(sendingPageIndex){
						 //var pageName = pageArr[sendingPageIndex].pageName;
						pageArr[sendingPageIndex].pageId = "#"+words.Sym.createChildSymbol(pageArr[sendingPageIndex].pageName, "Stage").getSymbolElement().attr("id");
						
						if (pageArr[sendingPageIndex].pageName == "pageCover"){
								$(pageArr[sendingPageIndex].pageId+"_recVideo").hide();
								//==========================================
								$(pageArr[sendingPageIndex].pageId+"_recVideo").on('swipeleft',function(){
										//if ($('#playPauseVideo').length > 0 ) {
												closePreview();
										//}
										doSwipeLeft();						                
								} );
								$(pageArr[sendingPageIndex].pageId+"_recVideo").on('swiperight',function(){
										//if ($('#playPauseVideo').length > 0 ) {
												closePreview();
										//}
										doSwipeRight();						                
								} );
								$(pageArr[sendingPageIndex].pageId+"_recVideo").on('swipedown',function(){
										//if ($('#playPauseVideo').length > 0 ) {
												
												closePreview();
										//}
										showNavButtons();	
								} );
								//==========================================
								$(pageArr[sendingPageIndex].pageId+"_previewApp_groupMain").css({ opacity: 0 });
								$(pageArr[sendingPageIndex].pageId+"_previewApp_groupClose").css({ opacity: 0 });
								//$(pageArr[sendingPageIndex].pageId+"_previewApp").css({"position": "absolute",  "top" : "114.38px", "left": "20.50px"});
								$(pageArr[sendingPageIndex].pageId+"_toolBarCover_groupThemeOff").hide();
								$(pageArr[sendingPageIndex].pageId+"_toolBarCover_groupThemeOn").show();
								
								
								
								//$(pageArr[sendingPageIndex].pageId+"_previewApp").css({ opacity: 0.80 });
						}
						$(pageArr[sendingPageIndex].pageId).attr('class','corePage');
						$(pageArr[sendingPageIndex].pageId).attr("desc",pageArr[sendingPageIndex].pageName);	
						if (pageArr[sendingPageIndex].pageDown1Name != "none") {
								if (pageArr[sendingPageIndex].pageDown1Name.indexOf("game") >= 0){
										pageArr[sendingPageIndex].pageDown1Id = "#"+words.Sym.createChildSymbol("slam", "Stage").getSymbolElement().attr("id");
								}else{
										pageArr[sendingPageIndex].pageDown1Id = "#"+words.Sym.createChildSymbol(pageArr[sendingPageIndex].pageDown1Name, "Stage").getSymbolElement().attr("id");
								}
								$(pageArr[sendingPageIndex].pageDown1Id).attr('class','down1Page');
								$(pageArr[sendingPageIndex].pageDown1Id).attr("desc",pageArr[sendingPageIndex].pageName+"_pageDown1");
								$(pageArr[sendingPageIndex].pageDown1Id).hide();
						}
						if (pageArr[sendingPageIndex].pageType == "selfie"){
								$(pageArr[sendingPageIndex].pageId+"_"+pageArr[sendingPageIndex].pageName).get(0).src = '';		
						}
						if (pageArr[sendingPageIndex].pageType == "selfie" || pageArr[sendingPageIndex].pageType == "picOnlySelfie") {
								var idPicture = "thumbnailStage"+pageArr[sendingPageIndex].pageName;                    
								$('<img id="'+idPicture+'" class="resize-drag" src=""/>')
										.appendTo(pageArr[sendingPageIndex].pageId+"_imageChosen");                    
								var idSelfieAudio = "selfieAudio"+pageArr[sendingPageIndex].pageName;
								$(pageArr[sendingPageIndex].pageId+"_recSelfieAudio").html('<audio id="'+idSelfieAudio+'" src=""/>');
								$("#"+idSelfieAudio).addClass("selfieAudio");
								//if (pageArr[sendingPageIndex].pageName == "pageCover"){
								//		$(pageArr[sendingPageIndex].pageId+"_previewApp_groupMain").hide();
								//}
								
								
								if (Modernizr.touch) {
										var startupSelfieIndex = getSelfieIndex(sendingPageIndex);
										if (selfiePageArray[startupSelfieIndex].pictureExists === true){								
												if (selfiePageArray[startupSelfieIndex].fromGallery === true){
														$("#"+idPicture).attr("src",selfiePageArray[startupSelfieIndex].galleryImage);
												}else{
														var extensionSelfie = selfiePageArray[startupSelfieIndex].fileExtension;
														if (extensionSelfie != "none"){
																getFilePicture(startupSelfieIndex);
														}
												}
										}
								}
								
						}
						
						$(pageArr[sendingPageIndex].pageId+"_bgImage").on('swipeleft',function(){
								doSwipeLeft();						                
						} );
						$(pageArr[sendingPageIndex].pageId+"_bgImage").on('swiperight',function(){
								doSwipeRight();						                
						} );
						$(pageArr[sendingPageIndex].pageId+"_bgImage").on('swipedown',function(){
								showNavButtons();						                
						} );
						//============
						$(pageArr[sendingPageIndex].pageId+"_groupRead").on('swipeleft',function(){
								doSwipeLeft();						                
						} );
						$(pageArr[sendingPageIndex].pageId+"_groupRead").on('swiperight',function(){
								doSwipeRight();						                
						} );
						$(pageArr[sendingPageIndex].pageId+"_groupRead").on('swipedown',function(){
								showNavButtons();						                
						} );
						
						if (Modernizr.touch) {
								$(pageArr[sendingPageIndex].pageId+"_imageChosen").on('click',function(){
										btnPicturePlay();					                
								} );
						}
					
		}
		
		function doSwipeLeft(){
				closePreferences();
				killPageWords();
				if (recordingOpen()  === false){
						var previousPageIndex = pageIndex;             
						if (pageIndex == pageArr.length -1){
								pageIndex = 0;
						}else{
								pageIndex = pageIndex + 1;	
						}
						var count;
						var countIndex;
						countIndex = pageIndex + 1;
						if (countIndex == pageArr.length){
								countIndex = 0;
						}
						count = pageLoadedArray.indexOf(pageArr[countIndex].pageName);
						if (count == -1){
								pageLoadedArray.push(pageArr[countIndex].pageName);
								getPage(countIndex);
								$(pageArr[countIndex].pageId).hide();
						}
						highlightNavChoice('nav'+ pageIndex + 1);						
						//switchPage(previousPageIndex);							//problem
						$(pageArr[pageIndex].pageId).show();
						$(pageArr[previousPageIndex].pageId).hide();
						switchPage(previousPageIndex);	
				}
		}
		
		function doSwipeRight(){
				closePreferences();
				killPageWords();
				if (recordingOpen() === false){ 
						var previousPageIndex = pageIndex;
						if (pageIndex === 0) {
							pageIndex = pageArr.length - 1;
						}else{
							pageIndex = pageIndex - 1;
						}
						var count;
						var countIndex;
						countIndex = pageIndex - 1;
						if (countIndex === -1) {
								countIndex = pageArr.length - 1;
						}
						count = pageLoadedArray.indexOf(pageArr[countIndex].pageName);
						if (count == -1){
								pageLoadedArray.push(pageArr[countIndex].pageName);
								getPage(countIndex);
								$(pageArr[countIndex].pageId).hide();
						}
						highlightNavChoice('nav'+ pageIndex + 1);
						//switchPage(previousPageIndex);
						$(pageArr[pageIndex].pageId).show();
						$(pageArr[previousPageIndex].pageId).hide();
						switchPage(previousPageIndex);
				}
		}

		function createSurroundingPages(){
				var pageRetrieved = false;
				var count;
				var countIndex;
				countIndex = pageIndex;  //current page
				count = pageLoadedArray.indexOf(pageArr[countIndex].pageName);
				if (count == -1){
						pageLoadedArray.push(pageArr[countIndex].pageName);
						getPage(countIndex);
						$(pageArr[countIndex].pageId).hide();
						pageRetrieved = true;
				}
				countIndex = pageIndex + 1;  //next page
				if (countIndex == pageArr.length){
						countIndex = 0;
				}
				count = pageLoadedArray.indexOf(pageArr[countIndex].pageName);
				if (count == -1){
						pageLoadedArray.push(pageArr[countIndex].pageName);
						getPage(countIndex);
						$(pageArr[countIndex].pageId).hide();
						pageRetrieved = true;
				}
				countIndex = pageIndex - 1;  //previous page
				if (countIndex === -1) {
						countIndex = pageArr.length - 1;
				}
				count = pageLoadedArray.indexOf(pageArr[countIndex].pageName);
				if (count == -1){
						pageLoadedArray.push(pageArr[countIndex].pageName);
						getPage(countIndex);
						$(pageArr[countIndex].pageId).hide();
						pageRetrieved = true;
				}
				return pageRetrieved;
		}


    TOC_FindPage = function(gotoPage){
				var previousPageIndex = pageIndex;
        for (var i=0;i<pageArr.length;i++)
        {
            if (pageArr[i].pageName === gotoPage) {
                pageIndex = i;								
                break;
            }
        }
				if (createSurroundingPages() === true){
						setTimeout(function(){
								$(pageArr[previousPageIndex].pageId).hide();
								$(pageArr[pageIndex].pageId).show();
								highlightNavChoice('nav'+ pageIndex + 1);
								if (pageArr[i].pageType == "songPage"){
										songPageSwitch();
								}
						}, 125);
				}else{					
						$(pageArr[previousPageIndex].pageId).hide();
						$(pageArr[pageIndex].pageId).show();
						highlightNavChoice('nav'+ pageIndex + 1);
						if (pageArr[i].pageType == "songPage"){
								songPageSwitch();
						}
				}
    };

    highlightNavChoice = function(){        
        var theID = pageArr[pageIndex].navId;
        $(".thumbTxt").css({ 'color': '#590101'});
        $(theID+"_thumbTxt").css({ 'color': '#efed8d'});
        $(".thumbBgRec").css({ opacity: 0 });
        $(theID+"_thumbBgRec").css({ opacity: 1 });
    };

    createNav = function(){
				var thumb = '',
				navNum = "",
				i;
				for (i = 0; i < pageArr.length; i++) {
						if (pageArr[i].navPage === true){  
								thumb = pageArr[i].pageName+"Thumb";
								navNum = "#nav"+(i+1);
								pageArr[i].navId = "#"+words.Sym.createChildSymbol(thumb, $(navNum)).getSymbolElement().attr("id");
						}		
				}
				$("#placeHolder").append("<img id='theImg' src='thumbs/plug.png'/>");
    };

    hideNavButtons = function(){
				$("#Stage_recNav").css({ opacity: 0 });
				$("#Stage_recNav").css("z-index", "-1");
				navLoaded = false;
    };

    showNavButtons = function(){
        if (navLoaded === false) {
            $("#Stage_recNav").css({ opacity: 1 });
            $("#Stage_recNav").css("z-index", "1");
            navLoaded = true;
        }else{
            $("#Stage_recNav").css({ opacity: 0 });
            $("#Stage_recNav").css("z-index", "-1");
            navLoaded = false;
        }
        highlightNavChoice();
    };

    playSongPageWithScrubber = function(theInterval){
        var pageName = pageArr[pageIndex].pageName;
        var pageId = pageArr[pageIndex].pageId;
        var scrubber = $(pageId+"_scrubber");
        if (pageName != "webInstructionsVideo") {
            $(pageId+"_"+pageName)[0].playbackRate = preferencesArray[0].readingSpeedSong;
        }
        
        $(pageId+"_imgWords").hide();
        $(pageId+"_video_icon").hide();
        $(pageId+"_"+pageName)[0].play();
        $(pageId+"_scrubber").show();
        $(pageId+"_mobileHit").show();
        $(pageId+"_bar").show();
        setDialogSeekBar(theInterval);
                
        recordTimer = setInterval(function() {
                moveSeekBar(theInterval);       
        }, 20);
        
        $(pageId+"_"+pageName)[0].onended = function() {
            clearInterval(recordTimer);
            scrubber.css('left', 110);
            $(pageId+"_video_icon").show();
            $(pageId+"_scrubber").hide();
            $(pageId+"_mobileHit").hide();
            $(pageId+"_bar").hide();
            //if (pageName == "webInstructionsVideo") {
            //    $(pageId+"_"+pageName)[0].currentTime = 0;
            //}
        };
    };

    switchPage = function(previousPageIndex){
        var previousPageId = pageArr[previousPageIndex].pageId;
        var previousPageName = pageArr[previousPageIndex].pageName;       
        var pageId = pageArr[pageIndex].pageId;
				var pageName = pageArr[pageIndex].pageName;
				//alert('hello');
				selfieIndex = getSelfieIndex(pageIndex);
        //$("#Stage_groupSwipe").hide();
        //$("#Stage_groupSwipe").css("z-index", "-1");
        $(document).unbind();
				setToolBarOn();
        stopTheAudio(previousPageId, previousPageName, previousPageIndex);
        if ($(previousPageId).find(".scrubberBar").length > 0){ 
            clearInterval(recordTimer);
        }
				//$("#Stage_toolBar").hide();
				//$("#Stage_toolBar").css("z-index", "-1");
        $("#Stage_dialogSpeed").css("z-index", "-1");
        $("#Stage_dialogSpeed").hide();
        if (pageArr[pageIndex].pageType == "songPage") {
            songPageSwitch();
        }else if (pageArr[pageIndex].pageType == "selfie") {
						//setToolBarOn();
						//$("#Stage_toolBar_groupRead").hide();
						//$("#Stage_toolBar_groupListen").show();
						
						//$("#Stage_toolBar_groupEspanol_x").hide();
						//$("#Stage_toolBar").show();
						//$("#Stage_toolBar").css("z-index", "1");
						
						pageTurn = true;
						var src = $(pageId+"_"+pageName).get(0).currentSrc;
						console.log("source = " + src);
						if (src === ""){
								$(pageId+"_"+pageName).get(0).src = pageName+"/media/"+pageName+".mp4";
								$(pageId+"_"+pageName).show();
						}	
            $("#Stage_dialogSpeed").css({'position': 'absolute','top':'633px', 'left':'759px'});            						
						//showPageButtons();
            showReadingSpeed();
						
						
						
            //selfieIndex = getSelfieIndex(pageIndex);
						if (selfiePageArray[selfieIndex].defaultTalkie === true && selfiePageArray[selfieIndex].refreshTalkieImage === true){						
								getFilePicture(selfieIndex);
								selfiePageArray[selfieIndex].refreshTalkieImage = false;
						}
            manipulateImage();
            if (preferencesArray[0].autoNarrate === true){ 
                btnPagePlay();
            }else{
                if (selfiePageArray[selfieIndex].selfNarration === true && selfiePageArray[selfieIndex].narrationExists === true){
                    $(pageId+"_imgWords").show();
                }else{
                    $(pageId+"_imgWords").hide();
                }
            }
        }else if (pageArr[pageIndex].pageType == "picOnlySelfie") {
						//if (pageName == "pageCover"){
						//		$(pageId+"_toolBarCover_groupThemeOff").hide();
						//		$(pageId+"_toolBarCover_groupThemeOn").show();
						//}
           // showPageButtons();
						//selfieIndex = getSelfieIndex(pageIndex);
						if (selfiePageArray[selfieIndex].defaultTalkie === true && selfiePageArray[selfieIndex].refreshTalkieImage === true){	
								getFilePicture(selfieIndex);
								selfiePageArray[selfieIndex].refreshTalkieImage = false;
						}
            manipulateImage();
        }
        
    };
    
		function getSelfieIndex(sendingPageIndex) {
        var pageName = pageArr[sendingPageIndex].pageName;
        for (var i=0;i<selfiePageArray.length;i++)  
        {
            if (selfiePageArray[i].pageName === pageName) {
								return i;
            }
        }
    }
    
    function songPageSwitch(){
        var pageId = pageArr[pageIndex].pageId;
        var pageName = pageArr[pageIndex].pageName;
        if (pageArr[pageIndex].pageName == "pageSong") {                
                $(pageId+"_video_icon_Credits").hide();
                $(pageId+"_video_icon_Song").show();
                $(pageId+"_pageSong").show();
                $(pageId+"_pageCredits").hide();
                $(pageId+"_btnCredits").show();
                $(pageId+"_btnSong").hide();
                $(pageId+"_"+pageName)[0].onended = function() {
                    $(pageId+"_"+pageName)[0].currentTime = 0;
                    $(pageId+"_video_icon_Song").show();
                };
            }
            startScrubber(pageId);
            if (preferencesArray[0].showReadingSpeedSong === true){
                setDialogSpeedPositionByName();
                $(".txtSpeedAmt").text(preferencesArray[0].readingSpeedSong);
                $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeftSong });
                $("#Stage_dialogSpeed").css("z-index", "1");
                $("#Stage_dialogSpeed_groupSpeedMain").css({ opacity: 1 });
                $("#Stage_dialogSpeed").show();
                $(".btnToPreferencesSpeed").hide();
                $(".btnToPreferencesSpeed").css("z-index", "-1");
                $(".btnToPreferencesSpeedSong").show();
                $(".btnToPreferencesSpeedSong").css("z-index", "1");
								setToolBarOff();
                //$(pageId+"_btnPreferenceSong").hide();
								$(pageId+"_toolBarGear").hide();
            }else{
                $("#Stage_dialogSpeed").css("z-index", "-1");
                $("#Stage_dialogSpeed").hide();
                //$(pageId+"_toolBarGear").show();
								setToolBarOn();
								//$(pageId+"_btnPreferenceSong").show();
            }
    }
		
		function manipulateImage() {
        var pageId = pageArr[pageIndex].pageId;
        var pageName = pageArr[pageIndex].pageName;
        var idPicture = "#thumbnailStage"+pageName;
        if (selfiePageArray[selfieIndex].showPicture === false ||selfiePageArray[selfieIndex].pictureExists === false ) {
                $(idPicture).hide();
        }else{
            $(idPicture).show();
            moveDragImage();
            var imageTop = selfiePageArray[selfieIndex].top;
            var imageLeft = selfiePageArray[selfieIndex].left;			 
            $(idPicture).css("width", selfiePageArray[selfieIndex].width);
            $(idPicture).css("height", selfiePageArray[selfieIndex].height);
            $(idPicture)[0].style.transform = 'rotate(' + selfiePageArray[selfieIndex].angle + 'deg)';
            $(pageId+"_imageChosen").css({top: imageTop, left: imageLeft, position:'absolute'});
        }    
    }

    function moveDragImage() {
        var angle = 0;
        var pageId = pageArr[pageIndex].pageId;
        var pageName = pageArr[pageIndex].pageName;
        var idPicture = "#thumbnailStage"+pageName;
        interact(pageId).gesturable({
        onmove: function (event) {
                angle += event.da;
                $(idPicture)[0].style.transform = 'rotate(' + angle + 'deg)';                                                
            }
        });
				$(pageId+"_imageChosen").draggable({   
            //containment: $(pageId),
						//containment: parent,
						//left,top,left,top
						containment: [ -50, -60, 930, 680],
            stop: function( event, ui )
                    {
												//var x = $(pageId+"_imageChosen").offset();
												//alert("top " + x.top + " left " + x.left );
                    }
        });
        $(pageId+"_imageChosen").on("touchend", function(ev) {                    
            var x = $(pageId+"_imageChosen").offset();
            selfiePageArray[selfieIndex].top = x.top;
            selfiePageArray[selfieIndex].left = x.left;
            selfiePageArray[selfieIndex].angle = angle.toFixed(2);
            localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
        });
				
				$(pageId+"_imageChosen").on("mouseup", function(ev) {                    
            var x = $(pageId+"_imageChosen").offset();
            selfiePageArray[selfieIndex].top = x.top;
            selfiePageArray[selfieIndex].left = x.left;
            selfiePageArray[selfieIndex].angle = angle.toFixed(2);
            localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
        });
				
    }

    function startScrubber(sendingPageId){       
        if ($(sendingPageId).find(".scrubberBar").length > 0){ 
            var scrubber = $(sendingPageId+"_scrubber");
            $(sendingPageId+"_video_icon").show();
            $(sendingPageId+"_scrubber").hide();
            $(sendingPageId+"_mobileHit").hide();
            $(sendingPageId+"_bar").hide();
            scrubber.css('background-image', 'url("images/pageScrubber.jpg")');
            scrubber.css('left', 110);
        }
    }
    
    function showReadingSpeed() {
        if (preferencesArray[0].showReadingSpeed === true){
              $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
              $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
              $(".txtSpeedAmt").text(preferencesArray[0].readingSpeed);
              $("#Stage_dialogSpeed").css("z-index", "1");
              $("#Stage_dialogSpeed").show();
              $("#Stage_dialogSpeed_groupSpeedMain").css({ opacity: 1 });
              $(".btnToPreferencesSpeed").show();
              $(".btnToPreferencesSpeed").css("z-index", "1");
              $(".btnToPreferencesSpeedSong").hide();
              $(".btnToPreferencesSpeedSong").css("z-index", "-1");
          }else{
              $("#Stage_dialogSpeed").css("z-index", "-1");
              $("#Stage_dialogSpeed").hide();
        }
    }
    //function showPageButtons() {
    //    var pageId = pageArr[pageIndex].pageId;        
    //    var pageType = pageArr[pageIndex].pageType;
    //    if (preferencesArray[0].showSlamBtn === true && pageType != "picOnlySelfie") {
    //        //$("#Stage_groupSwipe").show();
    //        //$("#Stage_groupSwipe").css("z-index", "1");
    //        //$("#Stage_tractor").css({ opacity: 0.37 });
    //    }else{
    //        //$("#Stage_groupSwipe").hide();
    //        //$("#Stage_groupSwipe").css("z-index", "-1");
    //    }
    //    
    //    if (pageType != "picOnlySelfie") {
    //        if (preferencesArray[0].showWordsBtn === true){
    //            //$(pageId+"_btnDone").hide();
    //            //$(pageId+"_btnDone").css("z-index", "-1");
    //            //$(pageId+"_groupWordsBtn").show();
    //            //$(pageId+"_groupWordsBtn").css("z-index", "1");
    //        }else{
    //            //$(pageId+"_groupWordsBtn").hide();
    //            //$(pageId+"_groupWordsBtn").css("z-index", "-1");                
    //        }
    //        
    //        if (preferencesArray[0].showEspanolBtn === true){
    //            //$(pageId+"_btnSpanish").show();
    //            //$(pageId+"_btnSpanish").css("z-index", "1");
    //        }else{
    //            //$(pageId+"_btnSpanish").hide();
    //            //$(pageId+"_btnSpanish").css("z-index", "-1");                
    //        }
    //    }
    //}

    stopReading = function(){
        var pageName = pageArr[pageIndex].pageName;
        var pageId = pageArr[pageIndex].pageId;
        if (selfiePageArray[selfieIndex].selfNarration === true){
            if(!$("#selfieAudio"+pageName).get(0).paused){
            
                $(pageId+"_btnVideo").css({ opacity: 1 });
                
                $("#selfieAudio"+pageName).get(0).pause();
                
           }
        }else{
            if (!$(pageId+"_"+pageName)[0].paused) {
                $(pageId+"_btnVideo").css({ opacity: 1 });
                $(pageId+"_"+pageName)[0].pause();
            }
        }
    };
   
    //tractorButton = function(){        
    //    setTimeout(function(){
    //        $("#Stage_tractor").css({ opacity: 0.32});
    //        pageSwipeUp();
    //    }, 125);
    //    $("#Stage_tractor").css({ opacity: 1});
    //};
   
    slamDone = function(){
        $(pageArr[pageIndex].pageDown1Id).hide();
        $(pageArr[pageIndex].pageId).show();
				$("#Stage_toolBar").show();
				//$("#Stage_toolBar").css("z-index", "1");
				
				
        //if (pageArr[pageIndex].pageType == "selfie") {
            //$("#Stage_groupSwipe").show();
            //$("#Stage_groupSwipe").css("z-index", "1");
        //}
       
        if (pageArr[pageIndex].pageType == "selfie") {      
            if (preferencesArray[0].showReadingSpeed === true){
                $("#Stage_dialogSpeed").css("z-index", "1");
                $("#Stage_dialogSpeed").show();
            }
       }
    
    };
   
     tractorButton = function(){
        if (recordingOpen()  === false){
            if (pageArr[pageIndex].pageDown1Name !== "none") {
								$("#Stage_toolBar").hide();
								//$("#Stage_toolBar").css("z-index", "-1");
								
                closePreferences();
                var pageId = pageArr[pageIndex].pageId;
                var pageName = pageArr[pageIndex].pageName;
								if(!$(pageId+"_"+pageName).get(0).paused){                
									$(pageId+"_"+pageName).get(0).pause();
									//$(pageId+"_"+pageName).get(0).currentTime = 0;
									$(pageId+"_btnVideo").css({ opacity: 1 });
								}
								if(!$(pageId+"_"+pageName+"Spanish").get(0).paused){				
										$(pageId+"_"+pageName+"Spanish").get(0).pause();
										//$(pageId+"_"+pageName+"Spanish").get(0).currentTime = 0;
										$("#Stage_toolBar_groupEspanol").show();
										$("#Stage_toolBar_groupEspanol_x").hide();
								}
								
								if(!$("#selfieAudio"+pageName).get(0).paused){ 
									$("#selfieAudio"+pageName).get(0).pause();
									$(pageId+"_btnVideo").css({ opacity: 1 });
									//$("#selfieAudio"+pageName).get(0).currentTime = 0;
								}
								
								
                if ($("#Stage_dialogSpeed").css('zIndex') == 1) {
                    $("#Stage_dialogSpeed").css("z-index", "-1");
                    $("#Stage_dialogSpeed").hide();
                    
                }
                if ($("#Stage_preferences").css('zIndex') == 1) {
                    $("#Stage_preferences").css("z-index", "-1");
                    $("#Stage_preferences").hide();
                    if (isRecording) {
                        doRecordStop();
                    }
                }
                $("#Stage_recNav").css({ opacity: 0 });
                $("#Stage_recNav").css("z-index", "-1");  
                if (pageArr[pageIndex].pageDown1Name.indexOf("game") >= 0){
                   showHangmanHints();
                }
								
                $(pageArr[pageIndex].pageDown1Id).show();
                $(pageArr[pageIndex].pageId).hide();
            }
        }
    };
    
    btnSpanishPlay = function(){
        var pageName = pageArr[pageIndex].pageName;
        var pageId = pageArr[pageIndex].pageId;
        if (!$(pageId+"_"+pageName)[0].paused) {
            $(pageId+"_"+pageName)[0].pause();
            $(pageId+"_"+pageName).get(0).currentTime = 0;
            $(pageId+"_btnVideo").css({ opacity: 1 });
        }
        if(!$("#selfieAudio"+pageName).get(0).paused){
            $("#selfieAudio"+pageName).get(0).pause();
            $("#selfieAudio"+pageName).get(0).currentTime = 0;
            $(pageId+"_btnVideo").css({ opacity: 1 });
        }
         $(pageId+"_"+pageName+"Spanish").bind("ended", function(){
						$("#Stage_toolBar_groupEspanol").show();
						$("#Stage_toolBar_groupEspanol_x").hide();
            //$(pageId+"_btnSpanish_AudioAsset_pause").css({ opacity: 0 });
            //$(pageId+"_btnSpanish_AudioAsset_play").css({ opacity: 1 });
         });
        if(!$(pageId+"_"+pageName+"Spanish").get(0).paused){
            $(pageId+"_"+pageName+"Spanish").get(0).pause();
            //$(pageId+"_btnSpanish_AudioAsset_pause").css({ opacity: 0 });
            //$(pageId+"_btnSpanish_AudioAsset_play").css({ opacity: 1 });
        }else{
            $(pageId+"_"+pageName+"Spanish").get(0).play();
            //$(pageId+"_btnSpanish_AudioAsset_pause").css({ opacity: 1 });
            //$(pageId+"_btnSpanish_AudioAsset_play").css({ opacity: 0 });
        }
    };

    killSpanish = function(){
        var pageName = pageArr[pageIndex].pageName;
        var pageId = pageArr[pageIndex].pageId;
        if(!$(pageId+"_"+pageName+"Spanish").get(0).paused){
            $(pageId+"_"+pageName+"Spanish").get(0).pause();
            //$(pageId+"_"+pageName+"Spanish").get(0).currentTime = 0;
						$("#Stage_toolBar_groupEspanol").show();
						$("#Stage_toolBar_groupEspanol_x").hide();
            //$(pageId+"_btnSpanish_AudioAsset_pause").css({ opacity: 0 });
            //$(pageId+"_btnSpanish_AudioAsset_play").css({ opacity: 1 });
        }
    };
    
    //reviveSpanish = function(){
    //    //$(pageId+"_btnSpanish_AudioAsset_pause").css({ opacity: 0 });
    //    //$(pageId+"_btnSpanish_AudioAsset_play").css({ opacity: 1 });
    //};
    
//    btnPlayPauseCover = function(){
//        var pageName = pageArr[pageIndex].pageName;
//        var pageId = pageArr[pageIndex].pageId;
//				if(!$("#selfieAudio"+pageName).get(0).paused){ 
//						$("#selfieAudio"+pageName).get(0).pause();
//						$("#selfieAudio"+pageName).get(0).currentTime = 0;
//				}
//        if ($(".speakerYellowCover").is(":visible")) {
//           
//            $(".txtPlayPauseCover").text('Pause');
//            $(".speakerYellowCover").hide();
//            $(".speakerGreenCover").show();
//            $(pageId+"_"+pageName)[0].play();
//            $(pageId+"_"+pageName).get(0).onended = function() {
//                $(".txtPlayPauseCover").text('Play');
//                $(".speakerYellowCover").show();
//                $(".speakerGreenCover").hide();
//                $(".txtPlayPauseCover").css("color", "rgb(97,138,96)"); //green
//            }; 
//        }else{
//           
//            $(".txtPlayPauseCover").text('Play');
//            $(".speakerYellowCover").show();
//            $(".speakerGreenCover").hide();
//            $(".txtPlayPauseCover").css("color", "rgb(97,138,96)"); //green
//            $(pageId+"_"+pageName)[0].pause();
//        }
//    };
    
		function playTheme(){
				var pageName = pageArr[pageIndex].pageName;
				var pageId = pageArr[pageIndex].pageId;
				$(pageId+"_toolBarCover_groupThemeOff").show();
				$(pageId+"_toolBarCover_groupThemeOn").hide();
				//if(!$("#selfieAudio"+pageName).get(0).paused){ 
				//		$("#selfieAudio"+pageName).get(0).pause();
				//		$("#selfieAudio"+pageName).get(0).currentTime = 0;
				//}
				
				$(pageId+"_"+pageName)[0].play();
        $(pageId+"_"+pageName).get(0).onended = function() {
						$(pageId+"_toolBarCover_groupThemeOff").hide();
						$(pageId+"_toolBarCover_groupThemeOn").show();	
				};
				
		}
		
		function pauseTheme(){
				var pageName = pageArr[pageIndex].pageName;
				var pageId = pageArr[pageIndex].pageId;
				$(pageId+"_toolBarCover_groupThemeOff").hide();
				$(pageId+"_toolBarCover_groupThemeOn").show();
				$(pageId+"_"+pageName)[0].pause();
		}
		
    
    btnPicturePlay = function(){
        if (!isRecording) {                       
            var pageId = pageArr[pageIndex].pageId;
            var pageName = pageArr[pageIndex].pageName;
            var pageType = pageArr[pageIndex].pageType;			
            if (pageType != "picOnlySelfie") {
								$(pageId+"_btnVideo").css({ opacity: 1 });
												killSpanish();
								pauseVideo();
						}
				
						if (pageName == "pageCover"){
								pausePlayer();
						}
				
				
						$("#selfieAudio"+pageName).get(0).onended = function() {               
								$("#ping")[0].pause();
						};
						var src = $("#selfieAudio"+pageName).attr("src");
						if(!$("#selfieAudio"+pageName).get(0).paused && src.indexOf("Picture") >= 0 && src.indexOf(pageName) >=0){
									 $("#selfieAudio"+pageName).get(0).pause();
						
						}else{
								
								if(src === "" || src.indexOf("Picture") === -1 || newPictureRecording === true || (selfiePageArray[selfieIndex].defaultTalkie === true && selfiePageArray[selfieIndex].refreshTalkieAudio === true)){
										selfiePageArray[selfieIndex].refreshTalkieAudio = false;
										newPictureRecording = false;
										playAudioPicture();
								}else{
										$("#selfieAudio"+pageName).get(0).playbackRate = 1; 	
										$("#selfieAudio"+pageName).get(0).play();
								}
						}
        }  
    };
    
    btnPagePlay = function(){
        var pageName = pageArr[pageIndex].pageName;
        var pageId = pageArr[pageIndex].pageId;
        killSpanish();               
        if (selfiePageArray[selfieIndex].selfNarration === true && selfiePageArray[selfieIndex].narrationExists === true){
           
            $("#selfieAudio"+pageName).get(0).onended = function() {
                
                $(pageId+"_btnVideo").css({ opacity: 1 });
                if (preferencesArray[0].narrationPing === true && fromSwitchPage === false) {
                    $("#ping")[0].play();
                }                
            }; 
            $(pageId+"_imgWords").show();           
						var src = $("#selfieAudio"+pageName).attr("src"); 
						if(!$("#selfieAudio"+pageName).get(0).paused && src.indexOf("Picture") === -1){
               $(pageId+"_btnVideo").css({ opacity: 1 });
               $("#selfieAudio"+pageName).get(0).pause();
            }else{
                 $(pageId+"_btnVideo").css({ opacity: 0.20 });
                 picturePlaying = false;                 
				 if(src === "" || src.indexOf("Picture") >= 0 || newNarrationRecording === true){
					newNarrationRecording = false;
					playAudioNarration();
				 }else{
						$("#selfieAudio"+pageName).get(0).playbackRate = preferencesArray[0].readingSpeed;
						if (pageTurn === true){
								$("#selfieAudio"+pageName).get(0).currentTime = 0;
								pageTurn = false;
						}
						$("#selfieAudio"+pageName).get(0).play();
				 }
            }    
        }else{
            
            $(pageId+"_"+pageName)[0].onended = function() {                
                $(pageId+"_btnVideo").css({ opacity: 1 });
                if (preferencesArray[0].narrationPing === true && fromSwitchPage === false) {
                    $("#ping")[0].play();
                }
            };
			
						if(!$("#selfieAudio"+pageName).get(0).paused){                
											$("#selfieAudio"+pageName).get(0).pause();
						}
			
            $(pageId+"_"+pageName)[0].playbackRate = preferencesArray[0].readingSpeed;
            if(preferencesArray[0].highlightWords === true){
                $(pageId+"_imgWords").hide();
            }else{
                $(pageId+"_imgWords").show();
            }
            if ($(pageId+"_"+pageName)[0].paused) {
                $(pageId+"_btnVideo").css({ opacity: 0.20 });
                $(pageId+"_"+pageName)[0].play();
            }else{
                $(pageId+"_btnVideo").css({ opacity: 1 });
                $(pageId+"_"+pageName)[0].pause();
            }         
        }
    };

    showHangmanHints = function(){
        var targetContainer = $(pageArr[pageIndex].pageDown1Id+"_slamContent");
        EC.loadComposition('slam/slam.html', targetContainer)
            .done(function(comp) {
            var slamStage = comp.getStage(),
                stageID = slamStage.createChildSymbol(pageArr[pageIndex].pageDown1Name, "Stage").getSymbolElement().attr("id");
    
            stageID = "#"+stageID;
            slamStage.$(stageID).css({"position": "absolute",  "top" : "34px", "left": "28px"});
    
            localStorage.setItem("stageID", stageID);
            localStorage.setItem("slamGame",pageArr[pageIndex].pageDown1Name );
        });        
    };
    
    function recordingOpen() {
        if ($(".recordPlayStage")[0] && $(".recordPlayStage").css("z-index") == 1)  {
            setTimeout(function(){
                $(".recRecordPlayBorder").css('border-color', '#739c72'); //green
                $(".recRecordingCompleteBorder").css('border-color', '#739c72'); //green
                navigator.notification.alert(
                    'Please close the recording panel.',  // message  recRecordingCompleteBorder
                     pleaseCloseRecordingPanel,         // callback
                    'Recording Panel Open',            // title
                    'Ok'                  // buttonName
                );
            }, 500);
            $(".recRecordPlayBorder").css("border-color", "red");
            $(".recRecordingCompleteBorder").css("border-color", "red");
            return true;
        }else{
            return false;
        }
    }
    
    function pleaseCloseRecordingPanel() {
        setTimeout(function(){
                $(".recRecordPlayBorder").css('border-color', '#739c72'); //green
                $(".recRecordingCompleteBorder").css('border-color', '#739c72'); //green    
        }, 500);
        $(".recRecordPlayBorder").css("border-color", "red");
        $(".recRecordingCompleteBorder").css("border-color", "red");
    }
    
    
    function killPageWords() {
        if (pageArr[pageIndex].pageWordId !== ''){
            console.log($(pageArr[pageIndex].pageWordId).css("z-index"));
            if ($(pageArr[pageIndex].pageWordId).css("z-index") == 1){
                hidePageWords();
                console.log('pageWords hidden');
            }
        }else{
            console.log("none");
        }
    }
    
    function closePreferences() {
        if ($("#Stage_preferences").css('zIndex') == 1) {
            exitPreferences();
            $("#Stage_preferences").hide();
            $("#Stage_preferences").css("z-index", "-1");
            
        }
        if ($("#Stage_gallery").css('zIndex') == 1) {
            $("#Stage_gallery").hide();
            $("#Stage_gallery").css("z-index", "-1");
        }
        if ($("#Stage_cameraRotate").css('zIndex') == 1) {
            $("#Stage_cameraRotate").hide();
            $("#Stage_cameraRotate").css("z-index", "-1");
        }
        
    }
    
    function stopTheAudio(pageId, pageName, index) {
        fromSwitchPage = true;
        var pageType = pageArr[index].pageType;
        switch(pageType) {
        case 'songPage':
				if(!$(pageId+"_"+pageName).get(0).paused){                
					$(pageId+"_"+pageName).get(0).pause();
					$(pageId+"_"+pageName).get(0).currentTime = 0;
				}
                if (pageName == "pageSong") {
					if(!$(pageId+"_pageCredits").get(0).paused){ 					
						$(pageId+"_pageCredits")[0].pause();
						$(pageId+"_pageCredits").get(0).currentTime = 0;
					}
                }
            break;
        case 'selfie':
						
								if(!$(pageId+"_"+pageName).get(0).paused){                
									$(pageId+"_"+pageName).get(0).pause();
									$(pageId+"_"+pageName).get(0).currentTime = 0;
									
								}
								$(pageId+"_"+pageName).hide();
								
								setTimeout(function(){
										$(pageId+"_"+pageName).get(0).src = '';		
								}, 125);
								
								//if (!$(pageId+"_"+pageName+"Spanish")[0].paused) {
										$(pageId+"_"+pageName+"Spanish")[0].pause();
										$(pageId+"_"+pageName+"Spanish")[0].currentTime = 0;
								//}
								
											
								//if(!$(pageId+"_"+pageName+"Spanish").get(0).paused){				
								//	$(pageId+"_"+pageName+"Spanish").get(0).pause();
								//	$(pageId+"_"+pageName+"Spanish").get(0).currentTime = 0;
								//}
								//$(pageId+"_"+pageName)[0].currentTime = 0;
								
								
								
								//$(pageId+"_btnVideo").css({ opacity: 1 });	
														
								$(pageId+"_btnVideo").css({ opacity: 1 });
								if(!$("#selfieAudio"+pageName).get(0).paused){ 
									$("#selfieAudio"+pageName).get(0).pause();
									$("#selfieAudio"+pageName).get(0).currentTime = 0;
								}
								
								$("#Stage_toolBar_groupEspanol").show();
								$("#Stage_toolBar_groupEspanol_x").hide();
								
								//$(pageId+"_btnSpanish_AudioAsset_pause").css({ opacity: 0 });
								//$(pageId+"_btnSpanish_AudioAsset_play").css({ opacity: 1 });
            break;
		case 'picOnlySelfie':
				if(!$("#selfieAudio"+pageName).get(0).paused){ 
					$("#selfieAudio"+pageName).get(0).pause();
					$("#selfieAudio"+pageName).get(0).currentTime = 0;
				}
				if (pageName == "pageCover"){
						if(!$(pageId+"_"+pageName).get(0).paused){
								$(pageId+"_"+pageName).get(0).currentTime = 0;
								$(pageId+"_"+pageName)[0].pause();
								$(pageId+"_toolBarCover_groupThemeOff").hide();
								$(pageId+"_toolBarCover_groupThemeOn").show();
						}
					
				}
        }
        fromSwitchPage = false;
    }

//    function btnDoneSlam() {
//		var yellowText = 'rgb(251,237,197)';
//		var greenText = 'rgb(47,126,47)';
//			setTimeout(function(){
//							$(".txtBtnSlam").css("color", greenText);
//							slamDone();
//					}, 125);
//					$(".txtBtnSlam").css("color", yellowText);
//			}
	
			showPageWords = function(){		//from overlayRec click
				pageId = pageArr[pageIndex].pageId;
				$(pageId+"_imgWordsBG").hide();				
        if (pageArr[pageIndex].pageWordId === '') {
            pageArr[pageIndex].pageWordId = '#'+words.Sym.createChildSymbol(pageArr[pageIndex].pageName+"Words", $(pageArr[pageIndex].pageId)).getSymbolElement().attr("id");
            $(pageArr[pageIndex].pageWordId).attr("desc",pageArr[pageIndex].pageName+"_wordsPage");
            $(pageArr[pageIndex].pageWordId).attr('class','wordsPage');
            words.touchTapWords();
						//==========================================
						$(pageArr[pageIndex].pageWordId).on('swipeleft',function(){
								doSwipeLeft();						                
						} );
						$(pageArr[pageIndex].pageWordId).on('swiperight',function(){
								doSwipeRight();						                
						} );
						$(pageArr[pageIndex].pageWordId).on('swipedown',function(){
								showNavButtons();						                
						} );
						//==========================================
						
						
        }
        
        loadUp_wordsContainer();  //moved 02-01-2017 mlp
        var pageWordId = pageArr[pageIndex].pageWordId,
            pageId = pageArr[pageIndex].pageId;
       
        $(pageId+"_groupRead").hide();
        $(pageId+"_groupRead").css("z-index", "-1");
        stopReading();
        $(pageWordId).show();
        $(pageWordId).css("z-index", "1");

        //$(pageId+"_btnWords").hide();
        //$(pageId+"_btnWords").css("z-index", "-1");

        //$(pageId+"_btnDone").show();
        //$(pageId+"_btnDone").css("z-index", "1");

        $(pageId+"_btnVideo").hide();
        $(pageId+"_btnVideo").css("z-index", "-1");
       
    };


    hidePageWords = function(){
		var pageWordId = pageArr[pageIndex].pageWordId,
			pageId = pageArr[pageIndex].pageId;
			
//		setTimeout(function(){
//        $(pageId+"_toolBar_gearOverlay").css("background-color", "rgb(255,255,255,0.00)");
//        $(".imgSettings").show();
//    }, 500);
		
		
		//$(pageId+"_toolBar_gearOverlay").css("background-color", "rgb(179,139,201,0.25)");
		
		$(pageId+"_imgWordsBG").show();
		$(pageId+"_groupRead").show();
		$(pageId+"_groupRead").css("z-index", "1");
		
		$(pageWordId).hide();
		$(pageWordId).css("z-index", "-1");
	
		//$(pageId+"_btnWords").show();
		//$(pageId+"_btnWords").css("z-index", "1");
	
		//$(pageId+"_btnDone").hide();
		//$(pageId+"_btnDone").css("z-index", "-1");
	
		$(pageId+"_btnVideo").show();
		$(pageId+"_btnVideo").css("z-index", "1");
		
		$(pageId+"_imageChosen").css("z-index", "1");
    };

    loadUp_wordsContainer = function(){
	words.kbArray.length = 0;
	    $.getJSON(pageArr[pageIndex].pageName+"/data/game.json", function(data) {
		for(var i=0; i<data.length; i++){
			words.kbArray.push({"word":data[i].word, "numLet":data[i].numLet, "activeWord":false,
				      "let1":data[i].let1, "let1Found":false, "letNum1" : 1,
				      "let2":data[i].let2, "let2Found":false, "letNum2" : 2,
				      "let3":data[i].let3, "let3Found":false, "letNum3" : 3,
				      "let4":data[i].let4, "let4Found":false, "letNum4" : 4,
				      "let5":data[i].let5, "let5Found":false, "letNum5" : 5,
				      "let6":data[i].let6, "let6Found":false, "letNum6" : 6,
				      "let7":data[i].let7, "let7Found":false, "letNum7" : 7,
				      "let8":data[i].let8, "let8Found":false, "letNum8" : 8,
				      "let9":data[i].let9, "let9Found":false, "letNum9" : 9,
				      "let10":data[i].let10, "let10Found":false, "letNum10" : 10,
				      "let11":data[i].let11, "let11Found":false, "letNum11" : 11,
				      "let12":data[i].let12, "let12Found":false, "letNum12" : 12,
				      "let13":data[i].let13, "let13Found":false, "letNum13" : 13,
				      "let14":data[i].let14, "let14Found":false, "letNum14" : 14,
				      "let15":data[i].let15, "let15Found":false, "letNum15" : 15,
				      "let16":data[i].let16, "let16Found":false, "letNum16" : 16,
				      "let17":data[i].let17, "let17Found":false, "letNum17" : 17,
				      "let18":data[i].let18, "let18Found":false, "letNum18" : 18,
				      "let19":data[i].let19, "let19Found":false, "letNum19" : 19,
				      "let20":data[i].let20, "let20Found":false, "letNum20" : 20,
				      "numSyl":data[i].numSyl,
				      "syl1":data[i].syl1, "sylNum1" : 1,
				      "syl2":data[i].syl2, "sylNum2" : 2,
				      "syl3":data[i].syl3, "sylNum3" : 3,
				      "syl4":data[i].syl4, "sylNum4" : 4,
				      "syl5":data[i].syl5, "sylNum6" : 5,
				      "hangmanWord":data[i].hangmanWord});
		}
	    });
    };

    words.makeLowerCase = function(value){
	return value.toString().toLowerCase();
    };

    words.hasNumbers = function(t)
    {
        return /\d/.test(t);
    };

    words.loadSounds = function(sWord) {
        var sndThe = new Audio('media/'+sWord+'.mp3');
        sndThe.load();
        sndThe.play();
        sndThe = null;
    };

    words.loadSingle = function(sWord){
	var pageWordId = pageArr[pageIndex].pageWordId;

	
        $(pageWordId+"_"+sWord).animate(
        {
                color: "#FF0000",
                fontSize: 43,

        },(words.timeSingle01_Base / 2)
        );

        $(pageWordId+"_"+sWord).animate(
        {
                fontSize: 32,
        },(words.timeSingle01_Base / 2)
        );

	$(pageWordId+"_"+sWord).animate(
	    {
		color: "#000"
	    },(1)
        );
    };

    words.loadMulti = function(sWord, sTime){
	//var pageWordId = pageArr[pageIndex].pageWordId,
	//    numOfSyllables = words.kbArray[words.index].numSyl,
	    var fTime = -1;
	
        switch (sTime)
        {
            case 1:
                fTime = 0;
                timer1 = setTimeout(function ()
                {
                    words.animateWord(sWord, 400);
                },fTime);
                break;
            case 2:
		
                fTime = 1000;
                timer2 = setTimeout(function ()
                {
                     words.animateWord(sWord, 500);
                },fTime);
                break;
            case 3:
               
                fTime = 2500;
                timer3 = setTimeout(function ()
                {
                    words.animateWord(sWord, 500);
                },fTime);
                break;
            case 4:
                
                fTime = 4000;
                timer4 = setTimeout(function ()
                {
                     words.animateWord(sWord, 500);
                },fTime);
                break;
            case 5:
                fTime = 5500;
                timer5 = setTimeout(function ()
                {
                    words.animateWord(sWord, 500);
                },fTime);
                break;
        }
    };

    words.animateWord = function(sWord, sTime){
	var pageWordId = pageArr[pageIndex].pageWordId;
	$(pageWordId+"_"+sWord).css("color", "#FF0000");
	
	timer6 = setTimeout(function ()
	{
	    $(pageWordId+"_"+sWord).animate(
	    {
        color: "#FF0000",   
		fontSize: 43
	    },(sTime));

	},sTime);
    
	timer7 = setTimeout(function ()
	{
	    $(pageWordId+"_"+sWord).animate(
	    {
        //color: "#FF0000",   
		fontSize: 32
	    },(sTime));

	},sTime*2);
    
	timer8 = setTimeout(function ()
	{
	    $(pageWordId+"_"+sWord).animate(
	    {
         //color: "#FF0000",    
		color: "#000"
	    },(sTime));

	},sTime*3);

    };

    words.loadWords = function() {
        var numOfSyllables = words.kbArray[words.index].numSyl,
	    lWord = words.kbArray[words.index].word,
	    lWordLower = lWord;

        lWordLower = words.makeLowerCase(lWordLower);
        if(words.hasNumbers(lWordLower) === true){
           lWordLower = lWordLower.replace(/[0-9]/g, '');
        }

        words.loadSounds(lWordLower);
        var wordIndex = words.kbArray[words.index];
        
        words.clearTimers();
        if (words.previouskbArrayIndex != -1 && words.previousPageIndex == pageIndex){    
            words.clearPreviousSyllables();
        }
        words.previouskbArrayIndex = words.index;        
        words.previousPageIndex = pageIndex;
        
        switch (numOfSyllables)
        {
            case 1:
               words.loadSingle(lWord);
               break;
            case 2:
               words.loadMulti(wordIndex.syl1,1);
               words.loadMulti(wordIndex.syl2,2);
               break;
            case 3:
               words.loadMulti(wordIndex.syl1,1);
               words.loadMulti(wordIndex.syl2,2);
               words.loadMulti(wordIndex.syl3,3);
               break;
            case 4:
               words.loadMulti(wordIndex.syl1,1);
               words.loadMulti(wordIndex.syl2,2);
               words.loadMulti(wordIndex.syl3,3);
               words.loadMulti(wordIndex.syl4,4);
               break;
            case 5:
               words.loadMulti(wordIndex.syl1,1);
               words.loadMulti(wordIndex.syl2,2);
               words.loadMulti(wordIndex.syl3,3);
               words.loadMulti(wordIndex.syl4,4);
               words.loadMulti(wordIndex.syl5,5);
               break;
        }
        
    };
    
    words.clearPreviousSyllables = function(){        
        var wordIndex = words.kbArray[words.previouskbArrayIndex];  //words.index = 38 (necessary)
        var numOfSyllables = words.kbArray[words.previouskbArrayIndex].numSyl;
        switch (numOfSyllables)
        {
            case 1:	       		   
                words.resetFondAndColor(wordIndex.syl1);
                break;
            case 2:
                words.resetFondAndColor(wordIndex.syl1);
                words.resetFondAndColor(wordIndex.syl2);							
                break;
            case 3:
                words.resetFondAndColor(wordIndex.syl1);
                words.resetFondAndColor(wordIndex.syl2);
                words.resetFondAndColor(wordIndex.syl3);
                break;
            case 4:                
                words.resetFondAndColor(wordIndex.syl1);
                words.resetFondAndColor(wordIndex.syl2);
                words.resetFondAndColor(wordIndex.syl3);
                words.resetFondAndColor(wordIndex.syl4);
               break;
            case 5:
                words.resetFondAndColor(wordIndex.syl1);
                words.resetFondAndColor(wordIndex.syl2);
                words.resetFondAndColor(wordIndex.syl3);
                words.resetFondAndColor(wordIndex.syl4);
                words.resetFondAndColor(wordIndex.syl5);
               break;
        }
    };
	
    words.resetFondAndColor = function(sWord){
        var fontSize = 32;
        var color =  "#000";
        var pageWordId = pageArr[pageIndex].pageWordId;        
        $(pageWordId+"_"+sWord).animate({'color': color, 'font-size': fontSize});        
    };

    words.clearTimers = function(){
	clearTimeout(timer1);
	clearTimeout(timer2);
	clearTimeout(timer3);
	clearTimeout(timer4);
	clearTimeout(timer5);
	clearTimeout(timer6);
	clearTimeout(timer7);
	clearTimeout(timer8);
    };

    words.loadCustom = function() {
	var pageWordId = pageArr[pageIndex].pageWordId;
	setTimeout(function()
	{
	    $(pageWordId+"_mis").css("opacity", "0");
	    $(pageWordId+"_sus").css("opacity", "0");
	},2500);
	words.loadMulti("mis",1);
	words.loadMulti("sus",2);
        $(pageWordId+"_mis").css("opacity", "100");
        $(pageWordId+"_sus").css("opacity", "100");
        //loadWords("mrs");
				words.loadSounds("mrs");
    };

    words.touchTapWords = function(){
	var pageWordId = pageArr[pageIndex].pageWordId;
	if (Modernizr.touch) {
            $( pageWordId+"_Rec_0" ).on({touchstart: function() {
	       words.index=0;
               words.loadWords();
	       }});
            $( pageWordId+"_Rec_1" ).on({touchstart: function() {
               words.index=1;
               words.loadWords();}});
            $( pageWordId+"_Rec_2" ).on({touchstart: function() {
               words.index=2;
               words.loadWords();}});
            $( pageWordId+"_Rec_3" ).on({touchstart: function() {
               words.index=3;
               words.loadWords();}});
            $( pageWordId+"_Rec_4" ).on({touchstart: function() {
               words.index=4;
               words.loadWords();}});
            $( pageWordId+"_Rec_5" ).on({touchstart: function() {
               words.index=5;
               words.loadWords();}});
	    $( pageWordId+"_Rec_5Custom").on({touchstart: function() {
               words.loadCustom();}});
            $( pageWordId+"_Rec_6" ).on({touchstart: function() {
               words.index=6;
               words.loadWords();}});
            $( pageWordId+"_Rec_7" ).on({touchstart: function() {
               words.index=7;
               words.loadWords();}});
            $( pageWordId+"_Rec_8" ).on({touchstart: function() {
               words.index=8;
               words.loadWords();}});
            $( pageWordId+"_Rec_9" ).on({touchstart: function() {
               words.index=9;
               words.loadWords();}});
            $( pageWordId+"_Rec_10" ).on({touchstart: function() {
               words.index=10;
               words.loadWords();}});
            $( pageWordId+"_Rec_11" ).on({touchstart: function() {
               words.index=11;
               words.loadWords();}});
            $( pageWordId+"_Rec_12" ).on({touchstart: function() {
               words.index=12;
               words.loadWords();}});
            $( pageWordId+"_Rec_13" ).on({touchstart: function() {
               words.index=13;
               words.loadWords();}});
            $( pageWordId+"_Rec_14" ).on({touchstart: function() {
               words.index=14;
               words.loadWords();}});
            $( pageWordId+"_Rec_15" ).on({touchstart: function() {
               words.index=15;
               words.loadWords();}});
            //===============
            $( pageWordId+"_Rec_16" ).on({touchstart: function() {
               words.index=16;
               words.loadWords();}});
            $( pageWordId+"_Rec_17" ).on({touchstart: function() {
               words.index=17;
               words.loadWords();}});
            $( pageWordId+"_Rec_18" ).on({touchstart: function() {
               words.index=18;
               words.loadWords();}});
            $( pageWordId+"_Rec_19" ).on({touchstart: function() {
               words.index=19;
               words.loadWords();}});
            $( pageWordId+"_Rec_20" ).on({touchstart: function() {
               words.index=20;
               words.loadWords();}});
            $( pageWordId+"_Rec_21" ).on({touchstart: function() {
               words.index=21;
               words.loadWords();}});
            $( pageWordId+"_Rec_22" ).on({touchstart: function() {
               words.index=22;
               words.loadWords();}});
            $( pageWordId+"_Rec_23" ).on({touchstart: function() {
               words.index=23;
               words.loadWords();}});
            $( pageWordId+"_Rec_24" ).on({touchstart: function() {
               words.index=24;
               words.loadWords();}});
            $( pageWordId+"_Rec_25" ).on({touchstart: function() {
               words.index=25;
               words.loadWords();}});
            $( pageWordId+"_Rec_26" ).on({touchstart: function() {
               words.index=26;
               words.loadWords();}});
            $( pageWordId+"_Rec_27" ).on({touchstart: function() {
               words.index=27;
               words.loadWords();}});
            $( pageWordId+"_Rec_28" ).on({touchstart: function() {
               words.index=28;
               words.loadWords();}});
            $( pageWordId+"_Rec_29" ).on({touchstart: function() {
               words.index=29;
               words.loadWords();}});
            $( pageWordId+"_Rec_30" ).on({touchstart: function() {
               words.index=30;
               words.loadWords();}});
            $( pageWordId+"_Rec_31" ).on({touchstart: function() {
               words.index=31;
               words.loadWords();}});
            //========================
            $( pageWordId+"_Rec_32" ).on({touchstart: function() {
               words.index=32;
               words.loadWords();}});
            $( pageWordId+"_Rec_33" ).on({touchstart: function() {
               words.index=33;
               words.loadWords();}});
            $( pageWordId+"_Rec_34" ).on({touchstart: function() {
               words.index=34;
               words.loadWords();}});
            $( pageWordId+"_Rec_35" ).on({touchstart: function() {
               words.index=35;
               words.loadWords();}});
            $( pageWordId+"_Rec_36" ).on({touchstart: function() {
               words.index=36;
               words.loadWords();}});
            $( pageWordId+"_Rec_37" ).on({touchstart: function() {
               words.index=37;
               words.loadWords();}});
            $( pageWordId+"_Rec_38" ).on({touchstart: function() {
               words.index=38;
               words.loadWords();}});
            $( pageWordId+"_Rec_39" ).on({touchstart: function() {
               words.index=39;
               words.loadWords();}});
            $( pageWordId+"_Rec_40" ).on({touchstart: function() {
               words.index=40;
               words.loadWords();}});
            $( pageWordId+"_Rec_41" ).on({touchstart: function() {
               words.index=41;
               words.loadWords();}});
            $( pageWordId+"_Rec_42" ).on({touchstart: function() {
               words.index=42;
               words.loadWords();}});
            $( pageWordId+"_Rec_43" ).on({touchstart: function() {
               words.index=43;
               words.loadWords();}});
            $( pageWordId+"_Rec_44" ).on({touchstart: function() {
               words.index=44;
               words.loadWords();}});
            $( pageWordId+"_Rec_45" ).on({touchstart: function() {
               words.index=45;
               words.loadWords();}});
	    //==========
	    $( pageWordId+"_Rec_46" ).on({touchstart: function() {
               words.index=46;
               words.loadWords();}});
	    //=========
            $( pageWordId+"_Rec_47" ).on({touchstart: function() {
               words.index=47;
               words.loadWords();}});
            $( pageWordId+"_Rec_48" ).on({touchstart: function() {
               words.index=48;
               words.loadWords();}});
            $( pageWordId+"_Rec_49" ).on({touchstart: function() {
               words.index=49;
               words.loadWords();}});
            $( pageWordId+"_Rec_50" ).on({touchstart: function() {
               words.index=50;
               words.loadWords();}});
            $( pageWordId+"_Rec_51" ).on({touchstart: function() {
               words.index=51;
               words.loadWords();}});
            $( pageWordId+"_Rec_52" ).on({touchstart: function() {
               words.index=52;
               words.loadWords();}});
            $( pageWordId+"_Rec_53" ).on({touchstart: function() {
               words.index=53;
               words.loadWords();}});
            $( pageWordId+"_Rec_54" ).on({touchstart: function() {
               words.index=54;
               words.loadWords();}});
            $( pageWordId+"_Rec_55" ).on({touchstart: function() {
               words.index=55;
               words.loadWords();}});
            $( pageWordId+"_Rec_56" ).on({touchstart: function() {
               words.index=56;
               words.loadWords();}});
            $( pageWordId+"_Rec_57" ).on({touchstart: function() {
               words.index=57;
               words.loadWords();}});
            $( pageWordId+"_Rec_58" ).on({touchstart: function() {
               words.index=58;
               words.loadWords();}});
            $( pageWordId+"_Rec_59" ).on({touchstart: function() {
               words.index=59;
               words.loadWords();}});
	    //===================
	    $( pageWordId+"_Rec_60" ).on({touchstart: function() {
               words.index=60;
               words.loadWords();}});
            $( pageWordId+"_Rec_61" ).on({touchstart: function() {
               words.index=61;
               words.loadWords();}});
            $( pageWordId+"_Rec_62" ).on({touchstart: function() {
               words.index=62;
               words.loadWords();}});
            $( pageWordId+"_Rec_63" ).on({touchstart: function() {
               words.index=63;
               words.loadWords();}});
            $( pageWordId+"_Rec_64" ).on({touchstart: function() {
               words.index=64;
               words.loadWords();}});
            $( pageWordId+"_Rec_65" ).on({touchstart: function() {
               words.index=65;
               words.loadWords();}});
            $( pageWordId+"_Rec_66" ).on({touchstart: function() {
               words.index=66;
               words.loadWords();}});
            $( pageWordId+"_Rec_67" ).on({touchstart: function() {
               words.index=67;
               words.loadWords();}});
            $( pageWordId+"_Rec_68" ).on({touchstart: function() {
               words.index=68;
               words.loadWords();}});
            $( pageWordId+"_Rec_69" ).on({touchstart: function() {
               words.index=69;
               words.loadWords();}});
            $( pageWordId+"_Rec_70" ).on({touchstart: function() {
               words.index=70;
               words.loadWords();}});
            $( pageWordId+"_Rec_71" ).on({touchstart: function() {
               words.index=71;
               words.loadWords();}});
            $( pageWordId+"_Rec_72" ).on({touchstart: function() {
               words.index=72;
               words.loadWords();}});
            $( pageWordId+"_Rec_73" ).on({touchstart: function() {
               words.index=73;
               words.loadWords();}});
	    $( pageWordId+"_Rec_74" ).on({touchstart: function() {
               words.index=74;
               words.loadWords();}});
            $( pageWordId+"_Rec_75" ).on({touchstart: function() {
               words.index=75;
               words.loadWords();}});
	    $( pageWordId+"_Rec_76" ).on({touchstart: function() {
               words.index=76;
               words.loadWords();}});
            $( pageWordId+"_Rec_77" ).on({touchstart: function() {
               words.index=77;
               words.loadWords();}});
	    $( pageWordId+"_Rec_78" ).on({touchstart: function() {
               words.index=78;
               words.loadWords();}});
            $( pageWordId+"_Rec_79" ).on({touchstart: function() {
               words.index=79;
               words.loadWords();}});
            $( pageWordId+"_Rec_80" ).on({touchstart: function() {
               words.index=80;
               words.loadWords();}});
            $( pageWordId+"_Rec_81" ).on({touchstart: function() {
               words.index=81;
               words.loadWords();}});
            $( pageWordId+"_Rec_82" ).on({touchstart: function() {
               words.index=82;
               words.loadWords();}});
            $( pageWordId+"_Rec_83" ).on({touchstart: function() {
               words.index=83;
               words.loadWords();}});
            $( pageWordId+"_Rec_84" ).on({touchstart: function() {
               words.index=84;
               words.loadWords();}});
            $( pageWordId+"_Rec_85" ).on({touchstart: function() {
               words.index=85;
               words.loadWords();}});
            $( pageWordId+"_Rec_86" ).on({touchstart: function() {
               words.index=86;
               words.loadWords();}});
            $( pageWordId+"_Rec_87" ).on({touchstart: function() {
               words.index=87;
               words.loadWords();}});
	    $( pageWordId+"_Rec_88" ).on({touchstart: function() {
               words.index=88;
               words.loadWords();}});
            $( pageWordId+"_Rec_89" ).on({touchstart: function() {
               words.index=89;
               words.loadWords();}});
	    $( pageWordId+"_Rec_90" ).on({touchstart: function() {
               words.index=90;
               words.loadWords();}});

        }else{
            $( pageWordId+"_Rec_0").click(function() {
               words.index=0;
               words.loadWords();});

            $( pageWordId+"_Rec_1").click(function() {
               words.index=1;
               words.loadWords();
	       });

            $( pageWordId+"_Rec_2").click(function() {
               words.index=2;
               words.loadWords();});
            $( pageWordId+"_Rec_3").click(function() {
               words.index=3;
               words.loadWords();});

            $( pageWordId+"_Rec_4").click(function() {
               words.index=4;
               words.loadWords();});
            $( pageWordId+"_Rec_5").click(function() {
               words.index=5;
               words.loadWords();});
	    $( pageWordId+"_Rec_5Custom").click(function() {
               words.loadCustom();});
            $( pageWordId+"_Rec_6").click(function() {
               words.index=6;
               words.loadWords();});
            $( pageWordId+"_Rec_7").click(function() {
               words.index=7;
               words.loadWords();});

            $( pageWordId+"_Rec_8").click(function() {
               words.index=8;
               words.loadWords();});
            $( pageWordId+"_Rec_9").click(function() {
               words.index=9;
               words.loadWords();});

            $( pageWordId+"_Rec_10").click(function() {
               words.index=10;
               words.loadWords();});

            $( pageWordId+"_Rec_11").click(function() {
               words.index=11;
               words.loadWords();});
            $( pageWordId+"_Rec_12").click(function() {
               words.index=12;
               words.loadWords();});
            $( pageWordId+"_Rec_13").click(function() {
               words.index=13;
               words.loadWords();});
            $( pageWordId+"_Rec_14").click(function() {
               words.index=14;
               words.loadWords();});
            $( pageWordId+"_Rec_15").click(function() {
               words.index=15;
               words.loadWords();});
            //=================
            $( pageWordId+"_Rec_16").click(function() {
               words.index=16;
               words.loadWords();});
            $( pageWordId+"_Rec_17").click(function() {
               words.index=17;
               words.loadWords();});
            $( pageWordId+"_Rec_18").click(function() {
               words.index=18;
               words.loadWords();});
            $( pageWordId+"_Rec_19").click(function() {
               words.index=19;
               words.loadWords();});
            $( pageWordId+"_Rec_20").click(function() {
               words.index=20;
               words.loadWords();});
            $( pageWordId+"_Rec_21").click(function() {
               words.index=21;
               words.loadWords();});
            $( pageWordId+"_Rec_22").click(function() {
               words.index=22;
               words.loadWords();});
            $( pageWordId+"_Rec_23").click(function() {
               words.index=23;
               words.loadWords();});
            $( pageWordId+"_Rec_24").click(function() {
               words.index=24;
               words.loadWords();});
            $( pageWordId+"_Rec_25").click(function() {
               words.index=25;
               words.loadWords();});
            $( pageWordId+"_Rec_26").click(function() {
               words.index=26;
               words.loadWords();});
            $( pageWordId+"_Rec_27").click(function() {
               words.index=27;
               words.loadWords();});
            $( pageWordId+"_Rec_28").click(function() {
               words.index=28;
               words.loadWords();});
            $( pageWordId+"_Rec_29").click(function() {
               words.index=29;
               words.loadWords();});
            $( pageWordId+"_Rec_30").click(function() {
               words.index=30;
               words.loadWords();});
            $( pageWordId+"_Rec_31").click(function() {
               words.index=31;
               words.loadWords();});
            //===================
            $( pageWordId+"_Rec_32").click(function() {
               words.index=32;
               words.loadWords();});
            $( pageWordId+"_Rec_33").click(function() {
               words.index=33;
               words.loadWords();});
            $( pageWordId+"_Rec_34").click(function() {
               words.index=34;
               words.loadWords();});
            $( pageWordId+"_Rec_35").click(function() {
               words.index=35;
               words.loadWords();});
            $( pageWordId+"_Rec_36").click(function() {
               words.index=36;
               words.loadWords();});
            $( pageWordId+"_Rec_37").click(function() {
               words.index=37;
               words.loadWords();});
            $( pageWordId+"_Rec_38").click(function() {
               words.index=38;
               words.loadWords();});
            $( pageWordId+"_Rec_39").click(function() {
               words.index=39;
               words.loadWords();});
            $( pageWordId+"_Rec_40").click(function() {
               words.index=40;
               words.loadWords();});
            $( pageWordId+"_Rec_41").click(function() {
               words.index=41;
               words.loadWords();});
            $( pageWordId+"_Rec_42").click(function() {
               words.index=42;
               words.loadWords();});
            $( pageWordId+"_Rec_43").click(function() {
               words.index=43;
               words.loadWords();});
            $( pageWordId+"_Rec_44").click(function() {
               words.index=44;
               words.loadWords();});
            $( pageWordId+"_Rec_45").click(function() {
               words.index=45;
               words.loadWords();});
	    //==========
	    $( pageWordId+"_Rec_46").click(function() {
               words.index=46;
               words.loadWords();});
	    //==============
            $( pageWordId+"_Rec_47").click(function() {
               words.index=47;
               words.loadWords();});
            $( pageWordId+"_Rec_48").click(function() {
               words.index=48;
               words.loadWords();});
            $( pageWordId+"_Rec_49").click(function() {
               words.index=49;
               words.loadWords();});
            $( pageWordId+"_Rec_50").click(function() {
               words.index=50;
               words.loadWords();});
            $( pageWordId+"_Rec_51").click(function() {
               words.index=51;
               words.loadWords();});
            //========
	    $( pageWordId+"_Rec_52").click(function() {
               words.index=52;
               words.loadWords();});
            $( pageWordId+"_Rec_53").click(function() {
               words.index=53;
               words.loadWords();});
            $( pageWordId+"_Rec_54").click(function() {
               words.index=54;
               words.loadWords();});
            $( pageWordId+"_Rec_55").click(function() {
               words.index=55;
               words.loadWords();});
            $( pageWordId+"_Rec_56").click(function() {
               words.index=56;
               words.loadWords();});
            $( pageWordId+"_Rec_57").click(function() {
               words.index=57;
               words.loadWords();});
            //========
	    $( pageWordId+"_Rec_58").click(function() {
               words.index=58;
               words.loadWords();});
            $( pageWordId+"_Rec_59").click(function() {
               words.index=59;
               words.loadWords();});
            $( pageWordId+"_Rec_60").click(function() {
               words.index=60;
               words.loadWords();});
            $( pageWordId+"_Rec_61").click(function() {
               words.index=61;
               words.loadWords();});
            $( pageWordId+"_Rec_62").click(function() {
               words.index=62;
               words.loadWords();});
            $( pageWordId+"_Rec_63").click(function() {
               words.index=63;
               words.loadWords();});
            //========
	    $( pageWordId+"_Rec_64").click(function() {
               words.index=64;
               words.loadWords();});
            $( pageWordId+"_Rec_65").click(function() {
               words.index=65;
               words.loadWords();});
            $( pageWordId+"_Rec_66").click(function() {
               words.index=66;
               words.loadWords();});
            $( pageWordId+"_Rec_67").click(function() {
               words.index=67;
               words.loadWords();});
            //========//
	    $( pageWordId+"_Rec_68").click(function() {
               words.index=68;
               words.loadWords();});
            $( pageWordId+"_Rec_69").click(function() {
               words.index=69;
               words.loadWords();});
            $( pageWordId+"_Rec_70").click(function() {
               words.index=70;
               words.loadWords();});
            $( pageWordId+"_Rec_71").click(function() {
               words.index=71;
               words.loadWords();});
            $( pageWordId+"_Rec_72").click(function() {
               words.index=72;
               words.loadWords();});
            $( pageWordId+"_Rec_73").click(function() {
               words.index=73;
               words.loadWords();});
	    $( pageWordId+"_Rec_74").click(function() {
               words.index=74;
               words.loadWords();});
            $( pageWordId+"_Rec_75").click(function() {
               words.index=75;
               words.loadWords();});
	    $( pageWordId+"_Rec_76").click(function() {
               words.index=76;
               words.loadWords();});
            $( pageWordId+"_Rec_77").click(function() {
               words.index=77;
               words.loadWords();});
	    //========
	    $( pageWordId+"_Rec_78").click(function() {
               words.index=78;
               words.loadWords();});
            $( pageWordId+"_Rec_79").click(function() {
               words.index=79;
               words.loadWords();});
            $( pageWordId+"_Rec_80").click(function() {
               words.index=80;
               words.loadWords();});
            $( pageWordId+"_Rec_81").click(function() {
               words.index=81;
               words.loadWords();});
            $( pageWordId+"_Rec_82").click(function() {
               words.index=82;
               words.loadWords();});
            $( pageWordId+"_Rec_83").click(function() {
               words.index=83;
               words.loadWords();});
	    $( pageWordId+"_Rec_84").click(function() {
               words.index=84;
               words.loadWords();});
            $( pageWordId+"_Rec_85").click(function() {
               words.index=85;
               words.loadWords();});
	    $( pageWordId+"_Rec_86").click(function() {
               words.index=86;
               words.loadWords();});
            $( pageWordId+"_Rec_87").click(function() {
               words.index=87;
               words.loadWords();});
	    $( pageWordId+"_Rec_88").click(function() {
               words.index=88;
               words.loadWords();});
	    $( pageWordId+"_Rec_89").click(function() {
               words.index=89;
               words.loadWords();});
            $( pageWordId+"_Rec_90").click(function() {
               words.index=90;
               words.loadWords();});

        }
    };
    
////====== scratch ===========
///**
// * Helper function to get the local coords of an event in an element,
// * since offsetX/offsetY are apparently not entirely supported, but
// * offsetLeft/offsetTop/pageX/pageY are!
// *
// * @param elem element in question
// * @param ev the event
// */
//function getLocalCoords(elem, ev) {
//	var ox = 0, oy = 0;
//	var first;
//	var pageX, pageY;
//
//	// Walk back up the tree to calculate the total page offset of the
//	// currentTarget element.  I can't tell you how happy this makes me.
//	// Really.
//	while (elem !== null) {
//		ox += elem.offsetLeft;
//		oy += elem.offsetTop;
//		elem = elem.offsetParent;
//	}
//
//	if (ev.hasOwnProperty('changedTouches')) {
//		first = ev.changedTouches[0];
//		pageX = first.pageX;
//		pageY = first.pageY;
//	} else {
//		pageX = ev.pageX;
//		pageY = ev.pageY;
//	}
//
//	return { 'x': pageX - ox, 'y': pageY - oy };
//}
//
///**
// * Recomposites the canvases onto the screen
// *
// * Note that my preferred method (putting the background down, then the
// * masked foreground) doesn't seem to work in FF with "source-out"
// * compositing mode (it just leaves the destination canvas blank.)  I
// * like this method because mentally it makes sense to have the
// * foreground drawn on top of the background.
// *
// * Instead, to get the same effect, we draw the whole foreground image,
// * and then mask the background (with "source-atop", which FF seems
// * happy with) and stamp that on top.  The final result is the same, but
// * it's a little bit weird since we're stamping the background on the
// * foreground.
// *
// * OPTIMIZATION: This naively redraws the entire canvas, which involves
// * four full-size image blits.  An optimization would be to track the
// * dirty rectangle in scratchLine(), and only redraw that portion (i.e.
// * in each drawImage() call, pass the dirty rectangle as well--check out
// * the drawImage() documentation for details.)  This would scale to
// * arbitrary-sized images, whereas in its current form, it will dog out
// * if the images are large.
// */
//function recompositeCanvases() {
//	var main = document.getElementById('maincanvas');
//	var tempctx = canvas.temp.getContext('2d');
//	var mainctx = main.getContext('2d');
//
//	// Step 1: clear the temp
//	canvas.temp.width = canvas.temp.width; // resizing clears
//
//	// Step 2: stamp the draw on the temp (source-over)
//	tempctx.drawImage(canvas.draw, 0, 0);
//
//	/* !!!! this way doesn't work on FF:
//		// Step 3: stamp the foreground on the temp (!! source-out mode !!)
//		tempctx.globalCompositeOperation = 'source-out';
//		tempctx.drawImage(image.front.img, 0, 0);
//
//		// Step 4: stamp the background on the display canvas (source-over)
//		//mainctx.drawImage(image.back.img, 0, 0);
//
//		// Step 5: stamp the temp on the display canvas (source-over)
//		mainctx.drawImage(canvas.temp, 0, 0);
//	*/
//
//	// Step 3: stamp the background on the temp (!! source-atop mode !!)
//	tempctx.globalCompositeOperation = 'source-atop';
//	tempctx.drawImage(image.back.img, 0, 0);
//
//	// Step 4: stamp the foreground on the display canvas (source-over)
//	mainctx.drawImage(image.front.img, 0, 0);
//
//	// Step 5: stamp the temp on the display canvas (source-over)
//	mainctx.drawImage(canvas.temp, 0, 0);
//}
//
///**
// * Draw a scratch line
// * 
// * @param can the canvas
// * @param x,y the coordinates
// * @param fresh start a new line if true
// */
//function scratchLine(can, x, y, fresh) {
//	var ctx = can.getContext('2d');
//	ctx.lineWidth = 50;
//	ctx.lineCap = ctx.lineJoin = 'round';
//	ctx.strokeStyle = '#f00'; // can be any opaque color
//	if (fresh) {
//		ctx.beginPath();
//		// this +0.01 hackishly causes Linux Chrome to draw a
//		// "zero"-length line (a single point), otherwise it doesn't
//		// draw when the mouse is clicked but not moved:
//		ctx.moveTo(x+0.01, y);
//	}
//	ctx.lineTo(x, y);
//	ctx.stroke();
//}
//
///**
// * Set up the main canvas and listeners
// */
//function setupCanvases() {
//	var c = document.getElementById('maincanvas');
//	// set the width and height of the main canvas from the first image
//	// (assuming both images are the same dimensions)
//	c.width = image.back.img.width;
//	c.height = image.back.img.height;
//
//	// create the temp and draw canvases, and set their dimensions
//	// to the same as the main canvas:
//	canvas.temp = document.createElement('canvas');
//	canvas.draw = document.createElement('canvas');
//	canvas.temp.width = canvas.draw.width = c.width;
//	canvas.temp.height = canvas.draw.height = c.height;
//
//	// draw the stuff to start
//	recompositeCanvases();
//
//	/**
//	 * On mouse down, draw a line starting fresh
//	 */
//	function mousedown_handler(e) {
//		var local = getLocalCoords(c, e);
//		mouseDown = true;
//
//		scratchLine(canvas.draw, local.x, local.y, true);
//		recompositeCanvases();
//
//		if (e.cancelable) { e.preventDefault(); } 
//		return false;
//	}
//
//	/**
//	 * On mouse move, if mouse down, draw a line
//	 *
//	 * We do this on the window to smoothly handle mousing outside
//	 * the canvas
//	 */
//	function mousemove_handler(e) {
//		if (!mouseDown) { return true; }
//
//		var local = getLocalCoords(c, e);
//
//		scratchLine(canvas.draw, local.x, local.y, false);
//		recompositeCanvases();
//
//		if (e.cancelable) { e.preventDefault(); } 
//		return false;
//	}
//
//	/**
//	 * On mouseup.  (Listens on window to catch out-of-canvas events.)
//	 */
//	function mouseup_handler(e) {
//		if (mouseDown) {
//			mouseDown = false;
//			if (e.cancelable) { e.preventDefault(); } 
//			return false;
//		}
//
//		return true;
//	}
//
//	c.addEventListener('mousedown', mousedown_handler, false);
//	c.addEventListener('touchstart', mousedown_handler, false);
//
//	window.addEventListener('mousemove', mousemove_handler, false);
//	window.addEventListener('touchmove', mousemove_handler, false);
//
//	window.addEventListener('mouseup', mouseup_handler, false);
//	window.addEventListener('touchend', mouseup_handler, false);
//}

