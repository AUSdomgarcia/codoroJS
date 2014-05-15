<script type="text/javascript">
	var uploader = H5U.init();
	uploader.setScaleByPercent(0.05);
	uploader.setRotateByDegree(25);
	
	uploader.setCanvasNameId("mcanvas");
	uploader.setImageNameId("#imgName");
	uploader.setFileId("#fileId");
	uploader.setBrowseBtnId(".browseBtn"); //setBtnClass
	uploader.setSaveBtnId(".saveBtn");
	
	uploader.setRotClass(".zoomRotLeft", ".zoomRotRight");
	uploader.setZoomClass(".zoomIn", ".zoomOut");
	
	uploader.displayDebug();
</script>
