<script type="text/javascript">
	/*var option = {
	      hasRotation : true,
	      hasZoom     : true,
	      hasPinch	: true,
	      scaleValue  : 0.05,
	      rotateValue : 90,
	      zoomInCaption : 'z+',
	      zoomOutCaption : 'z-',
	      rotateIncrease : '<@',
	      rotateDecrease : '@>' }*/


	$("#container")
	.h5u({ scaleValue:0.10 })
	.addCallback = function(val) {
		console.log(val);
		window.location.href = val;
	};
</script>
