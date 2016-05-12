$(function() { 
    $("#btnSave").click(function() { 
        html2canvas($("#detailedLocationInfo"), {
            onrendered: function(canvas) {
                var a = document.createElement('a');
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                a.href = canvas.toDataURL("image/png");//canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                a.download = 'insitemap.jpg';
                a.click();
            },
            background:"#C8846E"
        });
    });
}); 
