jQuery.fn.h5u = function(obj) 
{
	var version = '1.1.4';
	var el = $(this[0]);
		var option = {
			hasRotation : true,
			hasZoom     : true,
			hasPinch	: true,
			scaleValue  : 0.05,
			rotateValue : 90,
			zoomInCaption : 'z+',
			zoomOutCaption : 'z-',

			rotateIncreaseCaption : '<@',
			rotateDecreaseCaption : '@>',
		}

	$.extend(option,obj);

		this.HTMLview = function(el)
		{
			var container = $(el);
				container.addClass('canvas-size');
			var canvasWidth = container.width();
			var canvasHeight = container.height();

			
			container.append("<div class='right-nav'></div>");
			var rightNav = $('.right-nav');

			if(option.hasZoom){
				rightNav.append("<button id='zoomin' class='right-nav-des'>"+option.zoomInCaption+"</button>"
							   +"<button id='zoomout' class='right-nav-des'>"+option.zoomOutCaption+"</button>");
			}

			if(option.hasRotation){
				rightNav.append("<button id='rotleft' class='right-nav-des'>"+option.rotateIncreaseCaption+"</button>"
							   +"<button id='rotright' class='right-nav-des'>"+option.rotateDecreaseCaption+"</button>");
			}

			container.append("<canvas id='canvas-base' width='"+canvasWidth
							+"' height='"+canvasHeight+"'></canvas>");

			container.append("<input type='file' id='file-input' name='files[]' multiple/>")
					 .append("<br style='clear:both'/>")
					 .append("<div style='width: auto;'>"
					 		+"<button id='browse-btn' class='bottom-nav'>Browse File</button>"
					 		+"<button id='submit-btn' class='bottom-nav'>Submit Entry</button>"
					 		+"</div>");

			container.append("<br style='clear:both;'/><p>version "+version+"</p>");
		}

		this.initCanvas = function(el)
		{
			var that = this;
			$('#browse-btn').on("mouseup",function( evt ){
				$('#file-input').click();
			});

			$('#submit-btn').on("mouseup",function( evt ){
				if(!hasImg) return;
				var dataURL = canvas.toDataURL();
				self.addCallback(dataURL);
			});

			//Canvas 
			var stage;
			var hasImg = false;
			var bitmapHolder;
			var shape = new createjs.Shape();
			var cont = new createjs.Container();
			var imgConvert = new Image();
			var originalRegistry = [];

			canvas = document.getElementById('canvas-base');
			stage = new createjs.Stage(canvas);
			
			createjs.Touch.enable(stage);
			stage.enableMouseOver(10);
			stage.mouseMoveOutside = false;
			
			var text = new createjs.Text("\n\t\t\tHTML5 uploader version "+version+"\n\n\t\t\tAuthor: domgarcia", "12px Arial", "#777");
				stage.addChild(text);
				stage.update();
			
			this.processImg = function (args) {
				return function(e) {
					that.copyToCanvas(e.target.result);
				}
			}

			this.resetImg = function() {
				hasImg = false;
				cont.removeChild(bitmapHolder);
				stage.removeChild(cont);
				bitmapHolder = null;
				imgConvert = null;
				cont.scaleX = 
				cont.scaleY = 1;
				cont.rotation = 0;
			}

			this.copyToCanvas = function ( value ) {
				if(bitmapHolder) that.resetImg();

				hasImg = true;
				imgConvert = new Image();
				imgConvert.onload = that.bitmapReady;
				imgConvert.src = value;

				shape.graphics.beginFill("#fff").drawRect(0, 0, canvas.width, canvas.height);
				stage.addChild(shape);
			}

			this.bitmapReady = function (){
				bitmapHolder = new createjs.Bitmap(imgConvert);
				cont.addChild(bitmapHolder);

				cont.regX = cont.getBounds().width/2;
				cont.regY = cont.getBounds().height/2;

				cont.x = canvas.width/2;
				cont.y = canvas.height/2;
				stage.addChild(cont);

				

				var prop = { x: cont.getBounds().width/2, y: cont.getBounds().height/2 };
				originalRegistry.push(prop);

				stage.update();
			}
			
			this.controls = function(){
				//scale
				$('#zoomout').on("mouseup",function( evt ){
					if(!hasImg) return;
						if(cont.scaleX<0.3)return;
						cont.scaleX -= option.scaleValue;
						cont.scaleY -= option.scaleValue;
						stage.update( evt );

				});
				$('#zoomin').on("mouseup",function( evt ){
					if(!hasImg) return;
						
						cont.scaleX += option.scaleValue;
						cont.scaleY += option.scaleValue;
						stage.update( evt );

				});

				//rotation
				$('#rotright').on("mouseup",function(){
					if(!hasImg) return;
						cont.rotation+= option.rotateValue;
						stage.update();
				});

				$('#rotleft').on("mouseup",function(){
					if(!hasImg) return;
						cont.rotation-= option.rotateValue;
						stage.update();
				});

				var isResizing = false;

				cont.on("mousedown", function(evt) {
					if(!hasImg) return;
					this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};		
				});

				cont.on("pressmove", function(evt) {
					if(!hasImg) return;
					if(isResizing){

					}else{
						this.x = evt.stageX+ this.offset.x;
						this.y = evt.stageY+ this.offset.y;
						$("body").css({ cursor: "pointer" });
						//stage.update();
					}
				});

				var newScale;
				var newRotation;

				var last_scale;
				var last_rotation;

				Hammer(canvas, {
					preventDefault		: true,
					transformMinScale   : 0.01,
					dragBlockHorizontal : true,
					dragBlockVertical   : true,
					dragMinDistance     : 0
				})
				.on('touch drag dragend transform', function(ev) {
	      			if(!hasImg) return;

		  			switch(ev.type) {
					case 'touch':
						last_scale = cont.scaleX;
						last_rotation = cont.rotation;
						
						stage.update();
					break;

					case 'drag':
						stage.update();
					break;

					case 'dragend':
						isResizing = false;
					break;

					case 'transform':
						isResizing = true;
						if(option.hasPinch){
							newRotation = last_rotation + ev.gesture.rotation;
							newScale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
						
							cont.rotation = newRotation;
							cont.scaleX = cont.scaleY = newScale;
							stage.update();
						}
					break;
					}
	  			});
			}

			$('#file-input').change( function(evt){
				var fl = evt.target.files;
				var o = [];
				var r = new FileReader();

				for (var i = 0, f; f = fl[i]; i++) {
					if(f.type.indexOf('image')!=-1){
						r.onload = that.processImg(f);
						r.readAsDataURL(f);
						o.push('<strong>', encodeURIComponent(f.name),'</strong> (', f.type || 'n/a', ') - ',
						f.size, ' bytes, last modified: ',
			    		f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');
						//$( labelstr ).html( o.join('') );
			    	}
				}
			} );
			that.controls();
		}

		this.addCallback = function() {

		}

	var self = this;
	self.HTMLview(el);
	self.initCanvas(el);
	return this;
};



/*cont.on("mouseout", function(evt) {
	if(!hasImg) return;
	$("body").css({ cursor: "default" });
	stage.update();
});
for( var o in option )
	console.log(o, option[o]);
*/





