H5U = (function(){
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		//runnig properly
	} else { 
		throw Error("Not supported File API.");
	}
	var _ins;
	return {
		init : function() {
			if (!_ins) { _ins = new Uploader(); }
			return _ins;
		}
	}
})();

Uploader = function() 
{
	var scaleValue = 0.05;
	var rotateValue = 45;
	var canvasName = "";
	var fileId = "";
	var imgLbl = "";
	var btnId = "";
	var canvas;
	var stage;


	//UI CONTROLS
	this.setRotClass = function( left, right ){
		$( right ).on("mouseup",function(){
			if(!hasImage) return;

			container.rotation += rotateValue;
			stage.update();
		});

		$( left ).on("mouseup",function(){
			if(!hasImage) return;
			
			container.rotation -= rotateValue;
			stage.update();
		});
	}

	this.setZoomClass = function( ins, out ){
		$( out ).on("mouseup",function( evt ){
			if(!hasImage) return;
				container.scaleX -= scaleValue;
				container.scaleY -= scaleValue;
				stage.update( evt );
		});

		$( ins ).on("mouseup",function( evt ){
			if(!hasImage) return;
				container.scaleX += scaleValue;
				container.scaleY += scaleValue;
				stage.update( evt );
		});
	}

	this.setScaleByPercent = function( scale ){
		scaleValue = scale;
		return this;
	}

	this.setRotateByDegree = function( rot ){
		rotateValue = rot;
		return this;
	}

	this.setCanvasNameId = function( _name ){
		canvas = document.getElementById( _name );
		stage  = new createjs.Stage(canvas);
		createjs.Touch.enable(stage);
		stage.enableMouseOver(10);	
		stage.mouseMoveOutside = false;
	}

	this.setImageNameId = function( _imgLbl ){
		imgLbl = _imgLbl;
	}

	this.setBrowseBtnId = function ( _btnId ){
		btnId = _btnId;
		$( btnId ).click(function(){
			$( fileId ).click();
		});
	}

	this.setSaveBtnId = function( saveId ){
		$( saveId ).click(function(){
			var dataURL = canvas.toDataURL();
			console.log(dataURL);
			window.location.href = dataURL;
		});
	}

	this.setFileId = function( _linkage ){
		fileId = _linkage;
		//FILE API
		$( fileId ).change(function(evt) {
			var files = evt.target.files;

			var output = [];

		var reader = new FileReader();
			for (var i = 0, f; f = files[i]; i++) 
			{
			    if(!f.type.match('image.*')) continue;	

				function processImg(args) {
					return function(e) {
					var span = document.createElement('span');
						span.innerHTML = ['<img src="', e.target.result,
		        		'" title="', encodeURIComponent( args.name ), '"/>'].join('');
						//document.getElementById('outputHolder').insertBefore(span, null);
						copyToCanvas(e.target.result);
					}
				}

				reader.onload = processImg(f);
				reader.readAsDataURL(f);

				//html label
				output.push('<strong>', encodeURIComponent(f.name),'</strong> (', f.type || 'n/a', ') - ',
		        f.size, ' bytes, last modified: ',
		        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');
				
				//$('#outputHolder').append('<ul>'+ output.join('') + '</ul>' );
				$( imgLbl ).html( output.join('') );
			}
		});
	}

	//Canvas
	var hasImage = false;
	var bitmapHolder;
	var imgConvert;
	var container = new createjs.Container();

	var shape = new createjs.Shape();

	function copyToCanvas( value ){
		if(bitmapHolder){
			hasImage = false;
			container.removeChild(bitmapHolder);
			stage.removeChild(container);
			bitmapHolder = null;
			imgConvert = null;

			container.scaleX = container.scaleY = 1;
			container.rotation = 0;
		}
		
		imgConvert = new Image();
		imgConvert.onload = bitmapReady;
		imgConvert.src = value;

 		shape.graphics.beginFill("#fff").drawRect(0, 0, canvas.width, canvas.height);
 		stage.addChild(shape);
 		//shape.graphics.clear();

		function bitmapReady(){
			hasImage = true;
			bitmapHolder = new createjs.Bitmap(imgConvert);
			container.addChild(bitmapHolder);

			container.regX = container.getBounds().width/2;
			container.regY = container.getBounds().height/2;
			
			container.x = canvas.width/2;
			container.y = canvas.height/2;

			stage.addChild(container);
			stage.update();
		}
	}

	//MOUSE EVENTS
	container.on("mousedown", function(evt) {
		if(!hasImage) return;

		this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
		stage.update();
	});

	container.on("mouseout", function(evt) {
		if(!hasImage) return;

		$("body").css({ cursor: "default" });
	});

	container.on("pressmove", function(evt) {
		if(!hasImage) return;

		this.x = evt.stageX+ this.offset.x;
		this.y = evt.stageY+ this.offset.y;
		$("body").css({ cursor: "pointer" });
		stage.update();
	});


	//CreateJS init
	
	this.displayDebug = function(){
		if(!stage) return;
		var text = new createjs.Text("HTML5 uploader version 1 \n" + "  rotateValue: " + rotateValue +
		"\n  scaleValue: " + scaleValue, "12px Arial", "#777");
		stage.addChild(text);
		stage.update();
	}
}


