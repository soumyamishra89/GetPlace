$(function() { 
    $("#btnSave").click(function() { 
        html2canvas($("#detailedLocationInfo"), {
            onrendered: function(canvas) {
                
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                //a.href = canvas.toDataURL("image/png");//canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                
                $img = watermarkedDataURL(canvas, "insitemap.net");//canvas.toDataURL("image/png");
                $('#contentImg').attr("src", $img);
                var a = document.createElement('a');
                a.href = $('#contentImg').attr('src');
                a.download = 'insitemap.png';
                a.click();
            }
        });
    });
    
    function watermarkedDataURL(canvas,text){
    	  
    	  var tempCtx=canvas.getContext('2d');
    	  var cw,ch;
    	  cw=canvas.width;
    	  ch=canvas.height;
    	  tempCtx.drawImage(canvas,0,0);
    	  tempCtx.globalCompositeOperation = "destination-over";
    	  tempCtx.font="20px verdana";
    	  tempCtx.globalAlpha=0.5;
    	  tempCtx.fillStyle = '#CACFD2';
    	  tempCtx.fillRect(0,0,cw+50,ch+50);
    	  
          
    	  var textWidth=tempCtx.measureText(text).width;
    	  tempCtx.fillStyle='#A7CA46'
    	  tempCtx.fillText(text,cw-textWidth,ch-12);
    	  // just testing by adding tempCanvas to document
    	  //document.body.appendChild(tempCanvas);
    	  return(canvas.toDataURL("image/png"));
    	}

}); 
