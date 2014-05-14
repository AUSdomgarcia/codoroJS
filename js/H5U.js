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

	this.setScaleByPercent = function( scale ){
		scaleValue = scale;
		return this;
	}

	this.setRotateByDegree = function( rot ){
		rotateValue = rot;
		return this;
	}


	//FILE API
	$('#fileId').change(function(evt) {
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
			$('#prompt').html( output.join('') );
		}
	});

	//Canvas
	var hasImage = false;
	var bitmapHolder;
	var imgConvert;
	var container = new createjs.Container();

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


	$('.browser').click(function(){
		$('#fileId').click();
	});

	//Controls
	$('.zoomOut').on("mouseup",function( evt ){
		if(!hasImage) return;

		container.scaleX -= scaleValue;
		container.scaleY -= scaleValue;
		stage.update( evt );
	});
	$('.zoomIn').on("mouseup",function( evt ){
		if(!hasImage) return;

		container.scaleX += scaleValue;
		container.scaleY += scaleValue;
		stage.update( evt );
	});
	$('.zoomRotRight').on("mouseup",function(){
		if(!hasImage) return;

		container.rotation += rotateValue;
		stage.update();
	});
	$('.zoomRotLeft').on("mouseup",function(){
		if(!hasImage) return;
		
		container.rotation -= rotateValue;
		stage.update();
	});

	//CreateJS init
	var canvas  = document.getElementById("mcanvas");
	var stage 	= new createjs.Stage(canvas);
		stage = new createjs.Stage(canvas);
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);	
	stage.mouseMoveOutside = false;

	this.displayDebug = function(){
		if(!stage) return;
		var text = new createjs.Text("HTML5 uploader version 1 \n" + "  rotateValue: " + rotateValue +
		"\n  scaleValue: " + scaleValue, "12px Arial", "#777");
		stage.addChild(text);
		stage.update();
	}
}


