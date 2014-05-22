H5u = (function(){
	var _ins;
	
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		//runnig properly
	} else {
		throw Error("Not supported File API.");
	}
	return {
		init : function() {
			if (!_ins) {
				var args = Array.prototype.slice.call(arguments);
				_ins = new Uploader(args);
				$(".error").hide();
			}
			return _ins;
		}
	}
})();

Uploader = function( args )
{
	var Utils = new function(){
		this.isExist = function(value){
			var b = (value!=undefined)?true:false;
			return b;
		}
	}

	//Globals
	var str = "";

	//others
	var attachAPI; var issetAPI = false;
	var label;	   var issetLabel = false;

	var buttonData;var hasBtnData = false;
	var rotation;  var issetRotation = false;
	var scalable;  var issetScale = false;

	//Canvas
	var canvasName; var canvasNA = false;
	var objProp;    var propNA   = false;

	//buttonID
	var browse; var hasBrowse = false;
	var save;   var hasSave = false;
		//Zoom
		var hasZoom = false;
		var zoom;

		var zoomIn;  var zoomInNA = false;
		var zoomOut; var zoomOutNA = false;

		//Rotation
		var hasrotate = false;
		var rotate;

		var	rotLeft; var rotLeftNA = false;
		var	rotRight;var rotRightNA = false;

	setBtnRotate = function(arr){
		for (str in arr){
			if(arr[str].indexOf("eft")!=-1){
				rotLeft = arr[str]; 
				rotLeftNA = true;
			} else {
				rotRight = arr[str]; 
				rotRightNA = true;
			}
		}
	}

	setBtnZoom = function(arr){
		for (str in arr){
			if(arr[str].indexOf("ut")!=-1){
				zoomOut = arr[str]; 
				zoomInNA = true;
			} else {
				zoomIn = arr[str];
				zoomOutNA = true;
			}
		}
	}

	applyToButton = function(value){
		if( Utils.isExist(value.btnProp.browse) ){
			hasBrowse = true;
			browse = value.btnProp.browse;
		}

		if( Utils.isExist(value.btnProp.save) ){
			save = value.btnProp.save;
			hasSave = true;
		} 
		
		if( Utils.isExist(value.btnProp.zoom) ) {
 			zoom = value.btnProp.zoom;
			setBtnZoom(zoom);
			hasZoom = true;
		}

		if( Utils.isExist(value.btnProp.rotate) ) {
			rotate = value.btnProp.rotate;
			setBtnRotate(rotate);
			hasrotate = true;
		}

		console.log( "\thas browse:", hasBrowse,"\n",
			         "\thas save:", hasSave,"\n",
			         "\thas zoom []:", hasZoom, (zoom)?zoom.length:null ,"\n",
			         "\thas rotate []:", hasrotate, (rotate)?rotate.length:null );
	}

	extractData = function(value){
		propNA = true;
		console.log("file|rotation|scale:", propNA);

		//attachAPI, rotation, scalable
		if( Utils.isExist(value.attachAPI) ){ 
			attachAPI = value.attachAPI; 
			issetAPI = true;
		}

		if( Utils.isExist(value.label )){
			label = value.label; 
			issetLabel = true;
		}

		if( Utils.isExist(value.scalebypercent) ){ 
			scalable  = value.scalebypercent;
			issetScale = true; 
		}

		if( Utils.isExist(value.setrotationbydegree) ){
			rotation  = value.setrotationbydegree;
			issetRotation = true;
		}

		console.log("\thas attachAPI:",issetAPI,"\n",
					"\thas label:",issetLabel,"\n" ,
			        "\thas rotationValue:",issetRotation,"\n" ,
			        "\thas scalableValue:",issetScale );
	
		if( Utils.isExist(value.btnProp) ) { 
			hasBtnData = true;
			console.log("btnProp:",hasBtnData);
			applyToButton(value);
		} else {
			console.log("!Nav buttons not set!", value.btnProp);
		}
	}

	//Determine data type and set the values given (string or object)
	if( Utils.isExist(args[0]) ){ 
		if( typeof args[0] == 'object' ){
			objProp = args[0];
			
			extractData(objProp);
		} else if(typeof args[0] == 'string' ){
				canvasName = args[0]; 
				canvasNA = true;
				console.log("has canvasName:", canvasNA);
		}
	}
	
	//set canvas prop( attachAPI, setDegree, setScale, setButton )
	if( Utils.isExist(args[1]) ) { 
		objProp = args[1];
		extractData(objProp);
	} else {
		if(!propNA){
			console.log("file|rotation|scale:", propNA);
		}
	}

	//Use of function
	this.setCanvasName = function( id ){
		canvasName = id;
		canvasNA = true;
		console.log("has canvasName:", canvasNA);
	}
	
	this.setAPI = function( id ){
		attachAPI = id;
		issetAPI  = true;
	}

	this.setLabel = function( id ){
		label = id;
		issetLabel = true;
	}

	this.setRotationByDeg = function( num ){
		rotation = num;
		issetRotation = true;
	}

	this.setScaleByPercent = function( num ){
		scalable = num;
		issetScale = true;
	}

	this.setBtnBrowse = function(id){
		browse    = id;
		hasBrowse = true;
	}

	this.setBtnSave = function(id){
		save      = id;
		hasSave   = true;
	}

	this.setBtnZoom = function(arr){
		setBtnZoom(arr);
	}

	this.setBtnRotate = function(arr){
		setBtnRotate(arr);
	}

	this.displaySummary = function(){
		console.log("- - - summary - - -");
		console.log( "canvasName:\t", canvasName );
		console.log( "attachAPI:\t", attachAPI );
		console.log( "label:\t\t", label );
		console.log( "rotateValue:", rotation );
		console.log( "scaleValue:\t", scalable );
		console.log( "browse:\t\t", browse );
		console.log( "save:\t\t", save );
		console.log( "zoomIn:\t\t", zoomIn );
		console.log( "zoomOut:\t", zoomOut );
		console.log( "rotLeft:\t", rotLeft );
		console.log( "rotRight:\t", rotRight );
	}

	this.renderCanvas = function(){
		var instanceLib = 
		[	canvasName, 
			attachAPI,
			label,
			rotation,
			scalable,
			browse,
			save,
			zoomIn,
			zoomOut,
			rotLeft,
			rotRight
		];

		var checker = false;
		for( var x in instanceLib){
			var b = Utils.isExist(instanceLib[x])?true:false;
			if(!b)
			checker = true;
		}
		initCanvas(checker);
	}

	

	var cvStage = new CanvaStage();
	initCanvas = function(bool){
		if(bool){ throw Error("#001 Missing arguments");
			return;
		}
		//draw canvass here
		cvStage.cvname( canvasName, true );
		cvStage.setBrowseBtn( browse, attachAPI );	
			    cvStage.setupAPI( attachAPI );
		cvStage.setOutputStr( label );
		cvStage.setSaveBtn( save, function(val){
			self.onSave( val );
		} );
		cvStage.setScale( zoomIn, zoomOut, scalable );
		cvStage.setRotation( rotLeft, rotRight, rotation );
	}
	this.onSave = function(){}
	var self = this;
}


