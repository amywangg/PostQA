var fs = require('fs');

    var counter = 0;

    function addRow () {
        var newRow = $("<tr>");
        var cols = "";

        cols += '<td style="padding-top:0px; padding-bottom:0px;"><input type="text" class="form-control keyIn" " name="key' + counter + '"/></td>';
        cols += '<td style="padding-top:0px; padding-bottom:0px;"><input type="text" class="form-control valueIn" name="value' + counter + '"/></td>';

        cols += '<td><a href="#" id="delete" style="padding-left:0px">X</a></td>';
        newRow.append(cols);
        $(".reqbody").append(newRow);
        counter++;
    }

    $(".reqbody").on("click","#delete", function(event){
        //will remove the parent "li"
        $(this).parent().fadeOut(500, function(){
            $(this).closest("tr").remove();
            counter -= 1
            });
        event.stopPropagation();
    });

    function addFile (){
        dialog.showOpenDialog((filepath) => {
            // fileNames is an array that contains all the selected
            if(filepath === undefined){
                console.log("No file selected");
                return;
            }
        
            fs.readFile(filepath, 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }
                // Change how to handle the file content
                console.log("The file content is : " + data);
            });
        });
    }