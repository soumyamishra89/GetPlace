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
    	  var tempCanvas=document.createElement('canvas');
    	  var tempCtx=tempCanvas.getContext('2d');
    	  var cw,ch;
    	  cw=tempCanvas.width=canvas.width;
    	  ch=tempCanvas.height=canvas.height;
    	  tempCtx.drawImage(canvas,0,0);
    	  tempCtx.font="20px verdana";
    	  var textWidth=tempCtx.measureText(text).width;
    	  tempCtx.globalAlpha=.30;
    	  tempCtx.fillStyle='black'
    	  tempCtx.fillText(text,cw-textWidth,ch-12);
    	  // just testing by adding tempCanvas to document
    	  //document.body.appendChild(tempCanvas);
    	  return(tempCanvas.toDataURL("image/png"));
    	}

}); 