CanvaStage = function() 
{
	console.log("canvas initialize []");

	var hasImage = false;
	var cv;
	var stage;
	var labelstr;

	var bitmapHolder;
	var imgConvert = new Image();
	var container = new createjs.Container();

	var ccName;
	this.cvname = function( name, debug ){
		ccName = name;
		var nn = name.substr(1, name.length);

		cv = document.getElementById(nn);
		stage = new createjs.Stage(cv);
		createjs.Touch.enable(stage);
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = false;

		if(!stage && (debug==false)) return;
			var text = new createjs.Text("HTML5 uploader version 1 \n" + "  rotateValue: " + rotateValue +
			"\n  scaleValue: " + scaleValue, "12px Arial", "#777");
		stage.addChild(text);
		stage.update();
	}

	this.setOutputStr = function( id ){
		labelstr = id;
	}

	this.setBrowseBtn = function( id, api ){
		$( id ).on("mouseup",function( evt ){
			$( api ).click();
		});
	}
	
	this.setSaveBtn = function( id, callback ){
		$( id ).on("mouseup", function( evt ){
			if(!hasImage) return;
			dataURL = cv.toDataURL();
			callback( dataURL );
		});
	}

	this.setupAPI = function( api ) 
	{	
		$( api ).change(function(evt) 
		{
			var files = evt.target.files;
			var output = [];
			var reader = new FileReader();

			for (var i = 0, f; f = files[i]; i++) {
			//	if(!f.type.match('image.*')) continue;
				if(f.type.indexOf('image')!=-1){
					reader.onload = processImg(f);
				reader.readAsDataURL(f);
				output.push('<strong>', encodeURIComponent(f.name),'</strong> (', f.type || 'n/a', ') - ',
				f.size, ' bytes, last modified: ',
		    	f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');
		    	
		    	$( labelstr ).html( output.join('') );
		    	$(".error").hide();

		    	console.log( f.size );
		    	if( f.size > (1024*3000) ){ console.log(":: exceed"); }
				} else { 
					invalidEntry();
				}
			}
		});

		function processImg(args) {
			return function(e) {
				copyToCanvas(e.target.result);
			}
		}

		function resetImg(){
			hasImage = false;
			container.removeChild(bitmapHolder);
			stage.removeChild(container);
			bitmapHolder = null;
			imgConvert = null;
			container.scaleX = 
			container.scaleY = 1;
			container.rotation = 0;
		}

		var shape = new createjs.Shape();

		function copyToCanvas( value ) {
			if(bitmapHolder) resetImg();

			imgConvert = new Image();
			imgConvert.onload = bitmapReady;
			imgConvert.src = value;

			shape.graphics.beginFill("#fff").drawRect(0, 0, cv.width, cv.height);
 			stage.addChild(shape);
		}

		function bitmapReady(){
			hasImage = true;
			bitmapHolder = new createjs.Bitmap(imgConvert);
			container.addChild(bitmapHolder);

			container.regX = container.getBounds().width/2;
			container.regY = container.getBounds().height/2;
			
			container.x = cv.width/2;
			container.y = cv.height/2;

			stage.addChild(container);
			stage.update();
		}
	}

	function invalidEntry() { 

		$(".error").show();

		$( labelstr ).html("<strong>Invalid</strong> entry, only image allowed!");
		
		console.log("invalidEntry!!");
	}

	var rotateValue =0;
	this.setRotation = function( left, right, rot ){
		rotateValue = rot;
		$( right ).on("mouseup",function(){
		if(!hasImage) return;
			container.rotation+= rotateValue;
			stage.update();
		});

		$( left ).on("mouseup",function(){
		if(!hasImage) return;
			container.rotation-= rotateValue;
			stage.update();
		});
	}

	scaleValue =1;
	this.setScale = function( zin, zout, scale ){
		scaleValue = scale;
		$( zout ).on("mouseup",function( evt ){
			if(!hasImage) return;
				container.scaleX -= scaleValue;
				container.scaleY -= scaleValue;
				stage.update( evt );
		});
		$( zin ).on("mouseup",function( evt ){
			if(!hasImage) return;
				container.scaleX += scaleValue;
				container.scaleY += scaleValue;
				stage.update( evt );
		});
	}
	
	//Drag-drop
	container.on("mousedown", function(evt) {
		if(!hasImage) return;
			this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
			stage.update();
	});
	container.on("pressmove", function(evt) {
		if(!hasImage) return;
			this.x = evt.stageX+ this.offset.x;
			this.y = evt.stageY+ this.offset.y;
			$("body").css({ cursor: "pointer" });
			stage.update();
	});
	/*container.on("mouseout", function(evt) {  console.log("mouseout3");
		if(!hasImage) return;
			$("body").css({ cursor: "default" });
			stage.update();
	});*/
}
