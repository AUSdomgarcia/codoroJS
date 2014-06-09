jQuery.fn.h5u = function(obj) 
{
	var version = '1.1.5';
	this.el = $(this[0]);
		var option = { 
			wurl		: "",
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
			this.el.addClass('h5u-canvas-size');
			var canvasWidth  = this.el.width();
			var canvasHeight = this.el.height();

			this.el.append("<div id='h5u-error-wrapper'>"
						  +"<div class='h5u-error-content'>0%</div>"
						  +"</div>");

			this.el.find("#h5u-error-wrapper").css({ width: canvasWidth, height: canvasHeight });
			this.el.find("#h5u-error-wrapper").hide();

			this.el.append("<div class='h5u-right-nav'></div>");
			var rightNav = self.el.find('.h5u-right-nav');

			if(option.hasZoom){
				rightNav.append("<button id='h5u-zoomin' class='h5u-right-nav-des'>"+option.zoomInCaption+"</button>"
							   +"<button id='h5u-zoomout' class='h5u-right-nav-des'>"+option.zoomOutCaption+"</button>");
			}

			if(option.hasRotation){
				rightNav.append("<button id='h5u-rotleft' class='h5u-right-nav-des'>"+option.rotateIncreaseCaption+"</button>"
							   +"<button id='h5u-rotright' class='h5u-right-nav-des'>"+option.rotateDecreaseCaption+"</button>");
			}

			this.el.append("<canvas id='h5u-canvas-base' width='"+canvasWidth
							+"' height='"+canvasHeight+"'></canvas>");

			this.el.append("<form id='form1' enctype='multipart/form-data' method='post' action='upload.php'>");

			this.el.append("<input type='file' id='h5u-file-input' name='files'/>"
					 		+"<div style='width: auto;'>"

					 		//preloader
					 		+"<div class='h5u-tpreload-wrapper'>"
						    +"<div class='h5u-tpreload-bar'></div>"
						    +"</div>"
							
							//button nav
							+"<button id='h5u-browse-btn' class='h5u-bottom-nav'>Browse File</button>"
					 		+"<button id='h5u-submit-btn' class='h5u-bottom-nav'>Submit Entry</button>"
					 		+"</div>");

			this.el.append("</form>");
			
			//version
			this.el.append("<br style='clear:both;'/><p>version "+version+"</p>");
			this.el.find(".h5u-tpreload-wrapper").hide();
		}

		this.initCanvas = function()
		{
			var that = this;

			this.updatePreloader = function( curVal ){
				var newProp = { width : curVal+"%" }
					self.el.find('.h5u-tpreload-bar').css( newProp );
					curVal = Math.floor(curVal);
					self.el.find('.h5u-error-content').html( curVal + "%" );
			}
			//FOCUS HERE! added 4 events
			this.uploadProgress = function(evt){
				var percentComplete;
				if(evt.lengthComputable){
					percentComplete = Math.round((evt.loaded * 90 )/evt.total);
					that.updatePreloader( percentComplete );
				} else {
					console.log( 'unable to compute');
				}
			}
			this.uploadComplete = function(){
				that.updatePreloader( 100 );
				setTimeout(function(){
				document.getElementById("h5u-zoomin").disabled=false;
				document.getElementById("h5u-zoomout").disabled=false;
				document.getElementById("h5u-rotleft").disabled=false;
				document.getElementById("h5u-rotright").disabled=false;
				document.getElementById("h5u-browse-btn").disabled=false;
				document.getElementById("h5u-submit-btn").disabled=false;

					self.find("#h5u-error-wrapper").hide();
					isProcessing = false;
					self._callback("upload complete");
				},1000);
			}

			this.uploadFailed = function(){
				alert('There was an error attempting to upload the file.');
			}
			this.uploadCanceled = function(){
				alert('The upload has been canceled by the user or the browser dropped the connection');	
			}

			this.dataURItoBlob = function(dataURI) {
				// convert base64 to raw binary data held in a string
				// doesn't handle URLEncoded DataURIs
				var byteString;
				if (dataURI.split(',')[0].indexOf('base64') >= 0)
				    byteString = atob(dataURI.split(',')[1]);
				else
				    byteString = unescape(dataURI.split(',')[1]);
				// separate out the mime component
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
				// write the bytes of the string to an ArrayBuffer
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				for (var i = 0; i < byteString.length; i++) {
				    ia[i] = byteString.charCodeAt(i);
				}
				// write the ArrayBuffer to a blob, and you're done
				return new Blob([ab],{type: mimeString});
			}

			this.postForm = function ( blob ){
				var fd = new FormData();
				fd.append('files', blob , file_name );
				
				var xhr;
				if (window.XMLHttpRequest) {
					xhr=new XMLHttpRequest();
				} else {
					xhr=new ActiveXObject("Microsoft.XMLHTTP");
				}

				xhr.upload.addEventListener('progress', that.uploadProgress,false);
				xhr.addEventListener('load',  that.uploadComplete,false);
				xhr.addEventListener('error', that.uploadFailed,false);
				xhr.addEventListener('abort', that.uploadCanceled,false);
				xhr.open('POST', 'upload.php');
				xhr.send(fd);
			}


			this.el.find('#h5u-browse-btn').on("mouseup",function( evt ){
				if(isProcessing) return;
				self.el.find('#h5u-file-input').click();
			});

			this.el.find('#h5u-submit-btn').on("mouseup",function( evt ){
				if(!hasImg) return;
				if(isProcessing) return;

				document.getElementById("h5u-zoomin").disabled=true;
				document.getElementById("h5u-zoomout").disabled=true;
				document.getElementById("h5u-rotleft").disabled=true;
				document.getElementById("h5u-rotright").disabled=true;

				document.getElementById("h5u-browse-btn").disabled=true;
				document.getElementById("h5u-submit-btn").disabled=true;

				var dataURL = canvas.toDataURL();
				var binary = that.dataURItoBlob( dataURL );
				
				self.el.find(".h5u-tpreload-wrapper").stop().slideDown(
					500, 
					function(){  // self._callback( binary ); @args to external
						isProcessing = true;
						that.updatePreloader(1);
						self.postForm( binary );
						self.el.find("#h5u-error-wrapper").show();
					}
				);
			});

			//Canvas 
			var stage;
			var hasImg = false;
			var bitmapHolder;
			var shape = new createjs.Shape();
			var cont = new createjs.Container();
			var imgConvert = new Image();
			var originalRegistry = [];

			canvas = document.getElementById('h5u-canvas-base');
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

				that.updatePreloader(1);
				
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
				self.el.find('#h5u-zoomout').on("mouseup",function( evt ){
					if(!hasImg) return;
					if(isProcessing) return;
						if(cont.scaleX<0.3)return;
						cont.scaleX -= option.scaleValue;
						cont.scaleY -= option.scaleValue;
						stage.update( evt );

				});
				self.el.find('#h5u-zoomin').on("mouseup",function( evt ){
					if(!hasImg) return;
					if(isProcessing) return;
						cont.scaleX += option.scaleValue;
						cont.scaleY += option.scaleValue;
						stage.update( evt );

				});

				//rotation
				self.el.find('#h5u-rotright').on("mouseup",function(){
					if(!hasImg) return;
					if(isProcessing) return;
						cont.rotation+= option.rotateValue;
						stage.update();
				});

				self.el.find('#h5u-rotleft').on("mouseup",function(){
					if(!hasImg) return;
					if(isProcessing) return;
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

			self.el.find('#h5u-file-input').change( function(evt){
				var fl = evt.target.files; 
					file_name = evt.target.files[0].name;
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
		
	var file_name;
	var isProcessing = false;
	var self = this;
	self.HTMLview();
	self.initCanvas();
	return this;
};





