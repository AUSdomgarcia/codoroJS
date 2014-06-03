jQuery.fn.h5u = function(obj) 
{
	var version = '1.1.5';
	this.el = $(this[0]);
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

	this._callback = function () {}

		this.HTMLview = function()
		{
			// var container = el;
				this.el.addClass('canvas-size');
			var canvasWidth = this.el.width();
			var canvasHeight = this.el.height();

			
			this.el.append("<div class='right-nav'></div>");
			var rightNav = self.el.find('.right-nav');

			if(option.hasZoom){
				rightNav.append("<button id='zoomin' class='right-nav-des'>"+option.zoomInCaption+"</button>"
							   +"<button id='zoomout' class='right-nav-des'>"+option.zoomOutCaption+"</button>");
			}

			if(option.hasRotation){
				rightNav.append("<button id='rotleft' class='right-nav-des'>"+option.rotateIncreaseCaption+"</button>"
							   +"<button id='rotright' class='right-nav-des'>"+option.rotateDecreaseCaption+"</button>");
			}

			this.el.append("<canvas id='canvas-base' width='"+canvasWidth
							+"' height='"+canvasHeight+"'></canvas>");

			this.el.append("<input type='file' id='file-input' name='files[]' multiple/>")
					 .append("<br style='clear:both'/>")
					 .append("<div style='width: auto;'>"
					 		+"<button id='browse-btn' class='bottom-nav'>Browse File</button>"
					 		+"<button id='submit-btn' class='bottom-nav'>Submit Entry</button>"
					 		+"</div>");

			this.el.append("<br style='clear:both;'/><p>version "+version+"</p>");
		}

		this.initCanvas = function()
		{
			var that = this;
			this.el.find('#browse-btn').on("mouseup",function( evt ){
				self.el.find('#file-input').click();
			});

			this.el.find('#submit-btn').on("mouseup",function( evt ){
				if(!hasImg) return;
				var dataURL = canvas.toDataURL();
				self._callback(dataURL);
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
				self.el.find('#zoomout').on("mouseup",function( evt ){
					if(!hasImg) return;
						if(cont.scaleX<0.3)return;
						cont.scaleX -= option.scaleValue;
						cont.scaleY -= option.scaleValue;
						stage.update( evt );

				});
				self.el.find('#zoomin').on("mouseup",function( evt ){
					if(!hasImg) return;
						
						cont.scaleX += option.scaleValue;
						cont.scaleY += option.scaleValue;
						stage.update( evt );

				});

				//rotation
				self.el.find('#rotright').on("mouseup",function(){
					if(!hasImg) return;
						cont.rotation+= option.rotateValue;
						stage.update();
				});

				self.el.find('#rotleft').on("mouseup",function(){
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

			self.el.find('#file-input').change( function(evt){
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

		this.addCallback = function(callback) {
			if (typeof callback == "function") {
				self._callback = callback;
			}
			return self;
		}

	var self = this;
	self.HTMLview();
	self.initCanvas();
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





