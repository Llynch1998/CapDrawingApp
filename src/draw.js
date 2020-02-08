"use strict";
	
	let ctx,dragging=false,lineWidth,strokeStyle;
	let allPoints = [];
	let currentLayer = [];
	let exportBtn = document.querySelector("#exportPNG");
	//firebase
	const DRAWINGPATH = "saveDrawings";
	let allDrawings = {};
	
	initFirebase();
	init();

	// FUNCTIONS
	function init(){
		ctx = canvas.getContext('2d');
		lineWidth = 3;
		strokeStyle = "red";
		
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.lineCap = "round"; 
		ctx.lineJoin = "round";
		
		// Hook up event handlers
		canvas.onmousedown = doMousedown;
		canvas.onmousemove = doMousemove;
		canvas.onmouseup = doMouseup;
		canvas.onmouseout = doMouseout;
		clearButton.onclick = doClear;
		saveButton.onclick = doSave;
		clearCloudButton.onclick = doClearCloud;
		exportBtn.onclick = exportCanvasAsPNG;
		window.onhashchange = onLocationHashChanged;
	}
	
	function loadDrawing(points){
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		
		for(let layer of points){
			ctx.beginPath();
			ctx.moveTo(layer[0].x, layer[0].y);
			
			for(let p of layer){
				ctx.lineTo(p.x, p.y);
				ctx.stroke();
			}
			
			ctx.closePath();
		}
		
	}
	
	// EVENT CALLBACK FUNCTIONS
	function doMousedown(e){
		dragging = true;
		let mouse = getMouse(e);
		ctx.beginPath();
		ctx.moveTo(mouse.x, mouse.y);
		
		//points
		currentLayer.push(mouse);
		allPoints.push(currentLayer);
	}
	
	function doMousemove(e) {
		// bail out if the mouse button is not down
		if(!dragging) return;
		
		// get location of mouse in canvas coordinates
		let mouse = getMouse(e);
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		
		// draw a line to x,y of mouse
		ctx.lineTo(mouse.x, mouse.y);
		
		// stroke the line
		ctx.stroke();
		
		//points
		currentLayer.push(mouse);

	}
	
	function doMouseup(e) {
		ctx.closePath();
		
		if(dragging){
			//points
			currentLayer = [];
			console.log(allPoints);
			dragging = false;
		}
	}
	
	// if the user drags out of the canvas
	function doMouseout(e) {
	  ctx.closePath();
		
		if(dragging){
			//points
			currentLayer = [];
			console.log(allPoints);
			dragging = false;
		}
		
		//points
		currentLayer = [];
		console.log(allPoints);
	}

	
	function doClear(){
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		allPoints = [];
	}
	
	function doSave(){
		if(allPoints.length == 0) return;
		console.log("doSave");
		firebase.database().ref(DRAWINGPATH).push({
			points: allPoints
		});
	}
	
	function doClearCloud(){
		firebase.database().ref(DRAWINGPATH).remove();
	
	}
	
	function onLocationHashChanged(){
		let key = window.location.hash.substring(1);
		allPoints = allDrawings[key].points;
		loadDrawing(allPoints);
		console.log("changed drawing");
	}
	
	function exportCanvasAsPNG() {
		//console.log("button going through")
	
		var imgURL = canvas.toDataURL("image/png"); //gets canvas data as png
	
		var dlLink = document.createElement('a');//creates a download link
		dlLink.download = "image";//this is the name of the file to be downloaded
		dlLink.href = imgURL;//sets the link of the a element
		dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');//creaetes the actual download
	
		document.body.appendChild(dlLink);//adds the download link
		dlLink.click();//auto clicks the link
		document.body.removeChild(dlLink);//deletes the link
		//doing ^ all at the same time makes no change to the actual html page
	}

	//firebase
	function onDataChanged(data){
		let bigString = "";
		allDrawings = data.val();
		console.log(allDrawings);
		
		if(!allDrawings){
			drawingList.innerHTML = "";
			return;
		}
		
		for(let key of Object.keys(allDrawings)){
			//one set of points
			let drawing = allDrawings[key];
			bigString += `<li><a href = "#${key}"> ${key}</a></li>`;
		}
		
		drawingList.innerHTML = bigString;
	}
	
	function onFirebaseError(error){
		console.log(`ERROR=$(error)`);
	}

// UTILITIES
	function getMouse(e){
		let mouse = {};
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
		return mouse;
	}

	//FIREBASE
	function initFirebase(){
	
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB83TKMW-91E2FNaZzzcOs_7VmnIsPeYWA",
    authDomain: "share-draw-230de.firebaseapp.com",
    databaseURL: "https://share-draw-230de.firebaseio.com",
    projectId: "share-draw-230de",
    storageBucket: "share-draw-230de.appspot.com",
    messagingSenderId: "435389588658",
    appId: "1:435389588658:web:39d0b31b4ab3691e5295ab"
  };
  firebase.initializeApp(config);
  
  console.log(firebase);
  
  firebase.database().ref(DRAWINGPATH).on("value",onDataChanged, onFirebaseError);
 }