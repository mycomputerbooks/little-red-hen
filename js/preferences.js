var galleryLoaded = false;                                                                                                                                                                                                                                                                                                                                                           //navigator.notification.alert("Cordova is ready", null, alertTitle, alertBtn);
var theFileSystem;
var fromPictureRecord = false;
var theMedia01 = null;
var isPlaying;
var isRecording = false;
var recordTimer;
var newPictureRecording = false;
var newNarrationRecording = false;
var preferencesArray = new Array({readingSpeed: 1, sliderStageLeft: 112.355, readingSpeedSong: 1, sliderStageLeftSong: 112.355, highlightWords:true,
                        showReadingSpeed:false, showReadingSpeedSong:false, narrationPing: false, showWordsBtn: true, showEspanolBtn: true, showSlamBtn: true, autoNarrate: false});

var selfiePageArray = [];
var introButtonColorArray = [];
//var previewAppJustOpened = false;


//var alertTitle = "Notification Demo";
//var alertBtn = "Continue";
//var confirmMsg = "Are you enjoying Apache Cordova API Cookbook?";



document.addEventListener("deviceready", function() {		
    console.log("Entering deviceready");
    console.log("Leaving deviceready");
		
});

function appRating(promptFirstTime){
			AppRate.preferences = {
						displayAppName: 'Ready Hen',
						usesUntilPrompt: 3,
						promptAgainForEachNewVersion: false,
						inAppReview: true,
						storeAppURL: {
						ios: '1202614521',
			//		android: 'market://details?id=<package_name>',
			//		windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
			//		blackberry: 'appworld://content/[App Id]/',
			//		windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
					},
				customLocale: {
						title: "Would you mind rating %@?",
						message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
						cancelButtonLabel: "No, Thanks",
						laterButtonLabel: "Remind Me Later",
						rateButtonLabel: "Rate It Now",
						yesButtonLabel: "Yes!",
						noButtonLabel: "Not really",
						appRatePromptTitle: 'Do you like using %@',
						feedbackPromptTitle: 'Mind giving us some feedback?',
				},
				callbacks: {
						handleNegativeFeedback: function(){
						window.open('mailto:mprouty@mycomputerbooks.com','_system');
					},
					//	onRateDialogShow: function(callback){
					//	callback(1); // cause immediate click on 'Rate Now' button
					//},
						onButtonClicked: function(buttonIndex){
						console.log("onButtonClicked -> " + buttonIndex);
					}
				}
		};
		if (promptFirstTime){
				AppRate.promptForRating();
		}else{
				AppRate.promptForRating(false);
		}
		//AppRate.promptForRating();
}

function getFilePicture(startupSelfieIndex){  
		if (Modernizr.touch) {
				var pageName = selfiePageArray[startupSelfieIndex].pageName;				
				var extension = selfiePageArray[startupSelfieIndex].fileExtension;
				var pictureToGet = pageName+'.'+extension;
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
						fileSystem.root.getFile(pictureToGet, { create: false }, pictureExists, pictureDoesNotExist);
				}, getFSFail);	
		}
}
//fileSystem.root.getFile(pictureToGet, { create: false }, pictureExists, pictureDoesNotExist);

function pictureExists(fileEntry){
		var pageName = fileEntry.name;
		pageName = pageName.substring( 0, pageName.indexOf( "." ) );
		var idPicture = '#thumbnailStage'+pageName;
		var imgStage = $(idPicture)[0];
		var pic = fileEntry.toURL();
		var picPlusRandom = pic + '?' + Math.random();
		imgStage.src = picPlusRandom;
		var imgStudio = $('#thumbnailPicture')[0];
		imgStudio.src = picPlusRandom;
		//var imageWide = $('#thumbnailPicture').width();
		//var imageHigh = $('#thumbnailPicture').height();
		//alert("imageWide " + imageWide + " imageHigh " + imageHigh);
		
}

function pictureDoesNotExist(){
    //do nothing
    alert("file does not exist");
}


function getFileSystemSuccessRecording(fs) {
    console.log("Entering getFileSystemSuccessRecording");
    var filePath = "cdvfile://localhost/persistent/";
    var audioFile = "";
    var androidExt = ".amr";
    //var iOSExt = ".wav"; 
		var iOSExt = ".m4a"; 
    if (fromPictureRecord) {
        audioFile = pageArr[pageIndex].pageName+"Picture";
    }else{
        audioFile = pageArr[pageIndex].pageName;
    }
    
    var localFile = filePath+audioFile;
    //Build the local file path the application will use to access the
    //localFile = fs.root.fullPath + audioFile;
    if (device.platform == "Android") {
      //Build a file path using what you have so far

      localFile += androidExt;
    } else {
      //iOS will search for files, so we can just pass in
      //a file name and it will look in the apps fol
      localFile += iOSExt;
    }
    console.log("Local file: " + localFile);
    //Create the media object we need to do everything we need here
    console.log("Creating media object");
    theMedia01 = new Media(localFile, mediaSuccess, mediaError, mediaStatus);
    console.log("Leaving getFileSystemSuccessRecording");
}

function mediaSuccess() {
  //Executed when the media file is finished playing
  console.log("Entering mediaSuccess");
  isPlaying = false;
  //Write the current position to the page
  console.log("Leaving mediaSuccess");
}

function mediaError(errObj) {
  console.error("Entering mediaError");
  console.error(JSON.stringify(errObj));
  isPlaying = false;
  //Let the user know what happened
  var errStr;
  //Had to add this because some of the error conditions I encountered
  //did not provide an message value
  if (errObj.message.length > 0) {
    errStr = errObj.message + " (Code: " + errObj.code + ")";
  } else {
    errStr = "Error code: " + errObj.code + " (No error message provided by the Media API)";
  }
  console.error(errStr);
  navigator.notification.alert(errStr, null, "Media Error", alertBtn);
  console.error("Leaving mediaError");
}

function mediaStatus(statusCode) {
  console.log("Entering mediaStatus");
  var theStatus;
  switch (statusCode) {
    case Media.MEDIA_NONE:
      theStatus = "None";      
      break;
    case Media.MEDIA_STARTING:
      theStatus = "Starting";
      break;
    case Media.MEDIA_RUNNING:
      theStatus = "Running";
      break;
    case Media.MEDIA_PAUSED:
      theStatus = "Paused";
      break;
    case Media.MEDIA_STOPPED:
      theStatus = "Stopped";
      break;
    default:
      theStatus = "Unknown";
  }
  console.log("Status: " + statusCode + " " + theStatus);
  console.log("Leaving mediaStatus");
}

function copyTalkies(talkieFile){
    //var wwwPath = window.location.pathname;
    //va basePath = 'file://'+ wwwPath.substring(0,wwwPath.length-10);
		//if (talkieFile.indexOf("Picture") >= 0){
		//		checkIfFileExists(talkieFile);
		//}else{
		//		var fileToCheck = talkieFile.slice(0, -4)
		//		checkIfFileExists(fileToCheck+'.jpg');
		//		checkIfFileExists(fileToCheck+'.png');
		//		
		//}		
				
    basePath = cordova.file.applicationDirectory  + "www/defaultTalkies/" + talkieFile;
		window.resolveLocalFileSystemURL(basePath, 
        function(file){
            console.log('success! database was found');  
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, (10 * 1024 * 1024), onSuccess, null);
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, null);
                function onSuccess(fileSystem) {
                    var documentsPath = fileSystem.root;
                    file.copyTo(documentsPath, talkieFile,
                    function(){
                        console.log('copying was successful');
                    }, 
                    function(){
                        console.log('unsuccessful copying');
                    });
                }
        }, 
        function(){
            console.log('failure! database was not found');
        });
}

//======================= record ================================
function startTiming(){
    var counter;
    if (fromPictureRecord) {
        //counter = 15;
        counter = 45;
    }else{
        counter = 45;
    }
    recordTimer = setInterval(function() {
        counter--;
        if (counter >= 0) {
             $(".textTime").text(counter);
        }
        if (counter === 0) {
            groupBtnRecordStop();
        }
    }, 1000);
}

function playAudioPicture(){
    var pageName = pageArr[pageIndex].pageName;
    var audioToPlayPicture = pageName+'Picture.m4a';     
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(audioToPlayPicture, { create: false }, audioExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem
}

function playAudioNarration(){
    var pageName = pageArr[pageIndex].pageName;    
    var audioToPlayNarration = pageName+'.m4a';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(audioToPlayNarration, { create: false }, audioExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem    
}

function audioExists(fileEntry){
    var pageName = pageArr[pageIndex].pageName;
		var name = fileEntry.name;
		var audioFile = fileEntry.toURL();
		var audioFilePlusRandom = audioFile  + '?' + Math.random();
		$("#selfieAudio"+pageName).attr("src", audioFilePlusRandom);
		
		//$("#selfieAudio"+pageName).attr("src", fileEntry.toURL());
		
		if (name.indexOf("Picture") >= 0){
				$("#selfieAudio"+pageName).get(0).playbackRate = 1;    	
		}else{		
				$("#selfieAudio"+pageName).get(0).playbackRate = preferencesArray[0].readingSpeed;
		}
		$("#selfieAudio"+pageName).get(0).play();
}


/* PICK FROM GALLERY */

function pickPicture() {
    checkIfFileExists(pageArr[pageIndex].pageName+".jpg");
		selfiePageArray[selfieIndex].fileExtension = "png";
    navigator.camera.getPicture(takePictureCallback, cameraFail,
    { quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 200,
        targetHeight: 200,
      correctOrientation: true
      });
    console.log("pickPicture");
}


function checkIfFileExists(path){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem
}


function fileExists(fileEntry){
    removeFile(fileEntry.name);
}

function fileDoesNotExist(){
    //do nothing
    //alert("file does not exist");
}

function getFSFail(evt) {
    console.log(evt.target.error.code);
}

function clearPageImage() {
    var idPicture = '#thumbnailStage'+pageArr[pageIndex].pageName;
    var idPictureLess = "thumbnailStage"+pageArr[pageIndex].pageName;
    $(idPicture).remove();
    $('<img id="'+idPictureLess+'" class="resize-drag" src=""/>')
                        .appendTo(pageArr[pageIndex].pageId+"_imageChosen");
}

function clearThumbnail() {    
    $("#thumbnailPicture").remove();
		$("#Stage_preferences_preferencesPicture_recThumbnailPicture").html('<img class=resizeme id="thumbnailPicture" src=""/>');
}

function takePictureCallback(picture) {
		clearThumbnail();
    var picPlusRandom = picture + '?' + Math.random();
    var imgStudio = $('#thumbnailPicture')[0];		
    imgStudio.src = picPlusRandom;
    $("#thumbnailPicture").show();
		//alert($("#thumbnailPicture").clientHeight);
		//var bob = $('#thumbnailPicture').width();
		//alert('bob ' + bob);
    //=========================================
    clearPageImage();
    var idPicture = '#thumbnailStage'+pageArr[pageIndex].pageName;
    var imgStage = $(idPicture)[0];
    imgStage.src = picPlusRandom;
    $(idPicture).show();
    pictureCaptured = true;
    selfiePageArray[selfieIndex].pictureExists = true;
    selfiePageArray[selfieIndex].fromGallery = false;
    selfiePageArray[selfieIndex].dimensionsObtained = false;
    preferencesPicturePageSetup();  //takePictureCallback
    localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
    console.log("dimensionsObtained " + selfiePageArray[selfieIndex].dimensionsObtained );
    savePicture(picPlusRandom);
		//var bob = $('#thumbnailPicture').width();
		//alert('bob ' + bob);
}

/* PICTURE */

function takePicture() {
    checkIfFileExists(pageArr[pageIndex].pageName+".png");
    selfiePageArray[selfieIndex].fileExtension = "jpg";
    navigator.camera.getPicture(takePictureCallback, cameraFail,
    {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URL,
        targetWidth: 200,
        targetHeight: 200,
        correctOrientation: true,
        cameraDirection: Camera.Direction.BACK
    });
}

/* SELFIE */

function takeSelfie() {
    selfiePageArray[selfieIndex].fileExtension = "jpg";
    navigator.camera.getPicture(takePictureCallback, cameraFail,
    {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URL,
        saveToPhotoAlbum: false,
        targetWidth: 200,
        targetHeight: 200,
        correctOrientation: true,
        cameraDirection: Camera.Direction.FRONT
    });
    checkIfFileExists(pageArr[pageIndex].pageName+".png");
}

function savePicture(imageToSave){
    if(sessionStorage.isprofileimage==1){
      getLocation();
    }
    movePic(imageToSave);
}

function movePic(file){
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
}

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){
    var newFileName = pageArr[pageIndex].pageName+"."+selfiePageArray[selfieIndex].fileExtension;
    var myFolderApp = "LRH-Images";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
    //The folder is created if doesn't exist
    //fileSys.root.getDirectory( myFolderApp,
    fileSys.root.getDirectory( '',
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
}
//Callback function when the file has been moved successfully - inserting the complete pathe
function successMove(entry) {
    //Store imagepath in session for future use
    // like to store it in database
    sessionStorage.setItem('imagepath', entry.fullPath);
		var imageWide = $('#thumbnailPicture').width();
		var imageHigh = $('#thumbnailPicture').height();
		//alert('imageWide ' + imageWide);
		//alert('imageHigh ' + imageHigh);
		
		setThumbnailPicture(imageHigh, imageWide);
		$("#thumbnailPicture").height(selfiePageArray[selfieIndex].thumbHeight);
		$("#thumbnailPicture").width(selfiePageArray[selfieIndex].thumbWidth);
		
		
		
}

function resOnError(error) {
    alert(error.code);
}


function cameraFail() {
    navigator.notification.alert("Camera not available or picture cancelled", null);
    console.log('recordTimer ' + recordTimer);
}

function onFileError(errObj) {
  console.log("Entering onFileError");
  console.error(JSON.stringify(errObj));
  var msgText = "Unknown error.";
  switch(errObj.code) {
    case FileError.NOT_FOUND_ERR:
      msgText = "File not found error.";
      break;
    case FileError.SECURITY_ERR:
      msgText = "Security error.";
      break;
    case FileError.ABORT_ERR:
      msgText = "Abort error.";
      break;
    case FileError.NOT_READABLE_ERR:
      msgText = "Not readable error.";
      break;
    case FileError.ENCODING_ERR:
      msgText = "Encoding error.";
      break;
    case FileError.NO_MODIFICATION_ALLOWED_ERR:
      msgText = "No modification allowed.";
      break;
    case FileError.INVALID_STATE_ERR:
      msgText = "Invalid state.";
      break;
    case FileError.SYNTAX_ERR:
      msgText = "Syntax error.";
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msgText = "Invalid modification.";
      break;
    case FileError.QUOTA_EXCEEDED_ERR:
      msgText = "Quota exceeded.";
      break;
    case FileError.TYPE_MISMATCH_ERR:
      msgText = "Type mismatch.";
      break;
    case FileError.PATH_EXISTS_ERR:
      msgText = "Path exists error.";
      break;
  }
  console.log(msgText);
  var alertBtn = "Continue";
  var alertTitle = "Correct The Error";
  navigator.notification.alert(msgText, null, alertTitle, alertBtn);
  console.log("Leaving onFileError");
}

/******************************************* INTERFACE ********************************************/
function btnRecordToCorner() {
		var pageId = pageArr[pageIndex].pageId;
    setTimeout(function(){
        btnOnOff("microphonePreferences", "microphonePreferencesGreen", "txtRecordToCorner", "recNavRBGCorner");
        if (fromPictureRecord) {
            $(".txtRecordTitle").text("record image");
        	words.Sym.getSymbol("preferences").play("pictureDone");
        }else{
            $(".txtRecordTitle").text("record narration");
        	words.Sym.getSymbol("preferences").play("recordDone");
        }
        $("#Stage_dialogSpeed").hide();
        $(".btnToPreferencesSpeed").hide();
        $(".btnToPreferencesSpeed").css("z-index", "-1");
        $(".btnToPreferencesSpeedSong").hide();
        $(".btnToPreferencesSpeedSong").css("z-index", "-1");
    }, 125);
    btnOnOff("microphonePreferences", "microphonePreferencesGreen", "txtRecordToCorner", "recNavRBGCorner");
    $(".recRecordStopBG").css("background-color","rgb(97,138,96)");  //green
    btnOnOff("microphoneYellow", "microphoneGreen", "txtRecordStop", "recRecordStopBG");
    //exitPreferences();
    if (fromPictureRecord) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, (10 * 1024 * 1024), getFileSystemSuccessRecording, onFileError);
        $(".textTime").text('45');
    }else{
        $(".textTime").text('45');
    }
    $(".txtRecordStop").text('Start');
    $(".recordPlayStage").css("z-index", "1");
    exitPreferences(); //hides toolbar
		$(pageId+"_btnVideo").hide();
    $(".recordPlayStage").css({'position': 'absolute','top':'552px', 'left':'757px'});
    $(".recordPlayStage").animate({opacity: 1}, 300);
    $(".groupRecordPlayMain").show();  //mlp 12-07-2016
}

