$(function() { 
    $("#btnSave").click(function() { 
        html2canvas($("#detailedLocationInfo"), {
            onrendered: function(canvas) {
                
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                //a.href = canvas.toDataURL("image/png");//canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                
                $img = canvas.toDataURL("image/png");
                $('#contentImg').attr("src", $img);
                $('#contentImg').append("<img src="+$img+" class='watermark_text' id='insitemap_img_id'/>");
                $('#insitemap_img_id').watermark({
                //$('#contentImg').watermark({
                	  text: 'insitemap.net',
                	  textWidth: 100,
                	  textColor: 'white'
                	});
         
                var a = document.createElement('a');
                a.href = $('#insitemap_img_id').attr('src');
                a.download = 'insitemap.png';
                a.click();
            }
        });
    });
}); 
