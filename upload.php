<?php 
	$filename = "files";
	
	print_r($_FILES);

	$allowedExts = array("gif", "jpeg", "jpg", "png");
	$temp = explode(".", $_FILES[$filename]["name"]);
	$extension = end($temp);

	echo $_FILES[$filename]["type"];
	echo $extension;

	if ((($_FILES[$filename]["type"] == "image/gif")
	|| ($_FILES[$filename]["type"] == "image/jpeg")
	|| ($_FILES[$filename]["type"] == "image/jpg")
	|| ($_FILES[$filename]["type"] == "image/pjpeg")
	|| ($_FILES[$filename]["type"] == "image/x-png")
	|| ($_FILES[$filename]["type"] == "image/png"))
	&& in_array($extension, $allowedExts))
	{
	  if ($_FILES[$filename]["error"] > 0) {
	    echo "Return Code: " . $_FILES[$filename]["error"] . "<br>";
	  } else {
	    echo "Upload: " . $_FILES[$filename]["name"] . "<br>";
	    echo "Type: " . $_FILES[$filename]["type"] . "<br>";
	    echo "Size: " . ($_FILES[$filename]["size"] / 1024) . " kB<br>";
	    echo "Temp file: " . $_FILES[$filename]["tmp_name"] . "<br>";
	    
	    if (file_exists("upload/" . $_FILES[$filename]["name"])) {
	      echo $_FILES[$filename]["name"] . " already exists. ";
	    } else {
	      move_uploaded_file($_FILES[$filename]["tmp_name"],
	      "upload/" . $_FILES[$filename]["name"]);
	      echo "Stored in: " . "upload/" . $_FILES[$filename]["name"];
	    }
	  }
	} else {
	  echo "Invalid file";
	}
?>