//function hideControlsWhileRecording() {
//    var pageId = pageArr[pageIndex].pageId;
//    var pageType = pageArr[pageIndex].pageType;
//    
//		if (pageArr[pageIndex].pageType == "selfie") {
//				$(pageId+"_btnVideo").hide();
//        $(pageId+"_btnVideo").css("z-index", "-1");
//				$("#Stage_toolBar").hide();
//				$("#Stage_toolBar").css("z-index", "-1");
//		}
//		
//		if (pageArr[pageIndex].pageType == "picOnlySelfie") {
//				$(pageId+"_toolBarGear").hide();
//				$(pageId+"_toolBarGear").css("z-index", "-1");
//		}
//    
//}

//function showControlsAfterRecording() {
//    var pageId = pageArr[pageIndex].pageId;
//    var pageType = pageArr[pageIndex].pageType;
//		
//		if (pageArr[pageIndex].pageType == "selfie") {
//        $(pageId+"_btnVideo").show();
//        $(pageId+"_btnVideo").css("z-index", "1");
//        $(pageId+"_btnVideo").css({ opacity: 1 });
//				$("#Stage_toolBar").show();
//				$("#Stage_toolBar").css("z-index", "1");
//    
//        if (preferencesArray[0].showEspanolBtn === true){
//            //$(pageId+"_btnSpanish").show();
//            //$(pageId+"_btnSpanish").css("z-index", "1");
//        }
//        
//        if (preferencesArray[0].showReadingSpeed === true){
//            $("#Stage_dialogSpeed").show();
//            $(".btnToPreferencesSpeed").show();
//            $(".btnToPreferencesSpeed").css("z-index", "1");
//        }
//    }
//		if (pageArr[pageIndex].pageType == "picOnlySelfie") {
//				$(pageId+"_toolBarGear").show();
//				$(pageId+"_toolBarGear").css("z-index", "1");
//		}
//}

function pauseVideo(){
    var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    var pageType = pageArr[pageIndex].pageType;
    if (pageType != "picOnlySelfie") {
        if (!$(pageId+"_"+pageName)[0].paused) {
            $(pageId+"_"+pageName)[0].pause();
            $(pageId+"_"+pageName).get(0).currentTime = 0;
        }
    }
    
}

function pausePlayer(){
    var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    if (!$(pageId+"_"+pageName)[0].paused) {
        $(pageId+"_"+pageName)[0].pause();
        $(pageId+"_"+pageName).get(0).currentTime = 0; 
        $(".txtPlayPauseCover").text('Play');
        $(".speakerYellowCover").show();
        $(".speakerGreenCover").hide();
        $(".txtPlayPauseCover").css("color", "rgb(97,138,96)"); //green
    }
}

function doRecordStart() {
    //var pageId = pageArr[pageIndex].pageId;
    //var pageName = pageArr[pageIndex].pageName;
    killPageWords();
    //hideControlsWhileRecording();
    pauseVideo();
    if (fromPictureRecord === true){ 
        newPictureRecording = true;
    }else{
        newNarrationRecording = true;
    }
    $(".stillArrows").hide();
    startTiming();
    console.log("Entering doRecordStart");
      if (!isRecording) {
					isRecording = true;
					var options = {
							SampleRate: 16000,
							NumberOfChannels: 1
					};
					
					theMedia01.startRecordWithCompression(options);
					
					//theMedia01.startRecord();
					if (fromPictureRecord === false) {
								preferencesArray[0].readingSpeed = 1;
								preferencesArray[0].sliderStageLeft = 100;
								localStorage["preferences"] = JSON.stringify(preferencesArray);
								$("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
								$("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
								$(".txtSpeedAmt").text(preferencesArray[0].readingSpeed);
					}else{
								selfiePageArray[selfieIndex].pictureNarrationExists = true;
					}
      } else {
        console.log("Already recording");
        navigator.notification.alert("Media file already being recorded", null, alertTitle, alertBtn);
      }
    console.log("Leaving doRecordStart");
}

function doRecordStop() {
    console.log("Entering doRecordStop");
    clearInterval(recordTimer);
    if (isRecording) {
      theMedia01.stopRecord();        
      isRecording = false;
      $(".stillArrows").show();
      if (fromPictureRecord === true) {
          $(".textTime").text('45');
      }else{
          $(".textTime").text('45');
      }        
      if (fromPictureRecord === false) {
          selfiePageArray[selfieIndex].narrationExists = true;
          localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
          selfNarrate();
      }
    }
    console.log("Leaving doRecordStop");
}

function groupBtnRecordStop(){
    if (!isRecording) {
        $(".txtRecordStop").text('Stop');
        $(".txtRecordStop").css("color", "rgb(255,0,0)"); //red
        $(".microphoneYellow").hide();
        $(".microphoneGreen").show();
        doRecordStart();
        //==============================================
        var pageName = pageArr[pageIndex].pageName;
        if(!$("#selfieAudio"+pageName).get(0).paused){
            $("#selfieAudio"+pageName).get(0).pause();
            $("#selfieAudio"+pageName).get(0).currentTime = 0;
        }
        var pageId = pageArr[pageIndex].pageId;
        $(pageId+"_imgWords").show();
        
        //=============================================
        
        if (fromPictureRecord === false){
            if (selfiePageArray[selfieIndex].selfNarration === false) {
                selfiePageArray[selfieIndex].selfNarration = true;
                localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
                selfNarrate();
            }
        }
    }else{
        $(".txtRecordStop").text('Start');
        $(".txtRecordStop").css("color", "rgb(97,138,96)"); //green
        $(".microphoneYellow").show();
        $(".microphoneGreen").hide();
        doRecordStop();
    }
}

function groupRecordDone() {
    setTimeout(function(){
        btnOnOff("checkRecordDoneYellow", "checkRecordDoneGreen", "txtRecordDone", "recRecordDone");
        doRecordStop();
        theMedia01.play(); 
        $(".groupRecordPlayMain").hide();
    }, 125);
    btnOnOff("checkRecordDoneYellow", "checkRecordDoneGreen", "txtRecordDone", "recRecordDone");
}

function groupVerCancel() {
    setTimeout(function(){
        btnOnOff("verCancelYellow", "verCancelGreen", "txtVerCancel", "recVerCancel");
        theMedia01.stop();
        window.requestFileSystem(LocalFileSystem.PERSISTENT, (10 * 1024 * 1024), getFileSystemSuccessRecording, onFileError);
        $(".txtRecordStop").text('Start');
        $(".txtRecordStop").css("color", "rgb(97,138,96)"); //green
        $(".groupRecordPlayMain").show();
    }, 125);
    btnOnOff("verCancelYellow", "verCancelGreen", "txtVerCancel", "recVerCancel");
    $(".txtRecordStop").text('Start');
    $(".txtRecordStop").css("color", "rgb(97,138,96)"); //green
    $(".microphoneYellow").show();
    $(".microphoneGreen").hide();
}

function groupVerOk() {
    setTimeout(function(){
				var pageId = pageArr[pageIndex].pageId;
        btnOnOff("verOkYellow", "verOkGreen", "txtVerOk", "recVerOk");
        $(".recordPlayStage").css("z-index", "-1");
        theMedia01.stop();
        //showControlsAfterRecording();
				if (pageArr[pageIndex].pageType == "selfie") {
						$(pageId+"_btnVideo").show();
						$(pageId+"_btnVideo").css("z-index", "1");
						$(pageId+"_btnVideo").css({ opacity: 1 });
						if (preferencesArray[0].showReadingSpeed === true){
								$("#Stage_dialogSpeed").show();
								$(".btnToPreferencesSpeed").show();
								$(".btnToPreferencesSpeed").css("z-index", "1");
						}
				}
				setToolBarOn();
//				if (preferencesArray[0].showReadingSpeed === true){
//            $("#Stage_dialogSpeed").show();
//            $(".btnToPreferencesSpeed").show();
//            $(".btnToPreferencesSpeed").css("z-index", "1");
//        }
    }, 125);
    btnOnOff("verOkYellow", "verOkGreen", "txtVerOk", "recVerOk");
}

function selfNarrate() {
    if(selfiePageArray[selfieIndex].narrationExists === true){
        $("#Stage_preferences_preferencesRecord_txtRecordInstructions").hide();
        $("#Stage_preferences_preferencesRecord_groupNarrationButtons").show();
        var pageId = pageArr[pageIndex].pageId;
        var pageName = pageArr[pageIndex].pageName;
        if (selfiePageArray[selfieIndex].selfNarration === true) {
            if (!$(pageId+"_"+pageName)[0].paused) {
                $(pageId+"_btnVideo").css({ opacity: 1 });
                $(pageId+"_"+pageName)[0].pause();
                $(pageId+"_"+pageName).get(0).currentTime = 0;
            }
            
            deleteRecordingNo();
            $("#Stage_preferences_preferencesRecord_groupHighlight").hide();
            $("#Stage_preferences_preferencesRecord_groupDeleteNarration").show();
            $("#Stage_preferences_preferencesRecord_recNarrateYou").css('background-color', '#618a60'); //green
            $("#Stage_preferences_preferencesRecord_recNarrateComputer").css('background-color', '#fbedc5'); //yellow
            $("#Stage_preferences_preferencesRecord_txtNarrateYou").css('color', '#ffffff');  //white
            $("#Stage_preferences_preferencesRecord_checkYou").show();
            $("#Stage_preferences_preferencesRecord_checkComputer").hide();
            $("#Stage_preferences_preferencesRecord_txtNarrateComputer").css('color', '#618a60');  //green
            $("#Stage_preferences_preferencesRecord_textSelfNarrateOnOff").text("you");
        }else{
            if(!$("#selfieAudio"+pageName).get(0).paused){
                $(pageId+"_btnVideo").css({ opacity: 1 });
                $("#selfieAudio"+pageName).get(0).pause();
                $("#selfieAudio"+pageName).get(0).currentTime = 0;
            }
            $("#Stage_preferences_preferencesRecord_groupHighlight").show();
            $("#Stage_preferences_preferencesRecord_groupDeleteNarration").hide();
            $("#Stage_preferences_preferencesRecord_recNarrateComputer").css('background-color', '#618a60');  //green
            $("#Stage_preferences_preferencesRecord_recNarrateYou").css('background-color', '#fbedc5');  //yellow
            $("#Stage_preferences_preferencesRecord_txtNarrateComputer").css('color', '#ffffff');  //white
            $("#Stage_preferences_preferencesRecord_checkYou").hide();
            $("#Stage_preferences_preferencesRecord_checkComputer").show();
            $("#Stage_preferences_preferencesRecord_txtNarrateYou").css('color', '#618a60');  //green
            $("#Stage_preferences_preferencesRecord_textSelfNarrateOnOff").text("computer");

        }
    }else{
        $("#Stage_preferences_preferencesRecord_txtRecordInstructions").show();
        $("#Stage_preferences_preferencesRecord_groupHighlight").show();
        $("#Stage_preferences_preferencesRecord_groupDeleteNarration").hide();
        $("#Stage_preferences_preferencesRecord_groupNarrationButtons").hide();
        $("#Stage_preferences_preferencesRecord_textSelfNarrateOnOff").text("computer");
    }
}

function wordsHighlighted(){
  if (preferencesArray[0].highlightWords === true){
    $("#Stage_preferences_preferencesRecord_recHighlightOn").css('background-color', '#618a60');
    $("#Stage_preferences_preferencesRecord_recHighlightOff").css('background-color', '#fbedc5');
    $("#Stage_preferences_preferencesRecord_txtHighlightOn").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkHighlightOn").show();
    $("#Stage_preferences_preferencesRecord_checkHighlightOff").hide();
    $("#Stage_preferences_preferencesRecord_txtHighlightOff").css('color', '#618a60');
    $("#Stage_preferences_preferencesRecord_textHighlightOnOff").text("on");
  }else{
    $("#Stage_preferences_preferencesRecord_recHighlightOff").css('background-color', '#618a60');
    $("#Stage_preferences_preferencesRecord_recHighlightOn").css('background-color', '#fbedc5');
    $("#Stage_preferences_preferencesRecord_txtHighlightOff").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkHighlightOn").hide();
    $("#Stage_preferences_preferencesRecord_checkHighlightOff").show();
    $("#Stage_preferences_preferencesRecord_txtHighlightOn").css('color', '#618a60');
    $("#Stage_preferences_preferencesRecord_textHighlightOnOff").text("off");
  }
}
//==========================================================================
function narrationPing(){
  if (preferencesArray[0].narrationPing === true){
    $("#Stage_preferences_preferencesRecord_recPingOn").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_recPingOff").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesRecord_txtPingOn").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkPingOn").show();
    $("#Stage_preferences_preferencesRecord_checkPingOff").hide();
    $("#Stage_preferences_preferencesRecord_txtPingOff").css('color', '#618a60'); //green
    $("#Stage_preferences_preferencesRecord_txtPingOnOff").text("on");
  }else{
    $("#Stage_preferences_preferencesRecord_recPingOff").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_recPingOn").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesRecord_txtPingOff").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkPingOn").hide();
    $("#Stage_preferences_preferencesRecord_checkPingOff").show();
    $("#Stage_preferences_preferencesRecord_txtPingOn").css('color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_txtPingOnOff").text("off");
  }
}
//==========================================================================
function autoNarrate(){
  if (preferencesArray[0].autoNarrate === true){
    $("#Stage_preferences_preferencesRecord_recAutoNarrateOn").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_recAutoNarrateOff").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesRecord_txtAutoNarrateOn").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkAutoNarrateOn").show();
    $("#Stage_preferences_preferencesRecord_checkAutoNarrateOff").hide();
    $("#Stage_preferences_preferencesRecord_txtAutoNarrateOff").css('color', '#618a60'); //green
    $("#Stage_preferences_preferencesRecord_txtPlayOnPageChangeOnOff").text("on");
  }else{
    $("#Stage_preferences_preferencesRecord_recAutoNarrateOff").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_recAutoNarrateOn").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesRecord_txtAutoNarrateOff").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkAutoNarrateOn").hide();
    $("#Stage_preferences_preferencesRecord_checkAutoNarrateOff").show();
    $("#Stage_preferences_preferencesRecord_txtAutoNarrateOn").css('color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_txtPlayOnPageChangeOnOff").text("off");
  }
}
//==========================================================================

function showWordsBtnOnPage() {
    if (preferencesArray[0].showWordsBtn === true) {
        $("#Stage_preferences_preferencesButtons_recHighlightShowWordsYes").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_recHighlightShowWordsNo").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesButtons_txtShowWordsYes").css('color', '#ffffff');
        $("#Stage_preferences_preferencesButtons_checkWordsYes").show();
        $("#Stage_preferences_preferencesButtons_checkWordsNo").hide();
        $("#Stage_preferences_preferencesButtons_txtShowWordsNo").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_textShowWordsYesNo").text("yes");
    }else{
        //$("#Stage_groupPicture").hide();
        $("#Stage_preferences_preferencesButtons_recHighlightShowWordsNo").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_recHighlightShowWordsYes").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesButtons_txtShowWordsNo").css('color', '#ffffff');
        $("#Stage_preferences_preferencesButtons_checkWordsYes").hide();
        $("#Stage_preferences_preferencesButtons_checkWordsNo").show();
        $("#Stage_preferences_preferencesButtons_txtShowWordsYes").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_textShowWordsYesNo").text("no");
    }
}

