var fs = require('fs');
    // Global variables
    var counter=2, keys, values, path, exObj;
    startup();
    setTimeout(displayBody, 2000);

    // applies all config file's settings
    function startup (){
        fs.readFile('config/defaultconfig.json', 'utf8', function(err, data){
            if (err){
                infoDiv("No config file found")
            }else {
                obj=JSON.parse(data)
                $('#getPost').val(obj.url)
                var filename  =  obj.path.split('\\').pop().split('/').pop();
                // Display the selected file name
                $('#pathName').text(filename)
                path = obj.path
                // Settings for custom option
                if(obj.request == true){
                    $('.reqCheck').text('X')
                    $('#reqA').fadeOut('slow')
                    $('#reqDiv').css('display','none')
                }else { $('#reqA').fadeIn('slow');  $('.customCheck').text('')}
                if(obj.variable == true){
                    $('.varCheck').text('X')
                    $('.variableDiv').fadeOut('slow')
                    $('#varDiv').css('display','none')
                }else{
                    $('.variableDiv').fadeIn('slow')
                }
                if(obj.custom == true){
                    $('.customCheck').text('X')
                    $('.reqCheck').text('X')
                    $('.customBodyDiv').fadeIn('slow')
                }else{
                    $('.customBodyDiv').fadeOut('slow')
                }
                if(obj.post == true){
                        $('.postCheck').text('X')
                        $('.getCheck').text('')
                        $('#reqH1').text('POST Request')
                        $('#reqLabel').text('POST URL:')
                    }else if(obj.get == true){
                        $('.postCheck').text('')
                        $('.getCheck').text('X')
                        $('#reqH1').text('GET Request')
                        $('#reqLabel').text('GET URL:')
                    }

            }
        });
    }
    
    // fill requestbody area with settings file
    function displayBody(){
        if(path==(undefined||""||null)){
            infoDiv("Please add a JSON settings file")
            return
        }
        fs.readFile(path,'utf8', function (err,data){
            if(err) throw err;
            obj=JSON.parse(data)
            values = Object.keys(obj).map(function (key) { return obj[key]; });
            keys = Object.keys(obj);

            $('.key1').val(keys[0]);
            $('.val1').val(values[0]);
            $('.var1').val(keys[keys.length-1]);
            // populate the key value pairs
            for(i=1; i<keys.length-1; i++){
                fillRow(keys[i], values[i]);
            }
        });
    }

    function saveBody(){
        var upKey = [], upVal =[],newobj = {} ;
            $(".reqbody").find(".keyIn").each(function(){
                upKey.push($(this).val())
            });
            $(".reqbody").find(".valueIn").each(function(){
                upVal.push($(this).val())
            });
            varKey = $('.varIn').val(), varVal=[]
            console.log(upKey.length)
            for(i=0; i<upKey.length;i++){
                if (upKey[i]=="" || upVal[i]==""){
                    infoDiv("Blank Key/Value pair not included")
                }else{
                    newobj[upKey[i]] = upVal[i];
                }
            }
            newobj[varKey] =varVal
            console.log(JSON.stringify(newobj))
            exObj=JSON.stringify(newobj)
            // clear file contents
            fs.writeFile(path, "");
            fs.writeFile(path, JSON.stringify(newobj));
            saveConfig();
    }

    function saveConfig(){
        var url = $('#getPost').val()
        var path = "config/" + $('#pathName').text();
        requestBody = false; variable=false; custom=false; post=false; get=false;
        if($('.reqCheck').text()=='X'){
            requestBody = true;
        }
        if($('.varCheck').text()=='X'){
            variable = true;
        }
        // for custom body
        if($('.customCheck').text()=='X'){
            requestBody = true;
            custom = true;
        }
        if($('.postCheck').text()=='X'){
            post = true;
            get = false;
        }
        if($('.getCheck').text()=='X'){
            get = true;
            post = false;
        }
        var obj = { path: path, url: url, request: requestBody, variable:variable, custom:custom, post:post,get:get}
    
        fs.writeFile('config/defaultconfig.json', "");
        fs.writeFile('config/defaultconfig.json', JSON.stringify(obj));
    }

function fillRow (key, value) {
    var newRow = $("<tr>");
    var cols = "";
    cols += '<td style="padding-top:0px; padding-bottom:0px;"><input type="text" onkeypress="return AvoidSpace(event)" class="form-control keyIn key' + counter + '"/></td>';
    cols += '<td style="padding-top:0px; padding-bottom:0px;"><input type="text" onkeypress="return AvoidSpace(event)" class="form-control valueIn val' + counter + '"/></td>';

    cols += '<td><a href="#" id="delete" style="padding-left:0px">X</a></td>';
    newRow.append(cols);
    $(".reqbody").append(newRow);

    $('.key' + counter).val(key);
    $('.val' + counter).val(value);

    counter++;
}
function infoDiv (message){
    $('.info').fadeIn("slow");
    $('#alert').text(message)
    setTimeout(function() {
                $('.info').fadeOut("slow");}, 2000);
}

function addFile (){
           var filepath = dialog.showOpenDialog({
            properties: ['.json']
        });
        path = filepath[0];
        var filename  =  filepath[0].split('\\').pop().split('/').pop();
    // Display the selected file name
        $('#pathName').text(filename)
        // if json settings file changes then refresh
        refresh()
        saveConfig()
    }

    function exportFile(){
        saveBody();
        var savePath = dialog.showSaveDialog({properties: ['.json']});
        fs.writeFile(savePath, exObj, function(err){
            if(err){
                infoDiv("Error");  
            }else {
                infoDiv("The file has been succesfully saved");  
            }
        }); 
    }

   


