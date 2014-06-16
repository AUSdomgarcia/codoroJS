<div id="container1"></div>
	<div id="container2"></div>
	<div id="container3"></div>
	<div id="container4"></div>

	$("#container1")
		.h5u({ scaleValue:0.10,
			wurl : "upload.php"
			,hideSubmit : false
		})
		.addCallback( function (data) {
			console.log( data );
		});
	
	$("#container2")
		.h5u({ scaleValue:0.10,
			   wurl : "upload.php"
			   ,hideSubmit : false
			})
		.addCallback( function (data) {
			console.log( data );
		});
	
	$("#container3")
	.h5u({ scaleValue:0.10,
		   wurl : "upload.php"
		   ,hideSubmit : false
		})
	.addCallback( function (data) {
		console.log( data );
	});
	
	$("#container4")
	.h5u({ scaleValue:0.10,
		   wurl : "upload.php"
		   ,hideSubmit : false
		})
	.addCallback( function (data) {
		console.log( data );
	});