function showSlamBtnOnPage() {
    if (preferencesArray[0].showSlamBtn === true) {
        $("#Stage_preferences_preferencesButtons_recHighlightShowSlamYes").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_recHighlightShowSlamNo").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesButtons_txtShowSlamYes").css('color', '#ffffff');
        $("#Stage_preferences_preferencesButtons_checkSlamYes").show();
        $("#Stage_preferences_preferencesButtons_checkSlamNo").hide();
        $("#Stage_preferences_preferencesButtons_txtShowSlamNo").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_textShowSlamYesNo").text("yes");
    }else{
        //$("#Stage_groupPicture").hide();
        $("#Stage_preferences_preferencesButtons_recHighlightShowSlamNo").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_recHighlightShowSlamYes").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesButtons_txtShowSlamNo").css('color', '#ffffff');
        $("#Stage_preferences_preferencesButtons_checkSlamYes").hide();
        $("#Stage_preferences_preferencesButtons_checkSlamNo").show();
        $("#Stage_preferences_preferencesButtons_txtShowSlamYes").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_textShowSlamYesNo").text("no");
    }
}

function showEspanolBtnOnPage() {
    if (preferencesArray[0].showEspanolBtn === true) {
        $("#Stage_preferences_preferencesButtons_recHighlightShowSpanishYes").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_recHighlightShowSpanishNo").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesButtons_txtShowSpanishYes").css('color', '#ffffff');
        $("#Stage_preferences_preferencesButtons_checkSpanishYes").show();
        $("#Stage_preferences_preferencesButtons_checkSpanishNo").hide();
        $("#Stage_preferences_preferencesButtons_txtShowSpanishNo").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_textShowSpanishYesNo").text("yes");
    }else{
        //$("#Stage_groupPicture").hide();
        $("#Stage_preferences_preferencesButtons_recHighlightShowSpanishNo").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_recHighlightShowSpanishYes").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesButtons_txtShowSpanishNo").css('color', '#ffffff');
        $("#Stage_preferences_preferencesButtons_checkSpanishYes").hide();
        $("#Stage_preferences_preferencesButtons_checkSpanishNo").show();
        $("#Stage_preferences_preferencesButtons_txtShowSpanishYes").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesButtons_textShowSpanishYesNo").text("no");
    }
}


function showPictureOnPage() {
    if (selfiePageArray[selfieIndex].showPicture === true){
        $("#Stage_preferences_preferencesPicture_recHighlightShowPictureYes").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesPicture_recHighlightShowPictureNo").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesPicture_txtShowPictureYes").css('color', '#ffffff');
        $("#Stage_preferences_preferencesPicture_checkPictureYes").show();
        $("#Stage_preferences_preferencesPicture_checkPictureNo").hide();
        $("#Stage_preferences_preferencesPicture_txtShowPictureNo").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesPicture_textShowPictureYesNo").text("yes");
    }else{
        $("#Stage_preferences_preferencesPicture_recHighlightShowPictureNo").css('background-color', '#618a60');//green
        $("#Stage_preferences_preferencesPicture_recHighlightShowPictureYes").css('background-color', '#fbedc5');//yellow
        $("#Stage_preferences_preferencesPicture_txtShowPictureNo").css('color', '#ffffff');
        $("#Stage_preferences_preferencesPicture_checkPictureYes").hide();
        $("#Stage_preferences_preferencesPicture_checkPictureNo").show();
        $("#Stage_preferences_preferencesPicture_txtShowPictureYes").css('color', '#618a60');//green
        $("#Stage_preferences_preferencesPicture_textShowPictureYesNo").text("no");
    }
}

function deleteRecordingYes(){
    $("#Stage_preferences_preferencesRecord_recHighlightDeleteRecordingYes").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_recHighlightDeleteRecordingNo").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesRecord_txtDeleteRecordingYes").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_checkDeleteRecordingYes").show();
    $("#Stage_preferences_preferencesRecord_checkDeleteRecordingNo").hide();
    $("#Stage_preferences_preferencesRecord_txtDeleteRecordingNo").css('color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_textDeleteRecordingYesNo").text("yes");
    $("#Stage_preferences_preferencesRecord_groupShowPicture").hide();
}

function deleteRecordingNo(){
    $("#Stage_preferences_preferencesRecord_recHighlightDeleteRecordingYes").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesRecord_recHighlightDeleteRecordingNo").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_txtDeleteRecordingYes").css('color', '#618a60');//green
    $("#Stage_preferences_preferencesRecord_checkDeleteRecordingYes").hide();
    $("#Stage_preferences_preferencesRecord_checkDeleteRecordingNo").show();
    $("#Stage_preferences_preferencesRecord_txtDeleteRecordingNo").css('color', '#ffffff');
    $("#Stage_preferences_preferencesRecord_textDeleteRecordingYesNo").text("no");
}




function deletePictureYes(){
    $("#Stage_preferences_preferencesPicture_recHighlightDeletePictureYes").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesPicture_recHighlightDeletePictureNo").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesPicture_txtDeletePictureYes").css('color', '#ffffff');
    $("#Stage_preferences_preferencesPicture_checkPictureDeleteYes").show();
    $("#Stage_preferences_preferencesPicture_checkPictureDeleteNo").hide();
    $("#Stage_preferences_preferencesPicture_txtDeletePictureNo").css('color', '#618a60');//green
    $("#Stage_preferences_preferencesPicture_textDeletePictureYesNo").text("yes");
    $("#Stage_preferences_preferencesPicture_groupShowPicture").hide();
}

function deletePictureNo(){
    $("#Stage_preferences_preferencesPicture_recHighlightDeletePictureYes").css('background-color', '#fbedc5');//yellow
    $("#Stage_preferences_preferencesPicture_recHighlightDeletePictureNo").css('background-color', '#618a60');//green
    $("#Stage_preferences_preferencesPicture_txtDeletePictureYes").css('color', '#618a60');//green
    $("#Stage_preferences_preferencesPicture_checkPictureDeleteYes").hide();
    $("#Stage_preferences_preferencesPicture_checkPictureDeleteNo").show();
    $("#Stage_preferences_preferencesPicture_txtDeletePictureNo").css('color', '#ffffff');
    $("#Stage_preferences_preferencesPicture_textDeletePictureYesNo").text("no");
}

function doConfirmDelete() {
		console.log("Entering doConfirm");
  navigator.notification.confirm("Remove the picture from this page forever?", deletePictureOkCancel);
  console.log("Leaving doConfirm");
}

function doConfirmDeleteRecording() {
  console.log("Entering doConfirm");
  navigator.notification.confirm("Remove the recording from this page forever?", deleteRecordingOkCancel);
  console.log("Leaving doConfirm");
}
//====================================================
function deleteRecordingOkCancel(btnNum) {
  console.log("Entering deleteRecordingOkCancel");
  console.log("Button: " + btnNum);
  if (btnNum == 1) {
    var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    if(!$("#selfieAudio"+pageName).get(0).paused){
        $("#selfieAudio"+pageName).get(0).pause();
        $("#selfieAudio"+pageName).get(0).currentTime = 0;
        $(pageId+"_btnVideo").css({ opacity: 1 });
    }
    removeRecording(pageArr[pageIndex].pageName+".m4a");
    selfiePageArray[selfieIndex].narrationExists = false;
    localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
    selfNarrate();
  }
  console.log("Leaving deleteRecordingOkCancel");
}

function removeRecording(fileName) {
    var root = getFileSystemRoot();
    var remove_file = function(entry) {
        entry.remove(function() {
        }, onFileError);
    };
    // retrieve a file and truncate it
    root.getFile(fileName, {create: false}, remove_file, onFileError);
}
//===================================================
function confirmPreMadeImages() {
  console.log("Entering doConfirm");
	var msg = "Once talking images are created, they can be dragged sized and rotated. For several pages, fun examples have been pre-made. No matter what you choose here,"+
						 "these examples can be added or removed from their pages later.";
  navigator.notification.confirm(msg, confirmSuccessPremadeImages, "Do you want to include pre-made talking images on more than just this page?", "Yes - more than just this page, No - just this page, Cancel");
  console.log("Leaving doConfirm");
}

function confirmSuccessPremadeImages(btnNum) {
  console.log("Entering confirmSuccess");
  console.log("Button: " + btnNum);
  var alertTitle = "Talking Image Confirmation";
	var alertBtn = "Continue";
	var msg;
  switch (parseInt(btnNum)) {
    case 1:
			checkExistanceForMultiplePreMadeImages();
			groupPreferencesPictureDone("multiple");
      break;
    case 2:
			checkExistanceForSinglePreMadeImage();
			groupPreferencesPictureDone("single");
      break;
    case 3:
      msg = "You have chosen to cancel any changes to talking images.";
			navigator.notification.alert(msg, null, alertTitle, alertBtn);
      break;
  }
  console.log("Leaving confirmSuccess");
}




function getPicture(){
		var pageId = pageArr[pageIndex].pageId;
		$(pageId+"_previewApp").css({ opacity: 0.80 });		
		pageThrough(473, 92000,			
								"songDiscussionControls()",
								"swipeUpDownNavigation()");
		turnOnColors("GetPicture");		
}


function swipeUpDownNavigation(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "114.38px", "left": "20.50px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(5, 37000,
								"getPicture()",
								"playPauseNarration()");
		turnOnColors("SwipNavigationDown");
}

function playPauseNarration(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "366px", "left": "801.5px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(45, 8000,
								"swipeUpDownNavigation()",
								"page03PlayWords()");
		turnOnColors("PlayPauseNarration");
}

function page03PlayWords(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "366px", "left": "801.5px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(55, 13000,
								"playPauseNarration()",
								"syllableSlam()");
		turnOnColors("Page03PlayWords");
}

function syllableSlam(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "366px", "left": "801.5px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(71, 30000,
								"page03PlayWords()",
								"spanish()");
		turnOnColors("SyllableSlam");
}

function spanish(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "47px", "left": "801.5px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(100, 18000,
								"syllableSlam()",
								"buttonDisplayAddRemove()");
		turnOnColors("Spanish");
}

function buttonDisplayAddRemove(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "70.38px", "left": "15.50px"});
		$(pageId+"_previewApp").css({ opacity: 0.90 });
		pageThrough(138, 23000,
								"spanish()",
								"narrationHighlight()");
		turnOnColors("ButtonDisplay");
}

function narrationHighlight(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "366px", "left": "801.5px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(162, 47000,						
								"buttonDisplayAddRemove()",
								"adjustReadingSpeed()");
		turnOnColors("NarrationHighlight");
}

function adjustReadingSpeed(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "355px", "left": "272px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });		
		pageThrough(212, 44000,
								"narrationHighlight()",
								"narrationEndPing()");
		turnOnColors("ReadingSpeed");
}

function narrationEndPing(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "355px", "left": "272px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(258, 23000,
								"adjustReadingSpeed()",
								"autoNarration()");
		turnOnColors("NarrationPing");
}
function autoNarration(){  
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "355px", "left": "272px"});
		$(pageId+"_previewApp").css({ opacity: 0.80 });
		pageThrough(283, 46000,
								"narrationEndPing()",
								"selfNarration()");
		turnOnColors("AutoNarration");
}
function selfNarration(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "355px", "left": "272px"});
		pageThrough(330, 64000,
								"autoNarration()",
								"talkingPicDefaults()");
		turnOnColors("SelfNarration");
}
function talkingPicDefaults(){  
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "340px", "left": "300px"});
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "366px", "left": "801.5px"});
		pageThrough(567, 44000,
								"selfNarration()",
								"songDiscussionControls()");
		turnOnColors("TalkingPicDefaults");
}

function songDiscussionControls(){
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "5px", "left": "803px"});
		pageThrough(403, 69000,
								"talkingPicDefaults()",
								"getPicture()");
		turnOnColors("Songs");
}

function pageThrough(start, duration, previousStep, nextStep){		
		var pageId = pageArr[pageIndex].pageId;
		//$(pageId+"_recVideo").show();
		clearTimeout(videoTimer);
		//videoTimer = setTimeout(function(){
		//		$("#playPauseVideo")[0].pause();
		//}, duration);
		$("#playPauseVideo")[0].currentTime = start;
		$("#playPauseVideo")[0].play();
		$("#playPauseVideo").show();
		videoTimer = setTimeout(function(){
				$("#playPauseVideo")[0].pause();
		}, duration);
		$(pageId+"_previewApp_groupPrevious").unbind('click');
		$(pageId+"_previewApp_groupPrevious").attr("onClick",previousStep);
		$(pageId+"_previewApp_groupNext").unbind('click');
		$(pageId+"_previewApp_groupNext").attr("onClick",nextStep);
		
}

function turnOnColors(sendingButton){
		var pageId = pageArr[pageIndex].pageId;
		var count = introButtonColorArray.indexOf(sendingButton);
		if (count == -1){
				introButtonColorArray.push(sendingButton);
		}
		for (var i=0;i<introButtonColorArray.length;i++){
				$(pageId+"_previewApp_txt"+introButtonColorArray[i]).css('color', '#618a60');  //green
				$(pageId+"_previewApp_rec"+introButtonColorArray[i]).css('background-color', '#fbedc5');  //yellow
		}
		$(pageId+"_previewApp_txt"+sendingButton).css('color', '#ffffff');
		$(pageId+"_previewApp_rec"+sendingButton).css('background-color', '#618a60');  //green
}



function previewApp(){
		var pageId = pageArr[pageIndex].pageId;
		$(pageId+"_bgImage").animate({opacity: 0}, 1000);
		$(pageId+"_previewApp_groupPrevious").unbind('click');
		$(pageId+"_previewApp_groupPrevious").attr("onClick","getPicture()");
		$(pageId+"_previewApp_groupNext").unbind('click');
		$(pageId+"_previewApp_groupNext").attr("onClick","getPicture()");
		
		
		
		for (var i=0;i<introButtonColorArray.length;i++){
						$(pageId+"_previewApp_txt"+introButtonColorArray[i]).css('color', '#618a60');  //green
						$(pageId+"_previewApp_rec"+introButtonColorArray[i]).css('background-color', '#fbedc5');  //yellow
				}
		//============================
		//$({blurRadius: 0}).animate({blurRadius: 10}, {
		//		duration: 500,
		//		easing: 'swing', // or "linear"
		//										 // use jQuery UI or Easing plugin for more options
		//		step: function() {
		//				console.log(this.blurRadius);
		//				$(pageId+"_bgImage").css({
		//						"-webkit-filter": "blur("+this.blurRadius+"px)",
		//						"filter": "blur("+this.blurRadius+"px)"
		//				});
		//		}
		//});
		hideNavButtons();			
		$(pageId+"_toolBarCover").hide();
		$(pageId+"_previewApp_groupMain").show();
		$(pageId+"_previewApp_groupClose").show();
		if ($('#playPauseVideo').length === 0 ) {
				$('<video class = "initialPreviews" id="playPauseVideo" poster="pageCover/images/vidPoster.jpg">'+
				//$('<video class = "initialPreviews" id="playPauseVideo">'+
				//'<source src="pageCover/media/instructionsPage.mp4" type="video/mp4" />'+
				'</video>').appendTo($(pageArr[pageIndex].pageId+"_recVideo"));
		}
		$("#playPauseVideo").get(0).src = '';
		$("#playPauseVideo").get(0).src = 'pageCover/media/instructionsPage.mp4';
		//$("#playPauseVideo")[0].pause();
		$("#playPauseVideo")[0].currentTime = 0;
		
		$(pageId+"_recVideo").show();
		$(pageId+"_imageChosen").hide();
		$(pageId+"_groupCredits").hide(); 
		
		$(pageId+"_previewApp_recBackground").css("border-bottom-right-radius","0px");
		$(pageId+"_previewApp_recBackground").css("border-bottom-right-radius","0px");
		$(pageId+"_previewApp_recBackground").css("border-bottom-left-radius","0px");
		$(pageId+"_previewApp_txtHeading").css("text-decoration", "none");
		//$(pageId+"_recVideo").show();
		$(pageId+"_previewApp_groupMain").animate({opacity: 1}, 1000);
		$(pageId+"_previewApp_groupClose").animate({opacity: 1}, 1000);
		//$(pageId+"_previewApp").draggable({     
		//						containment: $(pageId),
		//						stop: function( event, ui )
		//								{
		//									 $(pageId+"_previewApp_txtDragMe").hide();																
		//								}
		//				});

}


