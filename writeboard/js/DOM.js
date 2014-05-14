 
 $(document).ready(function(){
 	console.log("___PAGE LOADED___")

 	 if (window.PIE) {
		console.log( window.PIE )

        $('.rounded').each(function() {
            PIE.attach(this);
        });
    }else{
    	console.log("im now outside")
    }

 });