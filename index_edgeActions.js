/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve
* function signatures and comments starting with 'Edge' to maintain the
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes
   //Edge symbol: 'stage'
   (function(symbolName) {
    function swipeUpDown(){
            var supportTouch = $.support.touch,
                //scrollEvent = "touchmove scroll",
                touchStartEvent = supportTouch ? "touchstart" : "mousedown",
                touchStopEvent = supportTouch ? "touchend" : "mouseup",
                touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
            $.event.special.swipeupdown = {
                setup: function() {
                    var thisObject = this;
                    var $this = $(thisObject);
                    $this.bind(touchStartEvent, function(event) {
                        var data = event.originalEvent.touches ?
                                event.originalEvent.touches[ 0 ] :
                                event,
                                start = {
                                    time: (new Date).getTime(),
                                    coords: [ data.pageX, data.pageY ],
                                    origin: $(event.target)
                                },
                                stop;
                        function moveHandler(event) {
                            if (!start) {
                                return;
                            }
                            var data = event.originalEvent.touches ?
                                    event.originalEvent.touches[ 0 ] :
                                    event;
                            stop = {
                                time: (new Date).getTime(),
                                coords: [ data.pageX, data.pageY ]
                            };
                            // prevent scrolling
                            if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                                event.preventDefault();
                            }
                        }
                        $this
                                .bind(touchMoveEvent, moveHandler)
                                .one(touchStopEvent, function(event) {
                            $this.unbind(touchMoveEvent, moveHandler);
                            if (start && stop) {
                                if (stop.time - start.time < 1000 &&
                                        Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                        Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                    start.origin
                                            .trigger("swipeupdown")
                                            .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                                }
                            }
                            start = stop = undefined;
                        });
                    });
                }
            };
            $.each({
                swipedown: "swipeupdown",
                swipeup: "swipeupdown"
            }, function(event, sourceEvent){
                $.event.special[event] = {
                    setup: function(){
                        $(this).bind(sourceEvent, $.noop);
                    }
                };
            });
    }
    var dom = document.body;
    var _width;
    var _height;
    var scale;                  //used for scaling or pinching
    var idPicture;
    dom.addEventListener("gesturestart", gestureStart, false);
    dom.addEventListener("gesturechange", gestureChange, false);
    dom.addEventListener("gestureend", gestureEnd, false);
    function gestureStart() {
        idPicture = "#thumbnailStage"+pageArr[pageIndex].pageName;
        _width = parseInt($(idPicture).css('width'));
        _height = parseInt($(idPicture).css('height'));
    }
    
		function gestureChange(e) {
       e.preventDefault();
       scale = e.scale;
       var tempWidth = _width * scale;        //scale image
       var tempHeight = _height * scale;      //rotate and drag wordsCore/switchPage
       //var startWidth = selfiePageArray[selfieIndex].startWidth;
       //var startHeight = selfiePageArray[selfieIndex].startHeight;
       //===================================================================
       if (tempWidth > 800){
            tempWidth = selfiePageArray[selfieIndex].width;
            tempHeight = selfiePageArray[selfieIndex].height;
       }else if (tempWidth < 60){
						tempWidth = selfiePageArray[selfieIndex].width;
            tempHeight = selfiePageArray[selfieIndex].height;
			 }
       //===================================================================
        $(idPicture).css("width", tempWidth);
        $(idPicture).css("height", tempHeight);
    }
		
		
    function gestureEnd(e) {
        e.preventDefault();
        _width = parseInt($(idPicture).css('width'));
				//alert(_width);
        _height = parseInt($(idPicture).css('height'));
        selfiePageArray[selfieIndex].width = _width;
        selfiePageArray[selfieIndex].height = _height;
        localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
    }
      //============================
    Symbol.bindElementAction(compId, symbolName, "document", "compositionReady", function(sym, e) {
    console.log("Entering compositionReady");
		swipeUpDown();
		var navNum = "";
		var count = "";
		var i;
		out = [];
		$.getJSON("data/pages.json", function(data) {
				for(i=0; i<data.length; i++){
						//if (pageArr[x].defaultTalkie === true){
						if (data[i].pageType == "selfie" || data[i].pageType == "picOnlySelfie") {
								if (data[i].defaultTalkie === true){
										pageArr.push({
												"pageName":data[i].pageName, "navPage":data[i].navPage, "pageType":data[i].pageType, "pageId":"", "navId":"","pageWordId":"",
												"pageDown1Name":data[i].pageDown1Name,"defaultTalkie":data[i].defaultTalkie,"talkieAngle":data[i].talkieAngle,"talkieHeight":data[i].talkieHeight,
												"talkieLeft":data[i].talkieLeft,"talkieTop":data[i].talkieTop,"talkieWidth":data[i].talkieWidth, "imageWidth":data[i].imageWidth, "imageHeight":data[i].imageHeight
										});
								}else{
										pageArr.push({
												"pageName":data[i].pageName, "navPage":data[i].navPage, "pageType":data[i].pageType, "pageId":"", "navId":"","pageWordId":"",
												"pageDown1Name":data[i].pageDown1Name,"defaultTalkie":data[i].defaultTalkie
										});										
								}
						}else{
								pageArr.push({
										"pageName":data[i].pageName, "navPage":data[i].navPage, "pageType":data[i].pageType, "pageId":"", "navId":"","pageWordId":"",
										"pageDown1Name":data[i].pageDown1Name
								});			
						}
						
						if (pageArr[i].navPage === true) {
								navNum = "nav" + (i+1);
												count = i;
								out.push('<div onclick="navBarSelect(this)" class="swiper-slide" id="'+navNum+'" index="'+count+'"></div>');
						}
				}
				//out.push('<div class="swiper-slide" id="placeHolder"></div>');
		  if (localStorage.getItem("preferences") !== null) {
        preferencesArray = JSON.parse(localStorage["preferences"]);
        console.log("Entering preferencesArray assignment");
			}else{
					localStorage["preferences"] = JSON.stringify(preferencesArray);
			}
			
			if (localStorage.getItem("selfieDetail") !== null) {
					selfiePageArray = JSON.parse(localStorage["selfieDetail"]);
			}else{
					for (var x = 0; x < pageArr.length; x++) {
							if (pageArr[x].pageType == "selfie" || pageArr[x].pageType == "picOnlySelfie") {
										if (pageArr[x].defaultTalkie === true){						
												selfiePageArray.push({ pageName: pageArr[x].pageName, fileExtension: "none", top: 0, left: 0, width :104, startWidth :104, startHeight:268, dimensionsObtained: false, height:268, angle:0, thumbWidth:0, thumbHeight:0,
																		   moved:false, narrationExists:false, selfNarration:false, showPicture:true, pictureExists: false, fromGallery: false, galleryImage: "gallery/one/madBull.png", pictureNarrationExists:false,
																			 defaultTalkie: pageArr[x].defaultTalkie, talkieAngle: pageArr[x].talkieAngle, talkieHeight: pageArr[x].talkieHeight, talkieLeft: pageArr[x].talkieLeft, imageWidth :pageArr[x].imageWidth, imageHeight :pageArr[x].imageHeight,
																			 talkieTop: pageArr[x].talkieTop, talkieWidth: pageArr[x].talkieWidth, refreshTalkieImage: false, refreshTalkieAudio: false, 														 
																			 });
										}else{
												selfiePageArray.push({ pageName: pageArr[x].pageName, fileExtension: "none", top: 0, left: 0, width :104, startWidth :104, startHeight:268, dimensionsObtained: false, height:268, angle:0, thumbWidth:0, thumbHeight:0,
																		   moved:false, narrationExists:false, selfNarration:false, showPicture:true, pictureExists: false, fromGallery: false, galleryImage: "gallery/one/madBull.png", pictureNarrationExists:false,
																			 defaultTalkie: pageArr[x].defaultTalkie											 
																			 });
										}
							}                        
				}
					localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
			}
			
			
			//$.getJSON("data/talkies.json", function(data) {
			//		for(var z=0; z<data.length; z++){
			//					for (var a=0;a<selfiePageArray.length;a++){
			//							if (data[z].pageName === selfiePageArray[a].pageName){
			//									selfiePageArray[a].angle = data[z].angle;
			//									selfiePageArray[a].dimensionsObtained = data[z].dimensionsObtained;
			//									selfiePageArray[a].fileExtension = data[z].fileExtension;
			//									selfiePageArray[a].fromGallery = data[z].fromGallery;
			//									selfiePageArray[a].height = data[z].height;
			//									selfiePageArray[a].left = data[z].left;
			//									break;
			//							}
			//					}
			//		}
			//});
			
			pageIndex = 0;
			getPage(0);
			pageLoadedArray.push(pageArr[0].pageName);
			getPage(1);
			$(pageArr[1].pageId).hide();
			pageLoadedArray.push(pageArr[1].pageName);
			getPage(pageArr.length - 1);
			$(pageArr[pageArr.length - 1].pageId).hide();
			pageLoadedArray.push(pageArr[pageArr.length - 1].pageName);
			$(".initialPreviews").hide();
		//	$("#Stage_toolBar").hide();
		//  $("#Stage_toolBar").css("z-index", "-1");
			loadToolbar();
			manipulateImage();
			compReadyPreferences();
		
			//$('<canvas id="maincanvas"></canvas>').appendTo("#Stage_recScratch");
	    $("#Stage_recNav").css({ opacity: 0 }); //hide will not let menu be built
	    $('<div class="swiper-container" id="swipe">'+
                '<div class="swiper-wrapper" id="swipeWrap">'+
		    out+
                '</div>'+
            '</div>').appendTo("#Stage");
	    $( '#swipe' ).appendTo("#Stage_recNav");
            createNav();
//        $('div.swiper-slide').on('click', function(){
//                closePreferences();
//                killPageWords();
//                if (recordingOpen() === false){
//										var previousPageIndex = pageIndex;
//										pageIndex = parseInt($(this).attr("index"));										
//										//======
//										if (createSurroundingPages() === true){
//												setTimeout(function(){
//														$(pageArr[previousPageIndex].pageId).hide();
//														$(pageArr[pageIndex].pageId).show();
//														switchPage(previousPageIndex);		
//												}, 125);
//										}else{					
//												$(pageArr[previousPageIndex].pageId).hide();
//												$(pageArr[pageIndex].pageId).show();
//												switchPage(previousPageIndex);
//										}			
//                }
//                hideNavButtons();
//        });
        
        //jQuery('input').keypress(function(e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if ( (code==13) || (code==10))
        //   //if (e.keyCode == 13)
        //        {
        //            urlBtnSearch($("#webSearch").val());
        //            $("#webSearch").blur();   
        //            return false;
        //        }
        //});
	    sym.$("<link rel='stylesheet' type='text/css' href='css/swiper.css'>").appendTo("#Stage").css({'position': 'absolute','top':'0px', 'left':'0px', 'width':'100%', 'height':'100%'});	            
        var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		slidesPerView: 10,
		paginationClickable: true,
		spaceBetween: 2,
		freeMode: true,
		loop: true
	    });
		//var pageId = pageArr[pageIndex].pageId;
		
		//$(pageId+"_groupArrowButtonInstructions").hide();
		//$(pageId+"_groupOtherBtns").hide();
		//$(pageId+"_startupIntro").css("z-index", "-1");
		//$(pageId+"_menuSwipe").css("z-index", "-1");
		//if (localStorage.getItem("getPicture") === null) {
		//		localStorage.setItem("getPicture", "done");
		//		getPicture();
		//}
		
	
	
	    
        
				
				
				});
		
				


				
		
        console.log("Leaving compositionReady");
      });
      //Edge binding end
      
      

      Symbol.bindElementAction(compId, symbolName, "${RoundRect}", "click", function(sym, e) {
         loadToolbar();

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'
   //=========================================================
   //Edge symbol: 'page01Words'
   (function(symbolName) {
   })("page24Words");
   //Edge symbol end:'page24Words'
   //=========================================================
   //Edge symbol: 'page23Words'
   (function(symbolName) {
   })("page23Words");
   //Edge symbol end:'page23Words'
   //=========================================================
   //Edge symbol: 'page21'
   (function(symbolName) {
   })("page21Words");
   //Edge symbol end:'page21Words'
   //=========================================================
   //Edge symbol: 'page20Words'
   (function(symbolName) {
   })("page20Words");
   //Edge symbol end:'page20Words'
   //=========================================================
   //Edge symbol: 'page19'
   (function(symbolName) {
   })("page19Words");
   //Edge symbol end:'page19Words'
   //=========================================================
   //Edge symbol: 'page17Words'
   (function(symbolName) {
   })("page17Words");
   //Edge symbol end:'page17Words'
   //=========================================================
   //Edge symbol: 'page18Words'
   (function(symbolName) {
   })("page18Words");
   //Edge symbol end:'page18Words'
   //=========================================================
   //Edge symbol: 'page16Words'
   (function(symbolName) {
   })("page16Words");
   //Edge symbol end:'page16Words'
   //=========================================================
   //Edge symbol: 'page15Words'
   (function(symbolName) {
   })("page15Words");
   //Edge symbol end:'page15Words'
   //=========================================================
   //Edge symbol: 'page14'
   (function(symbolName) {
   })("page14Words");
   //Edge symbol end:'page14Words'
   //=========================================================
   //Edge symbol: 'page13Words'
   (function(symbolName) {
   })("page13Words");
   //Edge symbol end:'page13Words'
   //=========================================================
   //Edge symbol: 'page12Words'
   (function(symbolName) {
   })("page12Words");
   //Edge symbol end:'page12Words'
   //=========================================================
   //Edge symbol: 'btnVideo'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${video_icon}", "click", function(sym, e) {
         btnPagePlay();
      });
      //Edge binding end
   })("btnVideo");
   //Edge symbol end:'btnVideo'
   //=========================================================
   //Edge symbol: 'pageTOC'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recChapter1}", "click", function(sym, e) {
         TOC_FindPage("pageChapter1");
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recChapter2}", "click", function(sym, e) {
         TOC_FindPage("pageChapter2");
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recChapter3}", "click", function(sym, e) {
         TOC_FindPage("pageChapter3");
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recChapter4}", "click", function(sym, e) {
         TOC_FindPage("pageChapter4");
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recChapter5}", "click", function(sym, e) {
         TOC_FindPage("pageChapter5");
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recDiscussion}", "click", function(sym, e) {
         TOC_FindPage("pageBonus");

      });
      //Edge binding end
      
      

      Symbol.bindElementAction(compId, symbolName, "${recVisitRate}", "click", function(sym, e) {
         TOC_FindPage("pageRating");

      });
      //Edge binding end

   })("pageTOC");
   //Edge symbol end:'pageTOC'
   //=========================================================
   //Edge symbol: 'thumb_pageTOC_1'
   (function(symbolName) {
            })("page24Thumb");
   //Edge symbol end:'page24Thumb'
   //=========================================================
   //Edge symbol: 'pageCover'
   (function(symbolName) {
      
      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      

      Symbol.bindElementAction(compId, symbolName, "${recCreditsOverlay}", "click", function(sym, e) {
         creditsBtn('rgba(115,156,114,1.00)','rgba(79,139,201,1.00)');
         //var count = pageLoadedArray.indexOf("pageTitle");
         //if (count == -1){						
         //		setTimeout(function(){
         //				pageLoadedArray.push({"pageTitle": 0});
         //				titlePageId = "#"+words.Sym.createChildSymbol("pageTitle", "Stage").getSymbolElement().attr("id");
         //				$(titlePageId).attr("desc","pageTitle");
         //		}, 125);								
         //} 				
         //$(pageArr[pageIndex].pageId).hide();
         //$(titlePageId).show();
         
         
         
         
         

      });
      //Edge binding end

      

      

      

   })("pageCover");
   //Edge symbol end:'pageCover'
   //=========================================================
   //Edge symbol: 'preferences'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${RecSelectFaster}", "click", function(sym, e) {
         preferences.highlightBtn('fasterImg');
         localStorage.setItem("speed", "fast");
         var sndThe = new Audio('media/click.mp3');
                  sndThe.load();
                  sndThe.play();
                  sndThe = null;
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${RecSelectSlower}", "click", function(sym, e) {
         preferences.highlightBtn('slowerImg', sym);
         var sndThe = new Audio('media/click.mp3');
                  sndThe.load();
                  sndThe.play();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${RecSelectHighlightOn}", "click", function(sym, e) {
         preferences.highlightBtn('highligtOn');
         var sndThe = new Audio('media/click.mp3');
                  sndThe.load();
                  sndThe.play();
                  sndThe = null;
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${RecSelectHighlightOff}", "click", function(sym, e) {
         preferences.highlightBtn('highlightOff');
         var sndThe = new Audio('media/click.mp3');
                  sndThe.load();
                  sndThe.play();
                  sndThe = null;
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 200, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 423, function(sym, e) {
         sym.stop();
         $("#Stage_preferences").css("z-index", "-1");
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 641, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 860, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1077, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1290, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1448, function(sym, e) {
         sym.stop();
         $("#Stage_preferences").hide();
         $("#Stage_preferences").css("z-index", "-1");
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1666, function(sym, e) {
         sym.stop();
         $("#Stage_preferences").hide();
         $("#Stage_preferences").css("z-index", "-1");
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1951, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2177, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupBtnMenuPicture}", "click", function(sym, e) {
         selectPictureMenu();

      });
      //Edge binding end

   })("preferences");
   //Edge symbol end:'preferences'
   //=========================================================
   //Edge symbol: 'thumb_pageCover'
   (function(symbolName) {
   })("pageCoverThumb");
   //Edge symbol end:'pageCoverThumb'
   //=========================================================
   //Edge symbol: 'thumb_pageTOC'
   (function(symbolName) {
   })("pageTOCThumb");
   //Edge symbol end:'pageTOCThumb'
   //=========================================================
   //Edge symbol: 'sd1Title'
   (function(symbolName) {
      

      Symbol.bindElementAction(compId, symbolName, "${groupButtonsTitleOk}", "click", function(sym, e) {
         groupButtonTitleOk();

      });
      //Edge binding end

   })("pageTitle");
   //Edge symbol end:'pageTitle'
   //=========================================================
   //Edge symbol: 'page24_1'
   (function(symbolName) {
      })("page23");
   //Edge symbol end:'page23'
   //=========================================================
   //Edge symbol: 'thumb_page24_1'
   (function(symbolName) {
               })("page23Thumb");
   //Edge symbol end:'page23Thumb'
   //=========================================================
   //Edge symbol: 'page23_1'
   (function(symbolName) {
         })("page17");
   //Edge symbol end:'page17'
   //=========================================================
   //Edge symbol: 'thumb_page23_1'
   (function(symbolName) {
                  })("page17Thumb");
   //Edge symbol end:'page17Thumb'
   //=========================================================
   //Edge symbol: 'page24Thumb_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${song}", "click", function(sym, e) {
         //highlightNavChoice();
      });
      //Edge binding end
               })("pageSongThumb");
   //Edge symbol end:'pageSongThumb'
   //=========================================================
   //Edge symbol: 'page24_1'
   (function(symbolName) {
      })("page22");
   //Edge symbol end:'page22'
   //=========================================================
   //Edge symbol: 'page24Thumb_1'
   (function(symbolName) {
               })("page22Thumb");
   //Edge symbol end:'page22Thumb'
   //=========================================================
   //Edge symbol: 'page22Words'
   (function(symbolName) {
   })("page22Words");
   //Edge symbol end:'page22Words'
   //=========================================================
   //Edge symbol: 'page24_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         tocBtn('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

      

      

      })("pageChapter1");
   //Edge symbol end:'pageChapter1'
   //=========================================================
   //Edge symbol: 'page21Words_1'
   (function(symbolName) {
      })("page01Words");
   //Edge symbol end:'page01Words'
   //=========================================================
   //Edge symbol: 'page17Thumb_1'
   (function(symbolName) {
                     })("page01Thumb");
   //Edge symbol end:'page01Thumb'
   //=========================================================
   //Edge symbol: 'page01_1'
   (function(symbolName) {
         })("page02");
   //Edge symbol end:'page02'
   //=========================================================
   //Edge symbol: 'page01Thumb_1'
   (function(symbolName) {
                        })("page02Thumb");
   //Edge symbol end:'page02Thumb'
   //=========================================================
   //Edge symbol: 'page01Words_1'
   (function(symbolName) {
         })("page02Words");
   //Edge symbol end:'page02Words'
   //=========================================================
   //Edge symbol: 'page02_1'
   (function(symbolName) {
         })("page03");
   //Edge symbol end:'page03'
   //=========================================================
   //Edge symbol: 'page02Thumb_1'
   (function(symbolName) {
                        })("page03Thumb");
   //Edge symbol end:'page03Thumb'
   //=========================================================
   //Edge symbol: 'page02Words_1'
   (function(symbolName) {
         })("page03Words");
   //Edge symbol end:'page03Words'
   //=========================================================
   //Edge symbol: 'page03_1'
   (function(symbolName) {
         })("page04");
   //Edge symbol end:'page04'
   //=========================================================
   //Edge symbol: 'page03Words_1'
   (function(symbolName) {
         })("page04Words");
   //Edge symbol end:'page04Words'
   //=========================================================
   //Edge symbol: 'page03Thumb_1'
   (function(symbolName) {
                        })("page04Thumb");
   //Edge symbol end:'page04Thumb'
   //=========================================================
   //Edge symbol: 'page04_1'
   (function(symbolName) {
         })("page05");
   //Edge symbol end:'page05'
   //=========================================================
   //Edge symbol: 'page04Words_1'
   (function(symbolName) {
         })("page05Words");
   //Edge symbol end:'page05Words'
   //=========================================================
   //Edge symbol: 'page04Thumb_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${thumbImg}", "click", function(sym, e) {
         highlightNavChoice();
      });
                  //Edge binding end
                        })("page05Thumb");
   //Edge symbol end:'page05Thumb'
   //=========================================================
   //Edge symbol: 'page05_1'
   (function(symbolName) {
            })("page06");
   //Edge symbol end:'page06'
   //=========================================================
   //Edge symbol: 'page05Thumb_1'
   (function(symbolName) {
                           })("page06Thumb");
   //Edge symbol end:'page06Thumb'
   //=========================================================
   //Edge symbol: 'page05Words_1'
   (function(symbolName) {
            })("page06Words");
   //Edge symbol end:'page06Words'
   //=========================================================
   //Edge symbol: 'page06_1'
   (function(symbolName) {
            })("page07");
   //Edge symbol end:'page07'
   //=========================================================
   //Edge symbol: 'page06Thumb_1'
   (function(symbolName) {
                           })("page07Thumb");
   //Edge symbol end:'page07Thumb'
   //=========================================================
   //Edge symbol: 'page06Words_1'
   (function(symbolName) {
            })("page07Words");
   //Edge symbol end:'page07Words'
   //=========================================================
   //Edge symbol: 'pageChapter1Thumb'
   (function(symbolName) {
   })("pageChapter1Thumb");
   //Edge symbol end:'pageChapter1Thumb'
   //=========================================================
   //Edge symbol: 'pageChapter1_1'
   (function(symbolName) {
      

      Symbol.bindElementAction(compId, symbolName, "${recShowAnswersOverlay}", "click", function(sym, e) {
         showAnswers('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${toolBarGear}", "click", function(sym, e) {
         btnPreferences();

      });
      //Edge binding end

         })("pageChapter1After");
   //Edge symbol end:'pageChapter1After'
   //=========================================================
   //Edge symbol: 'page24Thumb_1'
   (function(symbolName) {
               })("pageChapter1AfterThumb");
   //Edge symbol end:'pageChapter1AfterThumb'
   //=========================================================
   //Edge symbol: 'pageChapter1_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         tocBtn('rgba(103,72,99,1.00)','rgba(201,121,98,1.00)');

      });
      //Edge binding end

         })("pageChapter2");
   //Edge symbol end:'pageChapter2'
   //=========================================================
   //Edge symbol: 'pageChapter1Thumb_1'
   (function(symbolName) {
      })("pageChapter2Thumb");
   //Edge symbol end:'pageChapter2Thumb'
   //=========================================================
   //Edge symbol: 'page07_1'
   (function(symbolName) {
               })("page08");
   //Edge symbol end:'page08'
   //=========================================================
   //Edge symbol: 'page07Thumb_1'
   (function(symbolName) {
                              })("page08Thumb");
   //Edge symbol end:'page08Thumb'
   //=========================================================
   //Edge symbol: 'page07Words_1'
   (function(symbolName) {
               })("page08Words");
   //Edge symbol end:'page08Words'
   //=========================================================
   //Edge symbol: 'page08_1'
   (function(symbolName) {
               })("page09");
   //Edge symbol end:'page09'
   //=========================================================
   //Edge symbol: 'page08Thumb_1'
   (function(symbolName) {
                              })("page09Thumb");
   //Edge symbol end:'page09Thumb'
   //=========================================================
   //Edge symbol: 'page08Words_1'
   (function(symbolName) {
               })("page09Words");
   //Edge symbol end:'page09Words'
   //=========================================================
   //Edge symbol: 'page09_1'
   (function(symbolName) {
                  })("page10");
   //Edge symbol end:'page10'
   //=========================================================
   //Edge symbol: 'page09Thumb_1'
   (function(symbolName) {
                                 })("page10Thumb");
   //Edge symbol end:'page10Thumb'
   //=========================================================
   //Edge symbol: 'page09Words_1'
   (function(symbolName) {
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1418, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${Rec_46Replace}", "click", function(sym, e) {
         sym.play('mrs');
         words.loadSounds('mrs');
      });
      //Edge binding end
                  })("page10Words");
   //Edge symbol end:'page10Words'
   //=========================================================
   //Edge symbol: 'page10_1'
   (function(symbolName) {
                     })("page11");
   //Edge symbol end:'page11'
   //=========================================================
   //Edge symbol: 'page10Thumb_1'
   (function(symbolName) {
                                    })("page11Thumb");
   //Edge symbol end:'page11Thumb'
   //=========================================================
   //Edge symbol: 'page10Words_1'
   (function(symbolName) {
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1418, function(sym, e) {
         sym.stop();
      });
         //Edge binding end
                     })("page11Words");
   //Edge symbol end:'page11Words'
   //=========================================================
   //Edge symbol: 'page11_1'
   (function(symbolName) {
                     })("page12");
   //Edge symbol end:'page12'
   //=========================================================
   //Edge symbol: 'page11Thumb_2'
   (function(symbolName) {
                                    })("page12Thumb");
   //Edge symbol end:'page12Thumb'
   //=========================================================
   //Edge symbol: 'page12_1'
   (function(symbolName) {
                     })("page13");
   //Edge symbol end:'page13'
   //=========================================================
   //Edge symbol: 'page12Thumb_1'
   (function(symbolName) {
                                    })("page13Thumb");
   //Edge symbol end:'page13Thumb'
   //=========================================================
   //Edge symbol: 'page13_1'
   (function(symbolName) {
                        })("page14");
   //Edge symbol end:'page14'
   //=========================================================
   //Edge symbol: 'page13Thumb_1'
   (function(symbolName) {
                                       })("page14Thumb");
   //Edge symbol end:'page14Thumb'
   //=========================================================
   //Edge symbol: 'page14Thumb_1'
   (function(symbolName) {
                                       })("page15Thumb");
   //Edge symbol end:'page15Thumb'
   //=========================================================
   //Edge symbol: 'slam'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recBtnDoneSlamOverlay}", "click", function(sym, e) {
         slamDone();

      });
      //Edge binding end

   })("slam");
   //Edge symbol end:'slam'
   //=========================================================
   //Edge symbol: 'slamContent'
   (function(symbolName) {
   })("slamContent");
   //Edge symbol end:'slamContent'
   //=========================================================
   //Edge symbol: 'page14_1'
   (function(symbolName) {
                        })("page15");
   //Edge symbol end:'page15'
   //=========================================================
   //Edge symbol: 'page15_1'
   (function(symbolName) {
                           })("page16");
   //Edge symbol end:'page16'
   //=========================================================
   //Edge symbol: 'page15Thumb_1'
   (function(symbolName) {
                                          })("page16Thumb");
   //Edge symbol end:'page16Thumb'
   //=========================================================
   //Edge symbol: 'page17_1'
   (function(symbolName) {
            })("page18");
   //Edge symbol end:'page18'
   //=========================================================
   //Edge symbol: 'page17Thumb_1'
   (function(symbolName) {
                     })("page18Thumb");
   //Edge symbol end:'page18Thumb'
   //=========================================================
   //Edge symbol: 'page18_1'
   (function(symbolName) {
               })("page19");
   //Edge symbol end:'page19'
   //=========================================================
   //Edge symbol: 'page18Thumb_1'
   (function(symbolName) {
                        })("page19Thumb");
   //Edge symbol end:'page19Thumb'
   //=========================================================
   //Edge symbol: 'page19_1'
   (function(symbolName) {
                  })("page20");
   //Edge symbol end:'page20'
   //=========================================================
   //Edge symbol: 'page19Thumb_1'
   (function(symbolName) {
                           })("page20Thumb");
   //Edge symbol end:'page20Thumb'
   //=========================================================
   //Edge symbol: 'Preloader'
   (function(symbolName) {
   })("Preloader");
   //Edge symbol end:'Preloader'
   //=========================================================
   //Edge symbol: 'page20_1'
   (function(symbolName) {
                     })("page21");
   //Edge symbol end:'page21'
   //=========================================================
   //Edge symbol: 'page20Thumb_1'
   (function(symbolName) {
                              })("page21Thumb");
   //Edge symbol end:'page21Thumb'
   //=========================================================
   //Edge symbol: 'pageChapter1After_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recShowAnswersOverlay}", "click", function(sym, e) {
         showAnswers('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

            })("pageChapter2After");
   //Edge symbol end:'pageChapter2After'
   //=========================================================
   //Edge symbol: 'pageChapter1AfterThumb_1'
   (function(symbolName) {
                  })("pageChapter2AfterThumb");
   //Edge symbol end:'pageChapter2AfterThumb'
   //=========================================================
   //Edge symbol: 'pageChapter2_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         tocBtn('rgba(103,72,99,1.00)','rgba(201,121,98,1.00)');

      });
      //Edge binding end

            })("pageChapter3");
   //Edge symbol end:'pageChapter3'
   //=========================================================
   //Edge symbol: 'pageChapter2Thumb_1'
   (function(symbolName) {
         })("pageChapter3Thumb");
   //Edge symbol end:'pageChapter3Thumb'
   //=========================================================
   //=========================================================
   //Edge symbol: 'dialogSpeed'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${btnToPreferencesSpeed}", "click", function(sym, e) {
         btnToPreferencesSpeed();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${btnToPreferencesSpeedSong}", "click", function(sym, e) {
         btnToPreferencesSpeedSong();
      });
      //Edge binding end
   })("dialogSpeed");
   //Edge symbol end:'dialogSpeed'
   //==========================================================
   //Edge symbol: 'recordAudio'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recNarrateComputerOverlay}", "click", function(sym, e) {
         selfiePageArray[selfieIndex].selfNarration = false;
         localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
         selfNarrate();
         wordsHighlighted();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recNarrateYouOverlay}", "click", function(sym, e) {
         selfiePageArray[selfieIndex].selfNarration = true;
         localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
         selfNarrate();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recHighlightOffOverlay}", "click", function(sym, e) {
         preferencesArray[0].highlightWords = false;
         wordsHighlighted();
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_imgWords").show();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recHighlightOnOverlay}", "click", function(sym, e) {
        preferencesArray[0].highlightWords = true;
        wordsHighlighted();
        var pageId = pageArr[pageIndex].pageId;
        var pageName = pageArr[pageIndex].pageName;
        if ($(pageId+"_"+pageName).get(0).paused){
                $(pageId+"_imgWords").show();
        }else{
                $(pageId+"_imgWords").hide();
        }
        localStorage["preferences"] = JSON.stringify(preferencesArray);
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 286, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 567, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 14, function(sym, e) {
         // insert code here
         sym.stop();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recPingOffOverlay}", "click", function(sym, e) {
         preferencesArray[0].narrationPing = false;
         narrationPing();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recPingOnOverlay}", "click", function(sym, e) {
         preferencesArray[0].narrationPing = true;
         narrationPing();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${btnSpeedToCorner}", "click", function(sym, e) {
         btnSpeedToCorner();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recDeleteRecordingNoOverlay}", "click", function(sym, e) {
         deleteRecordingNo();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recDeleteRecordingYesOverlay}", "click", function(sym, e) {
         //deleteRecordingYes()
         doConfirmDeleteRecording();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 937, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1250, function(sym, e) {
         sym.stop();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${btnRecordToCorner}", "click", function(sym, e) {
         fromPictureRecord = false;
         window.requestFileSystem(LocalFileSystem.PERSISTENT, (10 * 1024 * 1024), getFileSystemSuccessRecording, onFileError);
         btnRecordToCorner();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupAudioDone}", "click", function(sym, e) {
         groupPreferencesAudioDone();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recAutoNarrateOffOverlay}", "click", function(sym, e) {
         preferencesArray[0].autoNarrate = false;
         autoNarrate();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         
         
         
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recAutoNarrateOnOverlay}", "click", function(sym, e) {
         preferencesArray[0].autoNarrate = true;
         autoNarrate();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         

      });
      //Edge binding end

   })("preferencesRecord");
   //Edge symbol end:'preferencesRecord'
   //=========================================================
   //Edge symbol: 'preferences'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recShowPictureNoOverlay}", "click", function(sym, e) {
         //preferencesArray[0].showPicture = false;
         selfiePageArray[selfieIndex].showPicture = false;
         showPictureOnPage();  //preferences - recShowPictureNoOverlay
         localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recShowPictureYesOverlay}", "click", function(sym, e) {
         //preferencesArray[0].showPicture = true;
         selfiePageArray[selfieIndex].showPicture = true;
         showPictureOnPage(); //preferences - recShowPictureNoOverlay
         localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recDeletePictureNoOverlay}", "click", function(sym, e) {
         deletePictureNo();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recDeletePictureYesOverlay}", "click", function(sym, e) {
         doConfirmDelete();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupRecordDone}", "click", function(sym, e) {         
         groupPreferencesPictureDone("none");
         //$(".checkRecordDoneYellow").hide();
                 //$(onImageGreen).show();
                 //$(txtToColor).css("color", "rgb(255,255,255)");  //white
                 //$(recToColor).css("background", "rgb(97,138,96)");  //green

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recThumbnailPicture}", "click", function(sym, e) {
         if (selfiePageArray[selfieIndex].pictureExists === true){
         	selfiePageArray[selfieIndex].showPicture = true;
         	fromPictureRecord = true;
         	btnRecordToCorner();
         }else{
           alert('no pic');
         }
      });
      //Edge binding end
      

      

      

      

   })("preferencesPicture");
   //Edge symbol end:'preferencesPicture'
   //=========================================================
   //Edge symbol: 'recordPlay'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${groupRecordDone}", "click", function(sym, e) {
         groupRecordDone();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupBtnRecordStop}", "click", function(sym, e) {
         groupBtnRecordStop();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupVerOk}", "click", function(sym, e) {
         groupVerOk();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupVerCancel}", "click", function(sym, e) {
         groupVerCancel();
      });
      //Edge binding end
   })("recordingPlaying");
   //Edge symbol end:'recordingPlaying'
   //=========================================================
   //Edge symbol: 'arrowTimer'
   (function(symbolName) {
   })("arrowTimer");
   //Edge symbol end:'arrowTimer'
   //=========================================================
   //=========================================================
   //Edge symbol: 'slider'
   (function(symbolName) {
   })("slider");
   //Edge symbol end:'slider'
   //=========================================================
   //Edge symbol: 'page24_1'
   (function(symbolName) {
      
      

      

      

      

      

      

      

      

      })("page01");
   //Edge symbol end:'page01'
   //=========================================================
   //Edge symbol: 'preferencesButtons'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recShowWordsNoOverlay}", "click", function(sym, e) {
         preferencesArray[0].showWordsBtn = false;
         showWordsBtnOnPage();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         loadToolbar();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recShowWordsYesOverlay}", "click", function(sym, e) {
         preferencesArray[0].showWordsBtn = true;
         showWordsBtnOnPage();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         loadToolbar();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recShowSpanishNoOverlay}", "click", function(sym, e) {
         preferencesArray[0].showEspanolBtn = false;
         showEspanolBtnOnPage();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         loadToolbar();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recShowSpanishYesOverlay}", "click", function(sym, e) {
         preferencesArray[0].showEspanolBtn = true;
         showEspanolBtnOnPage();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         loadToolbar();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${groupButtonsDone}", "click", function(sym, e) {
         groupPreferencesButtonsDone();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${recShowSlamNoOverlay}", "click", function(sym, e) {
         preferencesArray[0].showSlamBtn = false;
         showSlamBtnOnPage();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         loadToolbar();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recShowSlamYesOverlay}", "click", function(sym, e) {
         preferencesArray[0].showSlamBtn = true;
         showSlamBtnOnPage();
         localStorage["preferences"] = JSON.stringify(preferencesArray);
         loadToolbar();

      });
      //Edge binding end

   })("preferencesButtons");
   //Edge symbol end:'preferencesButtons'
   //=========================================================
   //Edge symbol: 'pageChapter3_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         tocBtn('rgba(103,72,99,1.00)','rgba(201,121,98,1.00)');

      });
      //Edge binding end

               })("pageChapter4");
   //Edge symbol end:'pageChapter4'
   //=========================================================
   //Edge symbol: 'pageChapter3Thumb_1'
   (function(symbolName) {
            })("pageChapter4Thumb");
   //Edge symbol end:'pageChapter4Thumb'
   //=========================================================
   //Edge symbol: 'pageChapter1_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         tocBtn('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

         })("pageChapter5");
   //Edge symbol end:'pageChapter5'
   //=========================================================
   //Edge symbol: 'pageChapter1Thumb_1'
   (function(symbolName) {
      })("pageChapter5Thumb");
   //Edge symbol end:'pageChapter5Thumb'
   //=========================================================
   //Edge symbol: 'pageSong_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${pageDiscussion}", "click", function(sym, e) {
         var pageName = pageArr[pageIndex].pageName;
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon").show();
         $(pageId+"_"+pageName)[0].pause();
         $(pageId+"_scrubber").hide();
         $(pageId+"_mobileHit").hide();
         $(pageId+"_bar").hide();
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${video_icon}", "click", function(sym, e) {
         playSongPageWithScrubber(244);
      });
      //Edge binding end
         })("pageDiscussion");
   //Edge symbol end:'pageDiscussion'
   //=========================================================
   //Edge symbol: 'pageSongThumb_1'
   (function(symbolName) {
                  })("pageSingALongThumb");
   //Edge symbol end:'pageSingALongThumb'
   //=========================================================
   //Edge symbol: 'pageSongThumb_1'
   (function(symbolName) {
                  })("pageDiscussionThumb");
   //Edge symbol end:'pageDiscussionThumb'
   //=========================================================
   //Edge symbol: 'page24Thumb_1'
   (function(symbolName) {
               })("page25Thumb");
   //Edge symbol end:'page25Thumb'
   //=========================================================
   //Edge symbol: 'pageCover_1'
   (function(symbolName) {
      })("pageThatsAllFolks");
   //Edge symbol end:'pageThatsAllFolks'
   //=========================================================
   //Edge symbol: 'pageCoverThumb_1'
   (function(symbolName) {
      })("pageThatsAllFolksThumb");
   //Edge symbol end:'pageThatsAllFolksThumb'
   //=========================================================
   //Edge symbol: 'pageDiscussion_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${video_icon}", "click", function(sym, e) {
         playSongPageWithScrubber(135);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${page25}", "click", function(sym, e) {
         var pageName = pageArr[pageIndex].pageName;
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon").show();
         $(pageId+"_"+pageName)[0].pause();
         $(pageId+"_scrubber").hide();
         $(pageId+"_mobileHit").hide();
         $(pageId+"_bar").hide();
      });
      //Edge binding end
            })("page25");
   //Edge symbol end:'page25'
   //=========================================================
   //Edge symbol: 'pageSong'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${pageSong}", "click", function(sym, e) {
        
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon_Song").show();
         $(pageId+"_pageSong")[0].pause();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${btnCredits}", "click", function(sym, e) {
         //var pageName = pageArr[pageIndex].pageName;
         var pageId = pageArr[pageIndex].pageId;
         //if (!$(pageId+"_pageSong")[0].paused) {
         $(pageId+"_pageSong")[0].pause();
         $(pageId+"_pageSong").get(0).currentTime = 0;
         //}
         $(pageId+"_pageCredits")[0].playbackRate = preferencesArray[0].readingSpeedSong;
         $(pageId+"_pageCredits").show();
         $(pageId+"_pageSong").hide();
        
         $(pageId+"_pageCredits")[0].play();
         $(pageId+"_btnCredits").hide();
         $(pageId+"_btnSong").show();
         $(pageId+"_video_icon_Song").hide();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${btnSong}", "click", function(sym, e) {
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_pageCredits")[0].pause();
         $(pageId+"_pageCredits").get(0).currentTime = 0;
         $(pageId+"_pageSong").show();
         $(pageId+"_pageCredits").hide();
        
         $(pageId+"_pageSong")[0].play();
         $(pageId+"_btnCredits").show();
         $(pageId+"_btnSong").hide();
         $(pageId+"_video_icon_Credits").hide();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${pageCredits}", "click", function(sym, e) {
        
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon_Credits").show();
         $(pageId+"_pageCredits")[0].pause();

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${video_icon_Song}", "click", function(sym, e) {
        
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon_Song").hide();
         $(pageId+"_pageSong")[0].playbackRate = preferencesArray[0].readingSpeedSong;
         $(pageId+"_pageSong")[0].play();
         console.log("Leaving video_icon_Song");

      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${video_icon_Credits}", "click", function(sym, e) {
        
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon_Credits").hide();
         $(pageId+"_pageCredits")[0].play();

      });
      //Edge binding end
   })("pageSong");
   //Edge symbol end:'pageSong'
   //=========================================================
   //Edge symbol: 'gallery'
   (function(symbolName) {
      

      Symbol.bindElementAction(compId, symbolName, "${groupBtnGalleryCancel}", "click", function(sym, e) {
         galleryCancel();
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${marktoonWeb}", "click", function(sym, e) {
         // insert code for mouse click here
         alert(sym.$("marktoonWeb").attr("id"));
         

      });
      //Edge binding end

   })("gallery");
   //Edge symbol end:'gallery'
   //=========================================================
   //Edge symbol: 'pageSingALong'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${video_icon}", "click", function(sym, e) {
         //playSongPageWithScrubber(125, true);
         playSongPageWithScrubber(132);
      });
      //Edge binding end
      Symbol.bindElementAction(compId, symbolName, "${pageSingALong}", "click", function(sym, e) {
         var pageName = pageArr[pageIndex].pageName;
         var pageId = pageArr[pageIndex].pageId;
         $(pageId+"_video_icon").show();
         $(pageId+"_"+pageName)[0].pause();
         $(pageId+"_scrubber").hide();
         $(pageId+"_mobileHit").hide();
         $(pageId+"_bar").hide();
      });
      //Edge binding end
   })("pageSingALong");
   //Edge symbol end:'pageSingALong'
   //=========================================================
   //Edge symbol: 'page24'
   (function(symbolName) {
   })("page24");
   //Edge symbol end:'page24'
   //=========================================================
   //Edge symbol: 'btnExit'
   (function(symbolName) {
   })("btnExit");
   //Edge symbol end:'btnExit'
   //=========================================================
   //Edge symbol: 'pageChapter2After_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recShowAnswersOverlay}", "click", function(sym, e) {
         showAnswers('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

               })("pageChapter3After");
   //Edge symbol end:'pageChapter3After'
   //=========================================================
   //Edge symbol: 'pageChapter2AfterThumb_1'
   (function(symbolName) {
                     })("pageChapter3AfterThumb");
   //Edge symbol end:'pageChapter3AfterThumb'
   //=========================================================
   //Edge symbol: 'pageChapter3After_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${groupShowAnswersBtn}", "click", function(sym, e) {
         showAnswers('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

               })("pageChapter4After");
   //Edge symbol end:'pageChapter4After'
   //=========================================================
   //Edge symbol: 'pageChapter3AfterThumb_1'
   (function(symbolName) {
                     })("pageChapter4AfterThumb");
   //Edge symbol end:'pageChapter4AfterThumb'
   //=========================================================
   //Edge symbol: 'pageChapter4After_1'
   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, "${recShowAnswersOverlay}", "click", function(sym, e) {
         showAnswers('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

               })("pageChapter5After");
   //Edge symbol end:'pageChapter5After'
   //=========================================================
   //Edge symbol: 'pageChapter4AfterThumb_1'
   (function(symbolName) {
                     })("pageChapter5AfterThumb");
   //Edge symbol end:'pageChapter5AfterThumb'
   //=========================================================
   //Edge symbol: 'cameraRotate'
   (function(symbolName) {
   })("cameraRotate");
   //Edge symbol end:'cameraRotate'

   //=========================================================
   
   //Edge symbol: 'pageTOCThumb_1'
   (function(symbolName) {   
   
      })("pageTitleThumb");
   //Edge symbol end:'pageTitleThumb'

   //=========================================================
   
   //Edge symbol: 'pageChapter1_1'
   (function(symbolName) {   
   
      

      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         tocBtn('rgba(103,72,99,1.00)','rgba(99,103,72,1.00)');

      });
      //Edge binding end

         })("pageBonus");
   //Edge symbol end:'pageBonus'

   //=========================================================
   
   //Edge symbol: 'pageChapter1Thumb_1'
   (function(symbolName) {   
   
      })("pageBonusThumb");
   //Edge symbol end:'pageBonusThumb'

   //=========================================================
   
   //Edge symbol: 'warningBoxActivePlayer'
   (function(symbolName) {   
   
      

   })("dialogBoxInstructions");
   //Edge symbol end:'dialogBoxInstructions'

   //=========================================================
   
   //Edge symbol: 'previewApp'
   (function(symbolName) {   
   
      Symbol.bindElementAction(compId, symbolName, "${recGetSongsOverlay}", "click", function(sym, e) {
         songDiscussionControls();

      });
      //Edge binding end

      

      Symbol.bindElementAction(compId, symbolName, "${recButtonSelfNarrationOverlay}", "click", function(sym, e) {
         selfNarration();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recButtonAutoNarrationOverlay}", "click", function(sym, e) {
         autoNarration();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recButtonNarrationPingOverlay}", "click", function(sym, e) {
         narrationEndPing();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recButtonReadingSpeedOverlay}", "click", function(sym, e) {
         adjustReadingSpeed();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recButtonNarrationHighlightOverlay}", "click", function(sym, e) {
         narrationHighlight();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recButtonDisplayOverlay}", "click", function(sym, e) {
         buttonDisplayAddRemove();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recSpanishOverlay}", "click", function(sym, e) {
         spanish();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recSyllableSlamOverlay}", "click", function(sym, e) {
         syllableSlam();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recPage03PlayWordsOverlay}", "click", function(sym, e) {
         page03PlayWords();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recPlayPauseNarrationOverlay}", "click", function(sym, e) {
         playPauseNarration();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recSwipNavigationDownOverlay}", "click", function(sym, e) {
          swipeUpDownNavigation();
          

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recGetPictureOverlay}", "click", function(sym, e) {
         getPicture();
         
         

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recClose}", "click", function(sym, e) {				
				closePreview();				
      });
      //Edge binding end

      

      Symbol.bindElementAction(compId, symbolName, "${groupNext}", "click", function(sym, e) {
         	getPicture();
      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${groupPrevious}", "click", function(sym, e) {
         if (introButtonColorArray.length == 0 ){
         	songDiscussionControls();
         }
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recBtnTalkingPicDefaultsOverlay}", "click", function(sym, e) {
         talkingPicDefaults();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${groupHeading}", "click", function(sym, e) {
         previewApp();

      });
      //Edge binding end

   })("previewApp");
   //Edge symbol end:'previewApp'

   //=========================================================
   
   //Edge symbol: 'dialogBoxInstructions_1'
   (function(symbolName) {   
   
      Symbol.bindElementAction(compId, symbolName, "${groupYes}", "click", function(sym, e) {
         alert('yes');
         //addExampleTalkingImages();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${groupNo}", "click", function(sym, e) {
         alert('no');

      });
      //Edge binding end

      })("dialogBoxTalkingImages");
   //Edge symbol end:'dialogBoxTalkingImages'

   //=========================================================
   
   //Edge symbol: 'toolBar'
   (function(symbolName) {   
   
      Symbol.bindElementAction(compId, symbolName, "${listenOverlay}", "click", function(sym, e) {
         $("#Stage_toolBar_groupListen").hide();
         $("#Stage_toolBar_groupRead").show();
         showPageWords();

      });
      //Edge binding end

      

      Symbol.bindElementAction(compId, symbolName, "${readOverlay}", "click", function(sym, e) {
         //var pageId = pageArr[pageIndex].pageId;
         //$(pageId+"_toolBar_groupRead").hide();
         //$(pageId+"_toolBar_groupListen").show();
         
         $("#Stage_toolBar_groupListen").show();
         $("#Stage_toolBar_groupRead").hide();
         hidePageWords();
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${espanolOverlay}", "click", function(sym, e) {
         $("#Stage_toolBar_groupEspanol").hide();
         $("#Stage_toolBar_groupEspanol_x").show();
         btnSpanishPlay();
         
         
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${espanol_xOverlay}", "click", function(sym, e) {
         $("#Stage_toolBar_groupEspanol").show();
         $("#Stage_toolBar_groupEspanol_x").hide();
         killSpanish();
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${tractorOverlay}", "click", function(sym, e) {
         tractorButton();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${gearOverlay}", "click", function(sym, e) {
         btnPreferences();

      });
      //Edge binding end

      

   })("toolBar");
   //Edge symbol end:'toolBar'

   //=========================================================
   
   //Edge symbol: 'toolBar_1'
   (function(symbolName) {   
   
      

      

      Symbol.bindElementAction(compId, symbolName, "${gearOverlay}", "click", function(sym, e) {
         btnPreferences();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${themeOnOverlay}", "click", function(sym, e) {
         //var pageId = pageArr[pageIndex].pageId;
         //$(pageId+"_toolBarCover_groupThemeOff").show();
         //$(pageId+"_toolBarCover_groupThemeOn").hide();
         playTheme();
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${themeOffOverlay}", "click", function(sym, e) {
         //var pageId = pageArr[pageIndex].pageId;
         //$(pageId+"_toolBarCover_groupThemeOff").hide();
         //$(pageId+"_toolBarCover_groupThemeOn").show();
         pauseTheme();

      });
      //Edge binding end

      })("toolBarCover");
   //Edge symbol end:'toolBarCover'

   //=========================================================
   
   //Edge symbol: 'toolBar_1'
   (function(symbolName) {   
   
      Symbol.bindElementAction(compId, symbolName, "${gearOverlay}", "click", function(sym, e) {
         var pageType = pageArr[pageIndex].pageType;
         if (pageArr[pageIndex].pageType == "picOnlySelfie") {
         	btnPreferences();
         }else{
         	btnPreferencesSong();
         }
         
         
         
         
         
         

      });
         //Edge binding end

      })("toolBarGear");
   //Edge symbol end:'toolBarGear'

   //=========================================================
   
   //Edge symbol: 'pageChapter1_1'
   (function(symbolName) {   
   
      Symbol.bindElementAction(compId, symbolName, "${recTOCOverlay}", "click", function(sym, e) {
         //tocBtn(clickText, normalText)
         tocBtn('rgba(118,54,38,1.00)','rgba(51,107,135,1.00)');

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recLinkOverlay}", "click", function(sym, e) {
         //linkBtn(clickText, normalText)
         linkBtn('rgba(0,120,216,0.76)', 'rgba(118,54,38,1.00)');
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${recRateOverlay}", "click", function(sym, e) {
         rateBtn('rgba(0,120,216,0.76)', 'rgba(118,54,38,1.00)');

      });
      //Edge binding end

      

         })("pageRating");
   //Edge symbol end:'pageRating'

   //=========================================================
   
   //Edge symbol: 'page25Thumb_1'
   (function(symbolName) {   
   
                  })("pageRatingThumb");
   //Edge symbol end:'pageRatingThumb'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "words");