function closePreview(){
		var pageId = pageArr[pageIndex].pageId;
		$("#playPauseVideo")[0].pause();
		$("#playPauseVideo")[0].currentTime = 0;
		//========================
		
		$(pageId+"_bgImage").animate({opacity: 1}, 1000);
		
		//===================
				$(pageId+"_recVideo").hide();
				$(pageId+"_imageChosen").show();
				$(pageId+"_groupCredits").show();
				$(pageId+"_toolBarCover").show();
				//$(pageId+"_btnPreference").show();
				$("#Stage_toolBarCover").show();
				$(pageId+"_groupPlayPauseCover").show();
				$(pageId+"_txtThemeSong").show();
				$(pageId+"_previewApp_groupMain").hide();
				$(pageId+"_previewApp_recBackground").css("border-bottom-right-radius","10px");
				$(pageId+"_previewApp_recBackground").css("border-bottom-left-radius","10px");
				$(pageId+"_previewApp_txtHeading").css("text-decoration", "underline");
				$(pageId+"_previewApp_groupMain").animate({opacity: 0}, 1000);
				$(pageId+"_previewApp_groupClose").animate({opacity: 0}, 1000);
				$(pageId+"_previewApp_groupClose").hide();
				//$(pageId+"_recVideo").hide();
				$("#playPauseVideo")[0].pause();
				$("#playPauseVideo")[0].currentTime = 0;
				//$(pageId+"_previewApp").css({"position": "absolute",  "top" : "114px", "left": "20px"});
}

//===================================================
function deletePictureOkCancel(btnNum) {
  console.log("Entering deletePictureOkCancel");
  console.log("Button: " + btnNum);
  if (btnNum == 1) {
    removeFile(selfiePageArray[selfieIndex].pageName+"."+selfiePageArray[selfieIndex].fileExtension);
    selfiePageArray[selfieIndex].pictureExists = false;
		selfiePageArray[selfieIndex].fileExtension = "none";
		checkIfFileExists(selfiePageArray[selfieIndex].pageName+"Picture.m4a");
		$("#selfieAudio"+selfiePageArray[selfieIndex].pageName).attr("src", "");
    clearPageImage();
    preferencesPicturePageSetup(); //deletePictureOkCancel
    localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
  }
  console.log("Leaving deletePictureOkCancel");
}

var getFileSystemRoot = (function() {
    var root;
    // one-time retrieval of the root file system entry
    var init = function() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                root = fileSystem.root;
            },
            onFileError);
    };
    document.addEventListener("deviceready", init, true);
    // public function returns private root entry
    return function() {
        return root;
    };
}()); // execute immediately

function removeFile(fileName) {
    var root = getFileSystemRoot();
    var remove_file = function(entry) {
        entry.remove(function() {
            deletePictureNo();
        }, onFileError);	
    };
    root.getFile(fileName, {create: false}, remove_file, onFileError);
}

function updateSpeedSlidersText(){
        $("#Stage_preferences_preferencesRecord_dialogSpeed_txtAmt").text(preferencesArray[0].readingSpeed);
        $("#Stage_dialogSpeed_txtAmt").text(preferencesArray[0].readingSpeed);
    }

function preferencesPicturePageSetup() {
    if (selfiePageArray[selfieIndex].pictureExists === true){        
        $("#Stage_preferences_preferencesPicture_groupShowPicture").show();
        $("#Stage_preferences_preferencesPicture_groupPinchDragRotate").hide();
        $("#Stage_preferences_preferencesPicture_txtRecordInstructions").show();        
        showPictureOnPage();  //from preferencesPicturePageSetup
        if (selfiePageArray[selfieIndex].fromGallery === true){
                $("#Stage_preferences_preferencesPicture_groupDeletePicture").hide();
        }else{
            $("#Stage_preferences_preferencesPicture_groupDeletePicture").show();
            deletePictureNo();
        }                
    }else{
        $("#Stage_preferences_preferencesPicture_groupDeletePicture").hide();
        $("#Stage_preferences_preferencesPicture_groupShowPicture").hide();
        $("#thumbnailPicture").hide();
        $("#Stage_preferences_preferencesPicture_groupPinchDragRotate").show();
        $("#Stage_preferences_preferencesPicture_txtRecordInstructions").hide();
    }
}

function btnPreferences() {
		var pageName = pageArr[pageIndex].pageName;
    var pageType = pageArr[pageIndex].pageType;
		var pageId = pageArr[pageIndex].pageId;
    
		//$("#Stage_toolBar").hide();
		//$("#Stage_toolBar").css("z-index", "-1");
		
		$("#thumbnailPicture").height(selfiePageArray[selfieIndex].thumbHeight);
		$("#thumbnailPicture").width(selfiePageArray[selfieIndex].thumbWidth);
		if (selfiePageArray[selfieIndex].defaultTalkie === true){
								$("#Stage_preferences_preferencesPicture_groupPageDefault").show();
								$("#Stage_preferences_preferencesPicture_recPicBorder").css({ 'height': "280px" });
						}else{
								$("#Stage_preferences_preferencesPicture_groupPageDefault").hide();
								$("#Stage_preferences_preferencesPicture_recPicBorder").css({ 'height': "238px" });
					 }
		
		
		//============================================
		//setTimeout(function(){
        //$(pageId+"_toolBar_gearOverlay").css("background-color", "rgb(255,255,255,0.00)");
        //$(".imgSettings").show();
    //}, 500);
		
		
		//$(pageId+"_toolBar_gearOverlay").css("background-color", "rgb(179,139,201,0.25)");
		//============================================
		
		
		
    if (!$(".recordPlayStage")[0]){
        var recordingPlayingId = "#"+words.Sym.createChildSymbol("recordingPlaying", "Stage").getSymbolElement().attr("id");
        $(recordingPlayingId).addClass("recordPlayStage");
    }
    $(".recordPlayStage").css('opacity', '0');
    $(".recordPlayStage").css("z-index", "-1");
    $(".recordPlayStage").css({'position': 'absolute','top':'552px', 'left':'757px'});
    
    $(".btnToPreferencesSpeedSong").hide();
    $(".btnToPreferencesSpeedSong").css("z-index", "-1");
    var idPicture = "#thumbnailStage"+pageName;
    var imgStage = $(idPicture)[0];
    var src = imgStage.src;
    $("#thumbnailPicture").attr("src", src);
		$("#thumbnailPicture").show();

    console.log("picture events");
    
    preferencesPicturePageSetup();  //btnPreferences
    if (pageType === "picOnlySelfie") {
        words.Sym.getSymbol("preferences").play("menuPicture");
        $("#Stage_preferences").show();
        $("#Stage_preferences").css("z-index", "1");
        $(".groupNavNarration").hide();
    }else{
        $("#Stage_preferences_preferencesRecord_dialogSpeed_btnToPreferencesSpeed").hide();
        $("#Stage_preferences_preferencesRecord_dialogSpeed_groupSpeedMain").css({ opacity: 1 });
        showWordsBtnOnPage();
        showSlamBtnOnPage();
        showEspanolBtnOnPage();
        selfNarrate();
        wordsHighlighted();
        narrationPing();
        autoNarrate();
        $(".recRecordStopBG").css("background-color","rgb(97,138,96)");  //green
        btnOnOff("microphone", "microphoneGreen", "txtRecordStop", "recRecordStopBG");
        $(".txtRecordStop").text('Start');
        $("#Stage_preferences").show();
        $("#Stage_preferences").css("z-index", "1");
        words.Sym.getComposition().getStage().getSymbol("preferences").play("menu");
        $(".groupNavNarration").show();
        $("#sliderCtrl1").slider({
            value: preferencesArray[0].readingSpeed,
        });
        $("#sliderCtrl2").slider({
          value: preferencesArray[0].readingSpeed,
        });
        updateSpeedSlidersText();
    }
}

function btnOnOff(offImageYellow, onImageGreen, txtToColor, recToColor){
    var yellowRec = 'rgb(251, 237, 197)';
    offImageYellow = "." + offImageYellow;
    onImageGreen = "." + onImageGreen;
    txtToColor = "." + txtToColor;
    recToColor = "." + recToColor;
    if ($(recToColor).css('backgroundColor') == yellowRec) {
        $(offImageYellow).hide();
        $(onImageGreen).show();
        $(txtToColor).css("color", "rgb(255,255,255)");  //white
        $(recToColor).css("background", "rgb(97,138,96)");  //green
    }else{
        $(offImageYellow).show();
        $(onImageGreen).hide();
        $(txtToColor).css("color", "rgb(97,138,96)"); //green
        $(recToColor).css("background", "rgb(251,237,197)"); //yellow
    }
}

function moveSeekBar(videoDuration) {
    var pageName = pageArr[pageIndex].pageName;
    var pageId = pageArr[pageIndex].pageId;
    var scrubber = $(pageId+"_scrubber");
    //video length = 244
    //minScrubber = 121 (bar start)
    //scrubber max x = 871 (scrubber at end of bar)
    //scrubber max x - minScrubber
    //871 - 121 = 750
    //video position / video length = percent video
    //(percent video * 750) + 121 = scrubber left
    var vidTime = $(pageId+"_"+pageName)[0].currentTime;
    var vidPercent = vidTime/videoDuration;
    var scrubberLeft = (vidPercent * 750) + 121;
    scrubber.css('left', scrubberLeft);
    //scrubber.css('background-image', 'url("pageDiscussion/images/pageScrubber.jpg")');
}

function setDialogSeekBar(videoDuration) {
        var pageName = pageArr[pageIndex].pageName;
        var pageId = pageArr[pageIndex].pageId;
        //var pageName = pageArr[pageIndex].pageName;
        //var scrubber = sym.$("scrubber"); // Touch this to scrub the timeline of timelinePlay
        //var bar = sym.$("bar"); // Bar the scrubber follows
        //sym.$("mobileHit").hide(); // Added an extra invisible div to increase the hit region for mobile (hard to grab otherwise)
        
        var scrubber = $(pageId+"_scrubber"); // Touch this to scrub the timeline of timelinePlay
        var bar = $(pageId+"_bar"); // Bar the scrubber follows
        var mobileHit = $(pageId+"_mobileHit"); // Added an extra invisible div to increase the hit region for mobile (hard to grab otherwise)
        //var videoDuration = 244; //seconds
        //sym.$("mobileHit").hide(); // Added an extra invisible div to increase the hit region for mobile (hard to grab otherwise)
        mobileHit.hide();
        
        var dragme = false; // Set the initial dragme function to false
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) { 
         
              mobileHit.show(); // Show the extra invisible div to increase the hit region for mobile (hard to grab otherwise)
         
             $(function () {
         
                 scrubber.bind("touchstart", function (e) { // Enable the scrubber on touchstart
                     e.preventDefault(); // Cancels the default action of the mobile device - used to ensure our touch events are fired
                     dragme = true;
                     //$(pageId+"_"+pageName)[0].pause();
                 });
         
                 scrubber.bind("touchend", function (e) { // Disable the scrubber on touchend
                     e.preventDefault();
                     //sym.$("pageDiscussion")[0].currentTime = stopVideo;
                     //alert('touchend');
                     dragme = false;
                     //$(pageId+"_"+pageName)[0].play();
                     //sym.$("pageDiscussion")[0].currentTime = stopVideo;
                 });
         
                 scrubber.bind("touchmove", function (e) { // Make the magic happen on touchmove
                     if (dragme) {
                         var touch = e.originalEvent.touches[0]; 
                         var possibleX = touch.pageX;
                         var leftX = bar.offset().left; 
                         var rightX = (leftX + bar.width()) - scrubber.width();
                         var scrubWidth = rightX - leftX; 
         
         					// Confine the scrubber to the width of the bar
         
                         if (possibleX < leftX) {
                             possibleX = leftX;
                         }
                         
                         if (possibleX > rightX) {
                             possibleX = rightX;
                         }
         
                         //scrubber.offset({
                         //    left: possibleX
                         //});
         
                         var relativeX = possibleX - leftX;
                         //var stopVideo = Math.ceil((relativeX / scrubWidth) * videoDuration); // Make the scrubber scrub the video
                         var stopVideo = (relativeX / scrubWidth) * videoDuration; // Make the scrubber scrub the video
                         $(pageId+"_"+pageName)[0].currentTime = stopVideo;
                         
                         scrubber.offset({
                             left: possibleX
                         });
                         
                     }
                 });
             });
         }
         
         else $(function () {
         
             scrubber.mousedown(function () { // Enable the scrubber on mousedown
                 dragme = true;
                 $(pageId+"_"+pageName)[0].pause();
             });
             $(document).mouseup(function () { // Disable the scrubber on mouseup
                //sym.$("pageDiscussion")[0].currentTime = stopVideo;
                 //alert('mouseup');
                 dragme = false;
                 $(pageId+"_"+pageName)[0].play();
                 //sym.$("pageDiscussion")[0].currentTime = stopVideo;
             });
             $(document).mousemove(function (e) { // Make the magic happen on mousemove
                 if (dragme) {
                     var possibleX = e.pageX;
                     var leftX = bar.offset().left;
                     var rightX = (leftX + bar.width()) - scrubber.width();
                     var scrubWidth = rightX - leftX;
         
                     // Confine the scrubber to the width of the bar
                     //if (possibleX < leftX) {
                     //    possibleX = leftX;
                     //}
                     //
                     //if (possibleX > rightX) {
                     //    possibleX = rightX;
                     //}
         
                     scrubber.offset({
                         left: possibleX
                     });
         
                     var relativeX = possibleX - leftX;
                     var stopVideo = Math.ceil((relativeX / scrubWidth) * videoDuration); // Make the scrubber scrub the video
                     $(pageId+"_"+pageName)[0].currentTime = stopVideo;
                     
                     
                     
                     //sym.$("pageDiscussion")[0].currentTime = stopVideo;
                     //mySymbol.stop(stopTimeline); // Stop the timeline of timelinePlay when the scrubber is released
                     
                    //alert(stopVideo); 
                 }
                 //else{
                 //   sym.$("pageDiscussion")[0].currentTime = stopVideo;
                 //}
             });
         });
}

function setSlider(sliderLocation) {
    var mobileHit;
    var scrubber;
    var dialogSpeed;
         if (sliderLocation == "stage") {
            mobileHit = $("#Stage_dialogSpeed_slider_mobileHit");
            scrubber = $("#Stage_dialogSpeed_slider_scrubber");
            dialogSpeed = $("#Stage_dialogSpeed");
         }else{
            mobileHit = $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_mobileHit");
            scrubber = $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber");
            dialogSpeed = $("#Stage_preferences_preferencesRecord_dialogSpeed");
         }
         mobileHit.hide(); // Added an extra invisible div to increase the hit region for mobile (hard to grab otherwise)
         var dragme = false; // Set the initial dragme function to false
         var leftX;
         var rightX;
         var possibleX;
         // Detect if mobile device, and if so swap out mouse events for touch events. This is pretty much duplicated code with touch events swapped.
         if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {

             mobileHit.show();  // Show the extra invisible div to increase the hit region for mobile (hard to grab otherwise)

             $(function () {

                    scrubber.bind("touchstart", function (e) { // Enable the scrubber on touchstart
                    e.preventDefault(); // Cancels the default action of the mobile device - used to ensure our touch events are fired
                    dragme = true;
                 });

                    scrubber.bind("touchend", function (e) { // Disable the scrubber on touchend
                    e.preventDefault();
                    dragme = false;
                 });
                 scrubber.bind("touchmove", function (e) { // Make the magic happen on touchmove
                    if (dragme) {
                        var touch = e.originalEvent.touches[0];
                        var possibleX = touch.pageX;
                        leftX = dialogSpeed.offset().left;
                        leftX = leftX + 7;
                        rightX = leftX + 160;
                        if (possibleX < leftX) {
                           possibleX = leftX;
                        }else if (possibleX > rightX){
                           possibleX = rightX;
                        }
                        scrubber.offset({
                            left: possibleX
                        });
                    }
                    slidercommon(scrubber, possibleX, leftX, true);
                 });
             });
         }

         else $(function () {

             scrubber.mousedown(function () { // Enable the scrubber on mousedown
                 dragme = true;
             });
            

             $(document).mouseup(function () { // Disable the scrubber on mouseup
                 dragme = false;

             });
             $(document).mousemove(function (e) { // Make the magic happen on mousemove
                 if (dragme) {
                    possibleX = e.pageX;
                    leftX = dialogSpeed.offset().left;
                    leftX = leftX + 15;
                    rightX = leftX + 200;
                    if (possibleX < leftX) {
                       possibleX = leftX;
                    }else if (possibleX > rightX){
                       possibleX = rightX;
                    }

                    scrubber.offset({
                        left: possibleX
                    });
                    slidercommon(scrubber, possibleX, leftX, false);
                 }
             });
         });
}

