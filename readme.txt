<script type="text/javascript">
	/*var option = {
	      hasRotation : true,
	      hasZoom     : true,
	      hasPinch	: true,
	      scaleValue  : 0.05,
	      rotateValue : 90,
	      zoomInCaption : 'z+',
	      zoomOutCaption : 'z-',
	      rotateIncreaseCaption : '<@',
	      rotateDecreaseCaption : '@>' }*/

	$("#container")
		.h5u({ scaleValue:0.10 })
		.addCallback( function (data) {
			console.log("base64:",data);
		});
</script>