function slidercommon(_scrubber, _possibleX, _leftX, _fromMobile) {
    var pageName = pageArr[pageIndex].pageName;
    var pageId = pageArr[pageIndex].pageId;
    if (pageArr[pageIndex].pageType == "songPage") {
        if (_fromMobile === true) {
            preferencesArray[0].readingSpeedSong = (_possibleX - _leftX)/80;
        }else{
            preferencesArray[0].readingSpeedSong = (_possibleX - _leftX)/100;
        }
        preferencesArray[0].readingSpeedSong = Math.round(preferencesArray[0].readingSpeedSong * 10 ) / 10;
        preferencesArray[0].sliderStageLeftSong = _scrubber.css("left");
        $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeftSong });
        $(".txtSpeedAmt").text(preferencesArray[0].readingSpeedSong);
        $(pageId+"_"+pageName)[0].playbackRate = preferencesArray[0].readingSpeedSong;
        if (pageArr[pageIndex].pageName == "pageSong") {
            $(pageId+"_pageCredits")[0].playbackRate = preferencesArray[0].readingSpeedSong;
        }
    }else{
        if (_fromMobile === true) {
            preferencesArray[0].readingSpeed = (_possibleX - _leftX)/80;
        }else{
            preferencesArray[0].readingSpeed = (_possibleX - _leftX)/100;
        }
        preferencesArray[0].readingSpeed = Math.round(preferencesArray[0].readingSpeed * 10 ) / 10;
        preferencesArray[0].sliderStageLeft = _scrubber.css("left");
        $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
        $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
        $(".txtSpeedAmt").text(preferencesArray[0].readingSpeed);
        $(pageId+"_"+pageName)[0].playbackRate = preferencesArray[0].readingSpeed;
        $("#selfieAudio"+pageName).get(0).playbackRate = preferencesArray[0].readingSpeed;
    }
    localStorage["preferences"] = JSON.stringify(preferencesArray);
}

function setToolBarOn(){
		var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    var pageType = pageArr[pageIndex].pageType;
		$("#Stage_toolBar").hide();
		$(pageId+"_toolBarCover").hide();
		$(pageId+"_toolBarGear").hide();
		//$("#Stage_toolBar").hide();
		//$("#Stage_toolBar").css("z-index", "-1");
		switch(pageType) {
    case 'songPage':
        $(pageId+"_toolBarGear").show();
        break;
    case 'selfie':
				if ($(".recordPlayStage").zIndex() == 1){
						$("#Stage_toolBar").hide();
						//$("#Stage_toolBar").css("z-index", "-1");
				}else{
						$("#Stage_toolBar").show();
						$("#Stage_toolBar").css("z-index", "1");
				}
				$("#Stage_toolBar_groupRead").hide();
				$("#Stage_toolBar_groupListen").show();
				$("#Stage_toolBar_groupEspanol_x").hide();
				//killPageWords();
				//var src = $(pageId+"_"+pageName).get(0).currentSrc;
				//console.log("source = " + src);
				//if (src === ""){
				//		$(pageId+"_"+pageName).get(0).src = pageName+"/media/"+pageName+".mp4";
				//		$(pageId+"_"+pageName).show();
				//}	
        break;
		case 'picOnlySelfie':
        if (pageName == "pageCover"){
						$(pageId+"_toolBarCover").show();
						//$(pageId+"_toolBarCover").css("z-index", "1");
						$(pageId+"_toolBarCover_groupThemeOff").hide();
						$(pageId+"_toolBarCover_groupThemeOn").show();
				}else{
						if ($(".recordPlayStage").zIndex() == 1){
								$(pageId+"_toolBarGear").hide();
								//$(pageId+"_toolBarGear").css("z-index", "-1");
						}else{						
								$(pageId+"_toolBarGear").show();
								//$(pageId+"_toolBarGear").css("z-index", "1");
						}
				}
        break;
    default:
        //alert("problem with setToolBarOn");
				//do nothing
		}
}

function setToolBarOff(){
		var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    var pageType = pageArr[pageIndex].pageType;
		stopTheAudio(pageId, pageName, pageIndex);
		//$("#Stage_toolBar").hide();
		//$("#Stage_toolBar").css("z-index", "-1");
		switch(pageType) {
    case 'songPage':
         $(pageId+"_toolBarGear").hide();
        break;
    case 'selfie':
				//stopTheAudio(pageId, pageName, pageIndex);
				$("#Stage_toolBar").hide();
				//killPageWords();
				//hidePageWords();
				//$("#Stage_toolBar").css("z-index", "-1");
        break;
		case 'picOnlySelfie':
				stopTheAudio(pageId, pageName, pageIndex);
        if (pageName == "pageCover"){
						$(pageId+"_toolBarCover").hide();
						//$(pageId+"_toolBarCover").css("z-index", "-1");
				}else{
						$(pageId+"_toolBarGear").hide();
						//$(pageId+"_toolBarGear").css("z-index", "-1");
				}
        break;
    default:
        //alert("problem with setToolBarOff");
				//do nothing
		}
}

function exitPreferences() {
    var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    var pageType = pageArr[pageIndex].pageType;
    var idPicture = "#thumbnailStage"+pageName;
		
    if (selfiePageArray[selfieIndex].showPicture === false) {
        $(idPicture).hide();
    }else{
        
        $(idPicture).show();
        moveDragImage();
    }

    if (pageType != "picOnlySelfie") {
        if (preferencesArray[0].readingSpeed != 1){        
            moveReadingSpeedToCorner();
        }
    }
      
    if (selfiePageArray[selfieIndex].dimensionsObtained === false){
        selfiePageArray[selfieIndex].dimensionsObtained = true;
        console.log("dimensionsObtained " + selfiePageArray[selfieIndex].dimensionsObtained );
        idPicture = "#thumbnailStage"+pageArr[pageIndex].pageName;
        var _width = parseInt($(idPicture).css('width'));
        var _height = parseInt($(idPicture).css('height'));
        selfiePageArray[selfieIndex].startWidth = _width;
        selfiePageArray[selfieIndex].startHeight = _height;
        selfiePageArray[selfieIndex].width = _width;
        selfiePageArray[selfieIndex].height = _height;
        //============================================
        var x = $(pageId+"_imageChosen").offset();
        selfiePageArray[selfieIndex].top = x.top;
        selfiePageArray[selfieIndex].left = x.left;
        localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
        console.log("picture width " + _width + " picture height " + _height);
    }
}


function slowNarration() {
    var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    preferencesArray[0].readingSpeed = 1;
    $(pageId+"_"+pageName)[0].playbackRate = preferencesArray[0].readingSpeed;
    $("#selfieAudio"+pageName).get(0).playbackRate = preferencesArray[0].readingSpeed;
    preferencesArray[0].sliderStageLeft = 100;
    $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
    $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
    $(".txtSpeedAmt").text(preferencesArray[0].readingSpeed);
    localStorage["preferences"] = JSON.stringify(preferencesArray);
}

function groupPreferencesButtonsDone() {
    setTimeout(function(){
        btnOnOff("checkButtonsDoneYellow", "checkButtonsDoneGreen", "txtButtonsDone", "recButtonsDone");
        words.Sym.getSymbol("preferences").play("menuDone");
        exitPreferences();
    }, 125);
    btnOnOff("checkButtonsDoneYellow", "checkButtonsDoneGreen", "txtButtonsDone", "recButtonsDone");
}

function groupButtonTitleOk() {
    setTimeout(function(){
        btnOnOff("checkButtonsDoneYellowTitle", "checkButtonsDoneGreenTitle", "txtButtonsOkTitle", "recButtonsDoneTitle");
        $(pageArr[pageIndex].pageId).show();
				$(titlePageId).hide();
    }, 125);
    btnOnOff("checkButtonsDoneYellowTitle", "checkButtonsDoneGreenTitle", "txtButtonsOkTitle", "recButtonsDoneTitle");
}

function galleryCancel() {
		setTimeout(function(){
            btnOnOff("deleteGalleryCancelYellow", "deleteGalleryCancelGreen", "txtGalleryCancel", "recGalleryCancel");
            $("#Stage_preferences").show();
            $(galleryPageId).hide();
						$(pageArr[pageIndex].pageId).show();												
    }, 125);
    btnOnOff("deleteGalleryCancelYellow", "deleteGalleryCancelGreen", "txtGalleryCancel", "recGalleryCancel");

}


function groupPreferencesAudioDone() {
    setTimeout(function(){
        btnOnOff("checkAudioDoneYellow", "checkAudioDoneGreen", "txtAudioDone", "recAudioDone");
        words.Sym.getSymbol("preferences").play("recordDone");
        exitPreferences();
    }, 125);
    btnOnOff("checkAudioDoneYellow", "checkAudioDoneGreen", "txtAudioDone", "recAudioDone");
}

function groupPreferencesPictureDone(setPageDefaults) {
    setTimeout(function(){
        btnOnOff("checkRecordDoneYellow", "checkRecordDoneGreen", "txtRecordDone", "recRecordDone");
        words.Sym.getSymbol("preferences").play("pictureDone");
        if (setPageDefaults == "multiple"){
						setMultiplePageDefaultImages();
				}else if (setPageDefaults == "single"){
						setSinglePageDefaultImages();
				}
				exitPreferences();
    }, 125);
    btnOnOff("checkRecordDoneYellow", "checkRecordDoneGreen", "txtRecordDone", "recRecordDone");
}

function tocBtn(clickText, normalText) {
    var pageId = pageArr[pageIndex].pageId;
    setTimeout(function(){
		$(pageId+"_txtTOC").css("color", normalText);
        TOC_FindPage("pageTOC");
    }, 125);
    $(pageId+"_txtTOC").css("color", clickText);
}

function linkBtn(clickText, normalText) {
    var pageId = pageArr[pageIndex].pageId;
    setTimeout(function(){
		$(pageId+"_txtLink").css("color", normalText);				
        var ref = cordova.InAppBrowser.open('http://mycomputerbooks.com/', '_blank', 'location=no');
    }, 125);
    $(pageId+"_txtLink").css("color", clickText);
}

function rateBtn(clickText, normalText) {
    var pageId = pageArr[pageIndex].pageId;
    setTimeout(function(){
		$(pageId+"_txtRating").css("color", normalText);
				appRating(true);
        //var ref = cordova.InAppBrowser.open('https://itunes.apple.com/us/app/ready-hen-reading-app/id1202614521?mt=8', '_blank', 'location=no');
				//var ref = cordova.InAppBrowser.open('itms-apps://itunes.apple.com/us/app/ready-hen-reading-app/id1202614521?mt=8', '_blank', 'location=no');
    }, 125);
    $(pageId+"_txtRating").css("color", clickText);
}

function creditsBtn(clickText, normalText) {
    var pageId = pageArr[pageIndex].pageId;
    setTimeout(function(){
		$(pageId+"_txtCredits").css("color", normalText);
        var count = pageLoadedArray.indexOf("pageTitle");
         if (count == -1){						
						pageLoadedArray.push("pageTitle");
						titlePageId = "#"+words.Sym.createChildSymbol("pageTitle", "Stage").getSymbolElement().attr("id");
						$(titlePageId).attr("desc","pageTitle");							
         } 				
         $(pageArr[pageIndex].pageId).hide();
         $(titlePageId).show();
    }, 125);
		//}, 250);
    $(pageId+"_txtCredits").css("color", clickText);
}

function showAnswers(clickText, normalText) {
    var pageId = pageArr[pageIndex].pageId;
    setTimeout(function(){
				$(pageId+"_txtShowAnswers").css("color", normalText);
				var textOpacity = $(pageId+"_groupAnswers").css("opacity");
				if(textOpacity === "0"){
						$(pageId+"_groupAnswers").animate({opacity: 1}, 1000);
						$(pageId+"_txtShowAnswers").text("Hide Answers");
				}else{
						$(pageId+"_groupAnswers").animate({opacity: 0}, 1000);
						$(pageId+"_txtShowAnswers").text("Show Answers");
				}
				$(pageId+"_txtShowAnswers").css("text-decoration", "underline");        
    }, 125);
    $(pageId+"_txtShowAnswers").css("color", clickText);
}

function setPageDefaultImages(){				
		pageName = selfiePageArray[selfieIndex].pageName;
		if (pageName == "pageCover"){
				 confirmPreMadeImages();
		}else{
				checkExistanceForSinglePreMadeImage();
				groupPreferencesPictureDone("single");
		}
}

function checkExistanceForMultiplePreMadeImages(){
		for (var x = 0; x < selfiePageArray.length; x++) {
				if (selfiePageArray[x].defaultTalkie === true){
						checkIfFileExists(selfiePageArray[x].pageName+".jpg");
						checkIfFileExists(selfiePageArray[x].pageName+".png");
						checkIfFileExists(selfiePageArray[x].pageName+"Picture.m4a");
				}
		}
}

function checkExistanceForSinglePreMadeImage(){
		checkIfFileExists(selfiePageArray[selfieIndex].pageName+".jpg");
		checkIfFileExists(selfiePageArray[selfieIndex].pageName+".png");
		checkIfFileExists(selfiePageArray[selfieIndex].pageName+"Picture.m4a");
}

function setSinglePageDefaultImages(){
		var imageHeight = 0;
		var imageWidth = 0;
				selfiePageArray[selfieIndex].angle = selfiePageArray[selfieIndex].talkieAngle;
				selfiePageArray[selfieIndex].height = selfiePageArray[selfieIndex].talkieHeight;
				selfiePageArray[selfieIndex].width = selfiePageArray[selfieIndex].talkieWidth;
				selfiePageArray[selfieIndex].left = selfiePageArray[selfieIndex].talkieLeft;
				selfiePageArray[selfieIndex].top = selfiePageArray[selfieIndex].talkieTop;
				selfiePageArray[selfieIndex].refreshTalkieAudio = true;
				imageHeight = selfiePageArray[selfieIndex].imageHeight;
				imageWidth = selfiePageArray[selfieIndex].imageWidth;
				if (imageHeight > imageWidth){
							factor = 254/imageHeight;
							thumbWidth = imageWidth*factor;
							selfiePageArray[selfieIndex].thumbHeight = 254;
							selfiePageArray[selfieIndex].thumbWidth = thumbWidth;
							}else{
									factor = 203/imageWidth;
									thumbHeight = imageHeight*factor;
									selfiePageArray[selfieIndex].thumbHeight = thumbHeight;
									selfiePageArray[selfieIndex].thumbWidth = 203;
					}
				selfiePageArray[selfieIndex].fileExtension = "png";
				selfiePageArray[selfieIndex].dimensionsObtained = true;
				selfiePageArray[selfieIndex].fromGallery = false;
				selfiePageArray[selfieIndex].showPicture = true;
				selfiePageArray[selfieIndex].pictureExists = true;
				selfiePageArray[selfieIndex].pictureNarrationExists = true;
				selfiePageArray[selfieIndex].moved = false;
				copyTalkies(pageName+"Picture.m4a");
				copyTalkies(pageName+".png");
				$("#thumbnailPicture").show();
				//words.Sym.getSymbol("preferences").play("pictureDone");
				localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
				setTimeout(function(){				
						getFilePicture(selfieIndex);
						manipulateImage();								
				}, 250);
}



function setMultiplePageDefaultImages(){
		var count = 0;
		var imageHeight = 0;
		var imageWidth = 0;
		for (var x = 0; x < selfiePageArray.length; x++) {
				if (selfiePageArray[x].defaultTalkie === true){
							pageName = selfiePageArray[x].pageName;
							selfiePageArray[x].angle = selfiePageArray[x].talkieAngle;
							selfiePageArray[x].height = selfiePageArray[x].talkieHeight;
							selfiePageArray[x].width = selfiePageArray[x].talkieWidth;
							selfiePageArray[x].left = selfiePageArray[x].talkieLeft;
							selfiePageArray[x].top = selfiePageArray[x].talkieTop;
							//================================
							imageHeight = selfiePageArray[x].imageHeight;
							imageWidth = selfiePageArray[x].imageWidth;
							if (imageHeight > imageWidth){
										factor = 254/imageHeight;
										thumbWidth = imageWidth*factor;
										selfiePageArray[x].thumbHeight = 254;
										selfiePageArray[x].thumbWidth = thumbWidth;
										}else{
												factor = 203/imageWidth;
												thumbHeight = imageHeight*factor;
												selfiePageArray[x].thumbHeight = thumbHeight;
												selfiePageArray[x].thumbWidth = 203;
								}
							selfiePageArray[x].fileExtension = "png";
							selfiePageArray[x].dimensionsObtained = true;
							selfiePageArray[x].fromGallery = false;
							selfiePageArray[x].showPicture = true;
							selfiePageArray[x].pictureExists = true;
							selfiePageArray[x].pictureNarrationExists = true;
							selfiePageArray[x].moved = false;
							copyTalkies(pageName+".png");
							copyTalkies(pageName+"Picture.m4a");
							count = pageLoadedArray.indexOf(selfiePageArray[x].pageName);
							if (count >=0){
										selfiePageArray[x].refreshTalkieAudio = true;
										if (selfiePageArray[x].pageName != "pageCover"){
												selfiePageArray[x].refreshTalkieImage = true;
										}
							}
				}		
		}
		localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
		
		setTimeout(function(){
				if (selfiePageArray[selfieIndex].defaultTalkie === true){
						getFilePicture(selfieIndex);
						manipulateImage();
				}

		}, 250);
		//words.Sym.getSymbol("preferences").play("pictureDone");
}


//========================== dialog speed ==============
function btnSpeedToCorner() {  //to corner on stage
    setTimeout(function(){
        btnOnOff("recSpeedToCornerYellow", "recSpeedToCornerGreen", "txtSpeedToCorner", "recSpeedToCornerBG");
        preferencesArray[0].showReadingSpeed = true;
        localStorage["preferences"] = JSON.stringify(preferencesArray);
        words.Sym.getSymbol("preferences").play("recordDone");
        $(".btnToPreferencesSpeed").show();
        $(".btnToPreferencesSpeed").css("z-index", "1");
        $(".btnToPreferencesSpeedSong").hide();
        $(".btnToPreferencesSpeedSong").css("z-index", "-1");
        $("#Stage_dialogSpeed").show();
        $("#Stage_dialogSpeed").css("z-index", "1");
        $("#Stage_dialogSpeed_groupSpeedMain").animate({opacity: 1}, 1000);
        setToolBarOn();
    }, 125);
    btnOnOff("recSpeedToCornerYellow", "recSpeedToCornerGreen", "txtSpeedToCorner", "recSpeedToCornerBG");
}

function moveReadingSpeedToCorner() {
    preferencesArray[0].showReadingSpeed = true;
    localStorage["preferences"] = JSON.stringify(preferencesArray);
    $(".btnToPreferencesSpeed").show();
    $(".btnToPreferencesSpeed").css("z-index", "1");
    $(".btnToPreferencesSpeedSong").hide();
    $(".btnToPreferencesSpeedSong").css("z-index", "-1");
    $("#Stage_dialogSpeed").show();
    $("#Stage_dialogSpeed").css("z-index", "1");
    $("#Stage_dialogSpeed_groupSpeedMain").animate({opacity: 1}, 1000);
}

function btnToPreferencesSpeed() {  //close corner on stage
    setTimeout(function(){
            btnOnOff("recToPreferencesSpeedYellow", "recToPreferencesSpeedGreen", "txtInvisibleSpeed", "recToPreferencesSpeedBG");
            preferencesArray[0].showReadingSpeed = false;
            localStorage["preferences"] = JSON.stringify(preferencesArray);
            $("#Stage_dialogSpeed_groupSpeedMain").animate({opacity: 0}, 1000);
        }, 125);
        btnOnOff("recToPreferencesSpeedYellow", "recToPreferencesSpeedGreen", "txtInvisibleSpeed", "recToPreferencesSpeedBG");
        slowNarration();  
}

function setStageOrder(element) {
    $("#Stage_preferences").hide();
    $("#Stage_preferences").css("z-index", "-1");
    $("#Stage_cameraRotate").hide();
    $("#Stage_cameraRotate").css("z-index", "-1");
    switch (element) {    
    case 'preferences':
        $("#Stage_preferences").show();
        $("#Stage_preferences").css("z-index", "1");
      break;
    case 'cameraRotate':
        $("#Stage_cameraRotate").show();
    	$("#Stage_cameraRotate").css("z-index", "1");  
      break;
    default:
      alert('unknown stage element');
  }
}


function btnToPreferencesSpeedSong() {
    setTimeout(function(){
        btnOnOff("recToPreferencesSpeedYellowSong", "recToPreferencesSpeedGreenSong", "txtInvisibleSpeedSong", "recToPreferencesSpeedBGSong");
        preferencesArray[0].showReadingSpeedSong = false;
        localStorage["preferences"] = JSON.stringify(preferencesArray);
        $("#Stage_dialogSpeed").show();
        $("#Stage_dialogSpeed").css("z-index", "1");
        $("#Stage_dialogSpeed_groupSpeedMain").animate({opacity: 0}, 1000);
    }, 125);
    btnOnOff("recToPreferencesSpeedYellowSong", "recToPreferencesSpeedGreenSong", "txtInvisibleSpeedSong", "recToPreferencesSpeedBGSong");
    var pageId = pageArr[pageIndex].pageId;
    var pageName = pageArr[pageIndex].pageName;
    //$(pageId+"_btnPreferenceSong").show();
		$(pageId+"_toolBarGear").show();
    preferencesArray[0].readingSpeedSong = 1;
    $(pageId+"_"+pageName)[0].playbackRate = preferencesArray[0].readingSpeedSong;
    preferencesArray[0].sliderStageLeft = 100;
    $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
    $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
    $(".txtSpeedAmt").text(preferencesArray[0].readingSpeedSong);
    localStorage["preferences"] = JSON.stringify(preferencesArray);
}

function setDialogSpeedPositionByName() {
    if (pageArr[pageIndex].pageName == "pageSong") {
        $("#Stage_dialogSpeed").css({'position': 'absolute','top':'606px', 'left':'753px'});
    }else if (pageArr[pageIndex].pageName == "pageDiscussion"){
        $("#Stage_dialogSpeed").css({'position': 'absolute','top':'32px', 'left':'718px'});
    }else if (pageArr[pageIndex].pageName == "page25") {
        $("#Stage_dialogSpeed").css({'position': 'absolute','top':'32px', 'left':'780px'});
    }else if (pageArr[pageIndex].pageName == "pageSingALong") {
        $("#Stage_dialogSpeed").css({'position': 'absolute','top':'604px', 'left':'85px'});
    }
}

function btnPreferencesSong() {
    //setTimeout(function(){
    //    $(".imgSettingsGreen").css('opacity', '0');
    //    $(".imgSettings").show();
    //    var pageId = pageArr[pageIndex].pageId;
    //    $(pageId+"_btnPreferenceSong").hide();
    //}, 250);
		var pageId = pageArr[pageIndex].pageId;
		$(pageId+"_toolBarGear").hide();
    //$(".imgSettingsGreen").css('opacity', '1');
    //$(".imgSettings").hide();
    $(".btnToPreferencesSpeed").hide();
    $(".btnToPreferencesSpeed").css("z-index", "-1");
    $(".btnToPreferencesSpeedSong").show();
    $(".btnToPreferencesSpeedSong").css("z-index", "1");
    setDialogSpeedPositionByName();
    $("#Stage_dialogSpeed").show();
    $("#Stage_dialogSpeed").css("z-index", "1");
    $("#Stage_dialogSpeed_groupSpeedMain").animate({opacity: 1}, 1000);
    preferencesArray[0].showReadingSpeedSong = true;
    localStorage["preferences"] = JSON.stringify(preferencesArray);

}

function fillGallery() {
       var gallery01 = $('<div class="verticaDiv" id="gallery01">'+
               '<div class="verticaWrapper">'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">One</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="100" src="gallery/one/madBull.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="100" src="gallery/one/goat.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="92" height="100" src="gallery/one/alligatorSmug.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="80" height="100" src="gallery/one/shoes.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="78" src="gallery/one/alligatorWalking.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="80" src="gallery/one/bookworm.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="71" height="100" src="gallery/one/squirrel.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="97" src="gallery/one/ape.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="83" src="gallery/one/angryDirt.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="99" src="gallery/one/angryBull.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="75" src="gallery/one/angryBull2.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="77" src="gallery/one/angryBull3.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="69" height="100" src="gallery/one/angryBull4.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="99" src="gallery/one/abull.png"/></div>'+                                                                            
                                       '<div class="swiper-slide picture-slide"><img width="100" height="73" src="gallery/one/grayBull.png"/></div>'+                                    
                                       '<div class="swiper-slide picture-slide"><img width="80" height="100" src="gallery/one/dog01.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="60" src="gallery/one/dynamite.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="89" src="gallery/one/appleMad.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="86" src="gallery/one/eatMe.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="77" src="gallery/one/burger.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="67" src="gallery/one/hotdog.png"/></div>'+                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="80" src="gallery/one/donkey.png"/></div>'+
																		   '<div class="swiper-slide picture-slide"><img width="88" height="80" src="gallery/one/thing.png"/></div>'+									  
                                       '<div class="swiper-slide picture-slide"><img width="94" height="100" src="gallery/one/dragon.png"/></div>'+																			 
																			 '<div class="swiper-slide picture-slide"><img width="83" height="100" src="gallery/one/dragon01.png"/></div>'+																			 
																			 '<div class="swiper-slide picture-slide"><img width="63" height="100" src="gallery/one/dragon02.png"/></div>'+																			 
																			 '<div class="swiper-slide picture-slide"><img width="100" height="89" src="gallery/one/dragon03.png"/></div>'+																			 
																		   '<div class="swiper-slide picture-slide"><img width="83" height="100" src="gallery/one/tyran.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="75" height="100" src="gallery/one/lion.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="50" src="gallery/one/snake01.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="24" src="gallery/one/snake02.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="69" height="100" src="gallery/one/lion02.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="54" src="gallery/one/tiger.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="74" src="gallery/one/duck.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="68" height="100" src="gallery/one/farmer.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="87" height="100" src="gallery/one/flyingHorse.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="60" src="gallery/one/Foxx.png"/></div>'+                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="82" src="gallery/one/macaw.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="89" src="gallery/one/cat-face.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="94" src="gallery/one/tiger02.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="72" height="100" src="gallery/one/monkey.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="50" height="100" src="gallery/one/brownBear.png"/></div>'+
																		   '<div class="swiper-slide picture-slide"><img width="79" height="100" src="gallery/one/elephant.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="94" height="100" src="gallery/one/ant.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="90" height="100" src="gallery/one/birds.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="75" src="gallery/one/birds02.png"/></div>'+
																		   '<div class="swiper-slide picture-slide"><img width="100" height="69" src="gallery/one/birdblue.png"/></div>'+										 
																		   '<div class="swiper-slide picture-slide"><img width="100" height="86" src="gallery/one/goose.png"/></div>'+										 
																		   '<div class="swiper-slide picture-slide"><img width="100" height="44" src="gallery/one/geese.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="79" src="gallery/one/geese02.png"/></div>'+                                                                              									
                                       '<div class="swiper-slide picture-slide"><img width="100" height="50" src="gallery/one/stork.png"/></div>'+                                    
                                       '<div class="swiper-slide picture-slide"><img width="90" height="100" src="gallery/one/duck01.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="42" src="gallery/one/owl.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="76" src="gallery/one/fhorse.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="70" src="gallery/one/unicorn.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="92" height="100" src="gallery/one/zebra.png"/></div>'+
                               '</div>'+
                       '</div>'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">Two</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+
                                        '<div class="swiper-slide picture-slide"><img width="70" height="100" src="gallery/two/smilesWorm.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="82" height="100" src="gallery/two/dancingBear.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="93" src="gallery/two/racoon.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="85" height="100" src="gallery/two/dancingRino.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="75" src="gallery/two/jumpingDog.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="90" height="100" src="gallery/two/wtfCow.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="69" height="100" src="gallery/two/cowWithBell.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="90" src="gallery/two/cowWithBell02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="99" height="100" src="gallery/two/bustedCat.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="79" height="100" src="gallery/two/glassesCat.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="94" height="100" src="gallery/two/parrot.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="71" src="gallery/two/cat01.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="59" height="100" src="gallery/two/goose.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="93" height="100" src="gallery/two/kangaroo.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="72" height="100" src="gallery/two/owl.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="70" height="100" src="gallery/two/penguin.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="93" src="gallery/two/penguin02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="74" src="gallery/two/caterpillar.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="87" src="gallery/two/cherry.png"/></div>'+                                        
                                        '<div class="swiper-slide picture-slide"><img width="100" height="40" src="gallery/two/chicksWorm.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="61" src="gallery/two/chicks01.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="75" src="gallery/two/duckling.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="83" height="100" src="gallery/two/duck.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="98" height="100" src="gallery/two/iris.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="85" height="100" src="gallery/two/scarecrow.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="69" src="gallery/two/beaver01.png"/></div>'+                                      
                                        '<div class="swiper-slide picture-slide"><img width="81" height="100" src="gallery/two/smiley.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="97" height="100" src="gallery/two/beeRose.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="63" src="gallery/two/beeLayBack.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="78" src="gallery/two/beeFed.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="86" height="100" src="gallery/two/beeSting.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="90" height="100" src="gallery/two/firefly.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="96" src="gallery/two/beeHappy.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="97" src="gallery/two/beeAngry.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="80" height="100" src="gallery/two/beeHoney.png"/></div>'+                                      
                                        '<div class="swiper-slide picture-slide"><img width="97" height="100" src="gallery/two/smiley2.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="89" src="gallery/two/what.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="93" height="100" src="gallery/two/heat.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="75" height="100" src="gallery/two/swanna.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="100" src="gallery/two/bat.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="93" src="gallery/two/spider.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="76" src="gallery/two/stinger.png"/></div>'+
                                        
                                                                           
                                        '<div class="swiper-slide picture-slide"><img width="100" height="95" src="gallery/two/sheep01.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="80" src="gallery/two/sheep.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="67" height="100" src="gallery/two/horse01.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="80" src="gallery/two/horse02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="82" height="100" src="gallery/two/reindeer.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="80" src="gallery/two/flower.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="69" src="gallery/two/flower02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="63" height="100" src="gallery/two/flower03.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="82" src="gallery/two/gnome.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="82" src="gallery/two/happy.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="59" height="100" src="gallery/two/trumpet.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="71" height="100" src="gallery/two/violinist.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="80" src="gallery/two/lion.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="65" height="100" src="gallery/two/pumpkin01.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="79" height="100" src="gallery/two/pumpkin02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="78" src="gallery/two/earthworm.png"/></div>'+
                               '</div>'+
                       '</div>'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">Three</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+    
									   '<div class="swiper-slide picture-slide"><img width="100" height="64" src="gallery/three/hiplane.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="55" src="gallery/three/plane03.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="68" src="gallery/three/pilot.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="81" src="gallery/three/cartoon-bee.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="81" src="gallery/three/bat01.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="94" height="100" src="gallery/three/birdDance.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="85" src="gallery/three/seagull.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="50" height="100" src="gallery/three/magpie.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="56" height="100" src="gallery/three/birdMad.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="63" height="100" src="gallery/three/balloonBasket.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="75" height="100" src="gallery/three/donkeyHole.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="91" src="gallery/three/birdSing.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="99" src="gallery/three/hen.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="93" height="100" src="gallery/three/birdInFrame.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="68" height="100" src="gallery/three/birdPunching.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="100" height="82" src="gallery/three/bee.png"/></div>'+    
                                       '<div class="swiper-slide picture-slide"><img width="100" height="86" src="gallery/three/funny.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="97" height="100" src="gallery/three/housefly.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="100" height="94" src="gallery/three/wierdbug.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="55" src="gallery/three/happy.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="100" height="50" src="gallery/three/blueTar.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="79" height="100" src="gallery/three/rocket.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="27" height="100" src="gallery/three/rocket02.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="85" height="100" src="gallery/three/rocket03.png"/></div>'+
																			 
																			 '<div class="swiper-slide picture-slide"><img width="100" height="71" src="gallery/three/saucer.png"/></div>'+																			 
                                       '<div class="swiper-slide picture-slide"><img width="65" height="100" src="gallery/three/kite.png"/></div>'+
																			 
                                       '<div class="swiper-slide picture-slide"><img width="100" height="69" src="gallery/three/plane.png"/></div>'+
																			 
                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="40" src="gallery/three/plane02.png"/></div>'+
                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="31" src="gallery/three/clause.png"/></div>'+
																			 '<div class="swiper-slide picture-slide"><img width="99" height="100" src="gallery/three/santaReinDeer.png"/></div>'+																			 
																		                                      
																			 '<div class="swiper-slide picture-slide"><img width="100" height="69" src="gallery/three/copter.png"/></div>'+
                                       
                                       '<div class="swiper-slide picture-slide"><img width="96" height="100" src="gallery/three/cloud.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="41" src="gallery/three/cloud02.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="54" src="gallery/three/cloud03.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="57" src="gallery/three/rainbow.png"/></div>'+
																		   '<div class="swiper-slide picture-slide"><img width="100" height="70" src="gallery/three/moonread.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="79" src="gallery/three/female.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="76" src="gallery/three/night.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="77" src="gallery/three/rain.png"/></div>'+
																		   
                                       '<div class="swiper-slide picture-slide"><img width="100" height="72" src="gallery/three/lightning.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="83" src="gallery/three/cloudy.png"/></div>'+                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="90" src="gallery/three/sun01.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="73" src="gallery/three/sun02.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="90" src="gallery/three/sun03.png"/></div>'+ 
																			 '<div class="swiper-slide picture-slide"><img width="100" height="73" src="gallery/three/sunBird.png"/></div>'+   	 
																		   '<div class="swiper-slide picture-slide"><img width="100" height="67" src="gallery/three/snow.png"/></div>'+
																		   '<div class="swiper-slide picture-slide"><img width="100" height="89" src="gallery/three/thunder.png"/></div>'+										 
																		  										 
                                       '<div class="swiper-slide picture-slide"><img width="100" height="50" src="gallery/three/planet.png"/></div>'+                                      
																		   '<div class="swiper-slide picture-slide"><img width="100" height="58" src="gallery/three/bcloud.png"/></div>'+
																		   '<div class="swiper-slide picture-slide"><img width="100" height="96" src="gallery/three/wind.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="79" src="gallery/three/moon.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="96" src="gallery/three/moon02.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="97" src="gallery/three/sleep.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="50" src="gallery/three/smiley.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="60" src="gallery/three/facial.png"/></div>'+
                               '</div>'+
                       '</div>'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">Four</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+
                                        '<div class="swiper-slide picture-slide"><img width="98" height="100" src="gallery/four/puppyScared.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="64" src="gallery/four/running-pig.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="82" height="100" src="gallery/four/dogBall.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="96" height="100" src="gallery/four/dogHappy.png"/></div>'+
																				
																				'<div class="swiper-slide picture-slide"><img width="100" height="99" src="gallery/four/dog2.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="72" height="100" src="gallery/four/graydog.png"/></div>'+    
																				
																				'<div class="swiper-slide picture-slide"><img width="100" height="98" src="gallery/four/dogSlanted.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="71" height="100" src="gallery/four/dog.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="100" height="74" src="gallery/four/dog03.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="90" height="100" src="gallery/four/tiger.png"/></div>'+                                      
                                        '<div class="swiper-slide picture-slide"><img width="80" height="100" src="gallery/four/rabbit.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="90" src="gallery/four/racoon.png"/></div>'+                                      
                                        '<div class="swiper-slide picture-slide"><img width="99" height="100" src="gallery/four/boo.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="65" height="100" src="gallery/four/afraidWolf.png"/></div>'+																				
																				'<div class="swiper-slide picture-slide"><img width="100" height="37" src="gallery/four/foxSneeky.png"/></div>'+   																				
                                        '<div class="swiper-slide picture-slide"><img width="94" height="100" src="gallery/four/burro.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="64" height="100" src="gallery/four/burroDance.png"/></div>'+                                     
                                        '<div class="swiper-slide picture-slide"><img width="100" height="87" src="gallery/four/puppy.png"/></div>'+                                       
                                        '<div class="swiper-slide picture-slide"><img width="73" height="100" src="gallery/four/monkeySad.png"/></div>'+
																				
																				'<div class="swiper-slide picture-slide"><img width="99" height="100" src="gallery/four/donkeyDope.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="92" height="100" src="gallery/four/donkeyHead.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="56" height="100" src="gallery/four/birdHead.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="85" height="100" src="gallery/four/elephant.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="96" height="100" src="gallery/four/elephant01.png"/></div>'+
                                        
                                        '<div class="swiper-slide picture-slide"><img width="100" height="93" src="gallery/four/mushroom.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="50" height="100" src="gallery/four/oldLady.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="63" height="100" src="gallery/four/cow.png"/></div>'+	
																				'<div class="swiper-slide picture-slide"><img width="81" height="100" src="gallery/four/turkey.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="86" src="gallery/four/lemur.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="82" height="100" src="gallery/four/hedgehog.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="98" height="100" src="gallery/four/catScared.png"/></div>'+																				
																				'<div class="swiper-slide picture-slide"><img width="100" height="91" src="gallery/four/antMound.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="100" height="89" src="gallery/four/catSitting.png"/></div>'+																				
																				'<div class="swiper-slide picture-slide"><img width="100" height="73" src="gallery/four/hippo.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="87" height="100" src="gallery/four/geese.png"/></div>'+																				
																				'<div class="swiper-slide picture-slide"><img width="81" height="100" src="gallery/four/rat.png"/></div>'+																				
																				'<div class="swiper-slide picture-slide"><img width="74" height="100" src="gallery/four/spider.png"/></div>'+																				
																				'<div class="swiper-slide picture-slide"><img width="100" height="52" src="gallery/four/snail.png"/></div>'+																																				
                                        '<div class="swiper-slide picture-slide"><img width="100" height="52" src="gallery/four/beaver.png"/></div>'+																				
                                        '<div class="swiper-slide picture-slide"><img width="70" height="100" src="gallery/four/flower.png"/></div>'+																				
                                        '<div class="swiper-slide picture-slide"><img width="76" height="100" src="gallery/four/monkeyBoy.png"/></div>'+		
																				
                                        '<div class="swiper-slide picture-slide"><img width="100" height="69" src="gallery/four/reptile.png"/></div>'+                                                                            
                                        '<div class="swiper-slide picture-slide"><img width="78" height="100" src="gallery/four/extraT.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="78" height="100" src="gallery/four/angryAllien.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="86" height="100" src="gallery/four/dressup.png"/></div>'+         
                                        '<div class="swiper-slide picture-slide"><img width="51" height="100" src="gallery/four/alien01.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="92" src="gallery/four/alien02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="57" height="100" src="gallery/four/frogAlien.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="69" height="100" src="gallery/four/monster.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="100" src="gallery/four/monster02.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="78" height="100" src="gallery/four/hungryWorm.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="86" height="100" src="gallery/four/greenFrog.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="100" src="gallery/four/steamHead.png"/></div>'+
																				'<div class="swiper-slide picture-slide"><img width="80" height="100" src="gallery/four/frogPirate.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="69" height="100" src="gallery/four/girlElf.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="91" height="100" src="gallery/four/magic.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="84" src="gallery/four/germ.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="92" height="100" src="gallery/four/ghost.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="66" src="gallery/four/witch.png"/></div>'+																																						
                                        '<div class="swiper-slide picture-slide"><img width="86" height="100" src="gallery/four/frog.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="91" height="100" src="gallery/four/black_cat.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="100" src="gallery/four/eyes.png"/></div>'+
																				
                                        																		
                                        '<div class="swiper-slide picture-slide"><img width="100" height="61" src="gallery/four/birthday.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="96" src="gallery/four/happy-b.png"/></div>'+
                               '</div>'+
                       '</div>'+                    
               '</div>'+
               
       '</div>');//miscPageId
       //gallery01.appendTo("#Stage_gallery_recNavigator");
			 gallery01.appendTo(galleryPageId+"_recNavigator");
       //=====================================
        var gallery02 = $('<div class="verticaDiv" id="gallery02">'+
               '<div class="verticaWrapper">'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">One</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="90" src="galleryBlobs/one/blob-sitting-on-a-wooden-bench-feet-dangling.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="84" src="galleryBlobs/one/blob-in-love.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="85" src="galleryBlobs/one/blob-hairy-waving.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="69" height="100" src="galleryBlobs/one/blob-happy-that-the-sun-is-shining.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="95" src="galleryBlobs/one/blob-orange-smiling.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="94" height="100" src="galleryBlobs/one/blob-huge-grin.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="92" src="galleryBlobs/one/blob-hungry-with-food-sign.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="94" height="100" src="galleryBlobs/one/blob-eating-an-apple.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="94" height="100" src="galleryBlobs/one/blob-smiling-eyes-closed-thinking-happy-thoughts.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="79" src="galleryBlobs/one/blob-playing-peek-a-boo.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="63" src="galleryBlobs/one/blob-smiling-with-open-arms.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="69" height="84" src="galleryBlobs/one/blob-reading-note.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="71" src="galleryBlobs/one/blob-talking-animatedly.png"/></div>'+                                                                            
                                       '<div class="swiper-slide picture-slide"><img width="100" height="59" src="galleryBlobs/one/blob-crazy-grin.png"/></div>'+                                    
                                       '<div class="swiper-slide picture-slide"><img width="100" height="83" src="galleryBlobs/one/blob-hands-on-hips.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="100" src="galleryBlobs/one/blob-laughing.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="100" src="galleryBlobs/one/blob-looking-sleepy-but-happy.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="72" src="galleryBlobs/one/blob-looking-for-something-clipart.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="59" height="100" src="galleryBlobs/one/blob-pointing-at-itself.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="79" src="galleryBlobs/one/blob-playing-a-flute.png"/></div>'+                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="82" src="galleryBlobs/one/blob-telling-its-story-with-pictures.png"/></div>'+
									   '<div class="swiper-slide picture-slide"><img width="94" height="100" src="galleryBlobs/one/blob-sees-that-the-future-is-bright.png"/></div>'+									  
                                       '<div class="swiper-slide picture-slide"><img width="100" height="61" src="galleryBlobs/one/blob-holding-up-an-important-piece-of-paper.png"/></div>'+
									   '<div class="swiper-slide picture-slide"><img width="100" height="84" src="galleryBlobs/one/blob-waving-newspaper.png"/></div>'+
									   '<div class="swiper-slide picture-slide"><img width="100" height="72" src="galleryBlobs/one/blob-holding-up-a-thank-you-sign.png"/></div>'+
									   '<div class="swiper-slide picture-slide"><img width="82" height="100" src="galleryBlobs/one/blob-reading-a-large-poster-notice.png"/></div>'+
									   '<div class="swiper-slide picture-slide"><img width="100" height="93" src="galleryBlobs/one/blob-making-a-phone-call.png"/></div>'+
									   '<div class="swiper-slide picture-slide"><img width="100" height="79" src="galleryBlobs/one/blob-listening-to-someone-on-mobile-phone.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="84" height="100" src="galleryBlobs/one/blob-ghost.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="59" height="100" src="galleryBlobs/one/blob-santa-sitting-on-a-big-christmas-present.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="55" src="galleryBlobs/one/blob-remember-to-brush-your-teeth.png"/></div>'+                                                                   
                               '</div>'+
                       '</div>'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">Two</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="84" src="galleryBlobs/two/blob-excited-about-something.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="44" src="galleryBlobs/two/blob-beckoning-and-gesturing.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="93" src="galleryBlobs/two/blob-on-the-run.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="51" src="galleryBlobs/two/blob-gritting-teeth-arms-wide.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="54" src="galleryBlobs/two/blob-looking-stressed-arms-wide.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="48" src="galleryBlobs/two/blob-worried-chewing-nails-and-sweating.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="100" src="galleryBlobs/two/blob-big-eyes-and-sharp-teeth.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="78" src="galleryBlobs/two/blob-pointing-to-something.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="65" src="galleryBlobs/two/blob-squashed.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="71" src="galleryBlobs/two/blob-worried-clasping-hands.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="70" src="galleryBlobs/two/blob-about-to-push-a-button.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="55" src="galleryBlobs/two/blobtoon-mr-and-mrs-pacman.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="55" height="100" src="galleryBlobs/two/blob-tall-and-thin-shouting-to-be-heard.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="96" src="galleryBlobs/two/blob-shouting-for-attention.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="93" height="100" src="galleryBlobs/two/blob-hands-up-in-the-air-tongue.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="80" src="galleryBlobs/two/blob-frightened.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="89" height="100" src="galleryBlobs/two/blob-waving-hands-in-air.png"/></div>'+                                        
                               '</div>'+
                       '</div>'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">Three</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+    
									   '<div class="swiper-slide picture-slide"><img width="100" height="50" src="galleryBlobs/three/blobs-comforting-one-another.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="84" src="galleryBlobs/three/blob-looking-sad-and-lonely.png"/></div>'+
                                       
                                       '<div class="swiper-slide picture-slide"><img width="100" height="81" src="galleryBlobs/three/blob-grins-while-looking-very-tired.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="88" src="galleryBlobs/three/blob-bucktoothed.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="69" src="galleryBlobs/three/blob-bent-over-holding-head-in-hands.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="94" src="galleryBlobs/three/blob-ill-with-doctors-letter.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="46" src="galleryBlobs/three/blob-looking-overwhelmed.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="100" height="90" src="galleryBlobs/three/blob-with-magnifying-glass.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="85" src="galleryBlobs/three/blob-reading-a-paper.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="85" src="galleryBlobs/three/blob-unhappy.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="60" src="galleryBlobs/three/blob-depressed.png"/></div>'+
									   
                               '</div>'+
                       '</div>'+
                       '<span style="font-size: 25px; font-family: Times New Roman color: #000000;">Four</span>'+
                       '<div class="swiper-horizontal">'+  
                               '<div class="swiper-wrapper">'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="84" src="galleryBlobs/four/blob-pulling-hair-out-in-desperation.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="64" src="galleryBlobs/four/blob-shouting-in-anger.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="100" height="75" src="galleryBlobs/four/blob-gritting-teeth-and-shaking-fists-in-anger.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="86" height="100" src="galleryBlobs/four/blob-angry-snarling.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="89" height="100" src="galleryBlobs/four/blob-gritting-teeth.png"/></div>'+                                      
                                        '<div class="swiper-slide picture-slide"><img width="100" height="94" src="galleryBlobs/four/blob-block-monster-with-sharp-teeth.png"/></div>'+
                                        '<div class="swiper-slide picture-slide"><img width="99" height="100" src="galleryBlobs/four/blob-what-do-i-do-now.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="100" height="69" src="galleryBlobs/four/blob-with-pencil-moustache-and-goatee.png"/></div>'+
                                       '<div class="swiper-slide picture-slide"><img width="100" height="79" src="galleryBlobs/four/blob-looking-defeated.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="100" height="92" src="galleryBlobs/four/blob-miserable.png"/></div>'+                                      
                                       '<div class="swiper-slide picture-slide"><img width="100" height="100" src="galleryBlobs/four/blob-looking-sad.png"/></div>'+
                               '</div>'+
                       '</div>'+                    
               '</div>'+
               
       '</div>');
       //gallery02.appendTo("#Stage_gallery_recNavigator");
       gallery02.appendTo(galleryPageId+"_recNavigator");
     
		   
       
    $('div.picture-slide').on('click', function(){
            var pageId = pageArr[pageIndex].pageId;
            var pageName = pageArr[pageIndex].pageName;
            var idPicture = "#thumbnailStage"+pageName;
						var factor = 0;
            clearPageImage(); 
            var imgSrc = $(this).children('img').attr('src');
            var imgStudio = $('#thumbnailPicture')[0];
            imgStudio.src = imgSrc;
            $("#thumbnailPicture").show();
            $(idPicture).attr("src",imgSrc);
						//======================
						var imageWidth = $(this).children('img').prop('naturalWidth');
						var imageHeight = $(this).children('img').prop('naturalHeight');						
						setThumbnailPicture(imageHeight, imageWidth);
						$("#thumbnailPicture").height(selfiePageArray[selfieIndex].thumbHeight);
						$("#thumbnailPicture").width(selfiePageArray[selfieIndex].thumbWidth);
						
						
						
						
            
						//$(idPicture).width(203);
            selfiePageArray[selfieIndex].showPicture = true;           
            selfiePageArray[selfieIndex].dimensionsObtained = false;
            selfiePageArray[selfieIndex].pictureExists = true;
            selfiePageArray[selfieIndex].fromGallery = true;
            preferencesPicturePageSetup();  //fillGallery
            selfiePageArray[selfieIndex].galleryImage = imgSrc;
            localStorage["selfieDetail"] = JSON.stringify(selfiePageArray);
            $("#Stage_preferences").show();
            //$("#Stage_preferences").css("z-index", "1");
            $(galleryPageId).hide();
						$(pageArr[pageIndex].pageId).show();
						//if (pageArr[pageIndex].pageType == "selfie"){
						//		$("#Stage_groupSwipe").show();
						//}
                     
            
    });
    
		
    var swiperHorizontal = new Swiper('.swiper-horizontal', {
           pagination: '.swiper-pagination',
           slidesPerView: 9,
           paginationClickable: true,
           spaceBetween: 2,
           freeMode: true
					 //grabCursor: true
    });

    var swiper = new Swiper('.verticaDiv', {
            paginationClickable: true,
            direction: 'vertical'
    });
    
}

function setThumbnailPicture(imageHeight, imageWidth){
				var pageName = pageArr[pageIndex].pageName;
        var idPicture = "#thumbnailStage"+pageName;
				var factor = 0;
				var thumbWidth = 0;
				var thumbHeight = 0;
				if (imageHeight > imageWidth){
								$(idPicture).height(254);								
								factor = 254/imageHeight;
								thumbWidth = imageWidth*factor;
								selfiePageArray[selfieIndex].thumbHeight = 254;
								selfiePageArray[selfieIndex].thumbWidth = thumbWidth;
						}else{
								$(idPicture).width(203);
								factor = 203/imageWidth;
								thumbHeight = imageHeight*factor;
								selfiePageArray[selfieIndex].thumbHeight = thumbHeight;
								selfiePageArray[selfieIndex].thumbWidth = 203;
						}
		}

//===========================



(function($){
    
      $.fn.ctrl = function(key, callback) {

    	if (!$.isArray(key)) {
           key = [key];
        }
    	callback = callback || function(){ return false; }
        return $(this).keydown(function(e) {

    		$.each(key,function(i,k){
    			if(e.keyCode == k.toUpperCase().charCodeAt(0) && e.ctrlKey) {
    				return callback(e);
    			}
    		});
    		return true;
        });
    };
    
    
    $.fn.disableSelection = function() {

    	this.ctrl(['a','s','c']);

        return this.attr('unselectable', 'on')
                   .css({'-moz-user-select':'-moz-none',
                         //'-moz-user-select':'none',
    					 '-o-user-select':'none',
    					 '-khtml-user-select':'none',
    					 '-webkit-user-select':'none',
    					 '-ms-user-select':'none',
    					 'user-select':'none'})
    	           .bind('selectstart', function(){ return false; });
    };
    
    })(jQuery);


function selectPictureMenu(){
        //$(".btnMenuPicture").click(function() {
            setTimeout(function(){
               btnOnOff("pictureMenuYellow", "pictureMenuGreen", "txtMenuPicture", "recMenuPicture");
               words.Sym.getSymbol("preferences").play("menuPicture");
            }, 125);
            btnOnOff("pictureMenuYellow", "pictureMenuGreen", "txtMenuPicture", "recMenuPicture");
			//$("#Stage_preferences_preferencesPicture_groupWebPicDirections").hide();
			//$("#Stage_preferences_preferencesPicture_groupWebPicDirections").css("z-index", "-1");
        //});		
    }

/************************************************************/
function compReadyPreferences(){
    
    
    console.log("Entering compReadyPreferences");
    $(':not(input,select,textarea)').disableSelection();
    
    
    setSlider("stage");
    setSlider("preferences");
		
    //$("#Stage_RoundRect").css("z-index", "1");
    //$("#Stage_RoundRect").show();


    //$("#Stage_RoundRectCopy").css("z-index", "1");
    //$("#Stage_RoundRectCopy").show();

    $(".pageSong_imgWords").addClass("bgImage");
    $(".pageSong").addClass("bgImage");


    $('<audio id="ping">'+
    '<source src="media/ping.mp3" type="audio/mp3" />'+
    '</audio>').appendTo("#Stage_recHiddenPing");

    $("#Stage_preferences_preferencesPicture_recThumbnailPicture").html('<img class=resizeme id="thumbnailPicture" width="203" src=""/>');
    $("#Stage_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
    $("#Stage_dialogSpeed_txtAmt").text(preferencesArray[0].readingSpeed);
    $("#Stage_preferences_preferencesRecord_dialogSpeed_slider_scrubber").css({left: preferencesArray[0].sliderStageLeft });
    $("#Stage_preferences_preferencesRecord_dialogSpeed_txtAmt").text(preferencesArray[0].readingSpeed);
    console.log("selfieIndex " + selfieIndex);
    $("#Stage_preferences").css('z-index', -1);
    $("#Stage_preferences").hide();
    $("#Stage_dialogSpeed").hide();  
    $(".btnButtonDisplay").click(function() {
        setTimeout(function(){
           btnOnOff("btnHideYellow", "btnHideGreen", "txtButtonDisplay", "recBtnDisplay");
           words.Sym.getSymbol("preferences").play("menuButtonDisplay");
        }, 125);
        btnOnOff("btnHideYellow", "btnHideGreen", "txtButtonDisplay", "recBtnDisplay");
    });
    //============================================
    $(".btnMenuNarration").click(function() { //symbol preferences
        setTimeout(function(){
           btnOnOff("narrationMenuYellow", "narrationMenuGreen", "txtMenuNarration", "recMenuNarration");
           words.Sym.getSymbol("preferences").play("menuRecord");
        }, 125);
        btnOnOff("narrationMenuYellow", "narrationMenuGreen", "txtMenuNarration", "recMenuNarration");
        $(".textTime").text('45');
    });

    if (Modernizr.touch) {  				
				appRating(false);				
    }

    $(".btnMenuCancel").click(function() {
        setTimeout(function(){
           btnOnOff("deleteMenuCancelYellow", "deleteMenuCancelGreen", "txtMenuCancel", "recMenuCancel");
           words.Sym.getSymbol("preferences").play("menuDone");
        }, 125);
        btnOnOff("deleteMenuCancelYellow", "deleteMenuCancelGreen", "txtMenuCancel", "recMenuCancel");
				//$("#Stage_toolBar").show();
				//$("#Stage_toolBar").css("z-index", "1");
    });

//    $(".btnGalleryCancel").click(function() {
//        setTimeout(function(){
//            btnOnOff("deleteGalleryCancelYellow", "deleteGalleryCancelGreen", "txtGalleryCancel", "recGalleryCancel");
//            $("#Stage_preferences").show();
//            $(galleryPageId).hide();
//						$(pageArr[pageIndex].pageId).show();
//
//        }, 125);
//        btnOnOff("deleteGalleryCancelYellow", "deleteGalleryCancelGreen", "txtGalleryCancel", "recGalleryCancel");
//    });
    
    $(".btnNavPicture").click(function() {
        setTimeout(function(){
           btnOnOff("recNavPictureYellow", "recNavPictureGreen", "txtNavPicture", "recNavPictureBG");
           words.Sym.getSymbol("preferences").play("picture");
        }, 125);
        btnOnOff("recNavPictureYellow", "recNavPictureGreen", "txtNavPicture", "recNavPictureBG");
    });

    //========== Record/Play Controls =============
    $(".navRecord").click(function() {
        setTimeout(function(){
            btnOnOff("leftArrowRecordYellow", "leftArrowRecordGreen", "txtNavRecord", "recNavRecordBG");
            $(".groupUtilsRecord").show();
            $(".groupUtilsPlay").hide();
            var yellowRec = 'rgb(251, 237, 197)';
            if ($(".recPlayPauseBG").css('backgroundColor') != yellowRec) {
                btnOnOff("imgAudioYellow", "imgAudioGreen", "txtPlayPause", "recPlayPauseBG");
                $(".txtPlayPause").text('Play');
            }
        }, 125);
        btnOnOff("leftArrowRecordYellow", "leftArrowRecordGreen", "txtNavRecord", "recNavRecordBG");
        var pageName = pageArr[pageIndex].pageName;
        if(!$("#selfieAudio"+pageName).get(0).paused){
            $("#selfieAudio"+pageName).get(0).pause();
            $("#selfieAudio"+pageName).get(0).currentTime = 0;
        }
    });

    $(".groupNavNarration").click(function() {  //symbol preferencesPicture - groupNavRecord
        setTimeout(function(){
            btnOnOff("recNavPictureYellowAudio", "recNavPictureGreenAudio", "txtNavNarration", "recNavRBG");
            words.Sym.getSymbol("preferences").play("record");
        }, 125);
        btnOnOff("recNavPictureYellowAudio", "recNavPictureGreenAudio", "txtNavNarration", "recNavRBG");
        //$("#Stage_preferences_preferencesPicture_groupWebPicDirections").hide();
		//$("#Stage_preferences_preferencesPicture_groupWebPicDirections").css("z-index", "-1");
    });

    

    $(".btnTakePicture").click(function() {
        var yellowRec = 'rgb(251, 237, 197)';
        setTimeout(function(){
            takePicture();
            if ($(".recTakePicture").css('backgroundColor') != yellowRec) {
                btnOnOff("imgTakePictureYellow", "imgTakePictureGreen", "txtTakePicture", "recTakePicture");
            }
        }, 125);
        btnOnOff("imgTakePictureYellow", "imgTakePictureGreen", "txtTakePicture", "recTakePicture");
    });

    $(".btnPickPicture").click(function() {        
        var yellowRec = 'rgb(251, 237, 197)';
        setTimeout(function(){            
            pickPicture();
            if ($(".recPickPicture").css('backgroundColor') != yellowRec) {
                btnOnOff("imgPickPictureYellow", "imgPickPictureGreen", "txtPickPicture", "recPickPicture");
            }
        }, 125);
        btnOnOff("imgPickPictureYellow", "imgPickPictureGreen", "txtPickPicture", "recPickPicture");
    });
    
    $(".btnSelfie").click(function() {
        var yellowRec = 'rgb(251, 237, 197)';
        setTimeout(function(){
            setStageOrder('cameraRotate');
                if ($(".recSelfieBG").css('backgroundColor') != yellowRec) {
                    btnOnOff("imgSelfieYellow", "imgSelfieGreen", "txtSelfie", "recSelfieBG");
                }
            
        }, 125);
        btnOnOff("imgSelfieYellow", "imgSelfieGreen", "txtSelfie", "recSelfieBG");
    });
    
    $(".groupCameraRotateOk").click(function() {
        setTimeout(function(){
            btnOnOff("checkCameraRotateOkYellow", "checkCameraRotateOkGreen", "txtCameraRotateOk", "recCameraRotateOk");
            takeSelfie();						
            setStageOrder('preferences');
        }, 125);
        btnOnOff("checkCameraRotateOkYellow", "checkCameraRotateOkGreen", "txtCameraRotateOk", "recCameraRotateOk");
    });
    
    $(".groupCameraRotateCancel").click(function() {
        setTimeout(function(){
            btnOnOff("cameraRotateCancelYellow", "cameraRotateCancelGreen", "txtCameraRotateCancel", "recCameraRotateCancel");
            setStageOrder('preferences');
        }, 125);
        btnOnOff("cameraRotateCancelYellow", "cameraRotateCancelGreen", "txtCameraRotateCancel", "recCameraRotateCancel");
    });
    
    
    $(".btnPickGallery").click(function() {
				var pageId = pageArr[pageIndex].pageId;
        var yellowRec = 'rgb(251, 237, 197)';
        setTimeout(function(){
						var count = pageLoadedArray.indexOf("pageGallery");					
						if (count == -1){
								pageLoadedArray.push("pageGallery");
								galleryPageId = "#"+words.Sym.createChildSymbol("gallery", "Stage").getSymbolElement().attr("id");
								$(galleryPageId).attr("desc","pageGallery");
								fillGallery();
						}
						//$("#Stage_groupSwipe").hide();
            $("#gallery01").show();
            $("#gallery02").hide();
            $("#Stage_gallery_txtGallery").text('Gallery');
            //$("#Stage_gallery_marktoonWeb").hide();
						$(".marktoonWeb").hide();
						$("#Stage_preferences").hide();
						$(pageArr[pageIndex].pageId).hide();
						$(galleryPageId).show();
            if ($(".recPickGallery").css('backgroundColor') != yellowRec) {
                btnOnOff("imgPickGalleryYellow", "imgPickGalleryGreen", "txtGallery", "recPickGallery");
                
            }
        }, 125);
        btnOnOff("imgPickGalleryYellow", "imgPickGalleryGreen", "txtGallery", "recPickGallery");
    });
    
    $(".btnPickBlobs").click(function() {
        var yellowRec = 'rgb(251, 237, 197)';
        setTimeout(function(){
						var count = pageLoadedArray.indexOf("pageGallery");					
						if (count == -1){
								pageLoadedArray.push("pageGallery");
								galleryPageId = "#"+words.Sym.createChildSymbol("gallery", "Stage").getSymbolElement().attr("id");
								$(galleryPageId).attr("desc","pageGallery");
								fillGallery();
						}
						//$("#Stage_groupSwipe").hide();
            $("#gallery01").hide();
            $("#gallery02").show();
            $("#Stage_gallery_txtGallery").text('Blobs');
            $(".marktoonWeb").show();
						$("#Stage_preferences").hide();
						$(pageArr[pageIndex].pageId).hide();
						$(galleryPageId).show();
            if ($(".recPickBlobs").css('backgroundColor') != yellowRec) {
                btnOnOff("imgPickBlobYellow", "imgPickBlobGreen", "txtBlobs", "recPickBlobs");
                
            }
        }, 125);
        btnOnOff("imgPickBlobYellow", "imgPickBlobGreen", "txtBlobs", "recPickBlobs");
    });
		
		$(".btnPageDefault").click(function() {
        var yellowRec = 'rgb(251, 237, 197)';
        setTimeout(function(){
						
            setPageDefaultImages();
            if ($(".recPickDefault").css('backgroundColor') != yellowRec) {
                btnOnOff("imgPickDefaultYellow", "imgPickDefaultGreen", "txtPageDefault", "recPickDefault");
                
            }
        }, 125);
        btnOnOff("imgPickDefaultYellow", "imgPickDefaultGreen", "txtPageDefault", "recPickDefault");
    });
    
		//========
		$("#Stage_preferences").on('swipeleft',function(){
				words.Sym.getSymbol("preferences").play("menuDone");
				exitPreferences();
				doSwipeLeft();						                
		} );
		$("#Stage_preferences").on('swiperight',function(){
				words.Sym.getSymbol("preferences").play("menuDone");
				exitPreferences();
				doSwipeRight();						                
		} );
		$("#Stage_preferences").on('swipedown',function(){
				words.Sym.getSymbol("preferences").play("menuDone");
				exitPreferences();
				showNavButtons();
		} );
						//========
		
    console.log("Exiting compReadyPreferences");
}//end compReadyPreferences
/************************************************************/
