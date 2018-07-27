// connect the results 
$.getScript('js/results.js', ()=> {});

// global varaibles 
var param, array ,values, keys, obj, newobj ={};

$(document).ready(function(){
    $('#sendPost').on('click', () => {
        $('.info').fadeOut("slow"); //hide the info div
        // refresh table by deleting old data
        if($("#resultTab").length !=0){
            $("#resultTab").remove();
        } 
        $( "#resultTab" ).load( "index.html #resultTab" )
        var url = $('#getPost').val()
        param = ($('#getVar').val())
        if (url == ""){
            infoDiv('URL cannot be blank');
        }else if(param == ""){
            infoDiv('Variables Cannot be blank');
        } else if (param.indexOf(",")!=-1){
            infoDiv("Variables are not formatted correctly")
        } else {
            // format the input variables
            param = param.replace(/\s+/g, " ").trim();
            array = param.split(" ").map(toUpper);
            // call the postRequest function
            postRequest(url)
            saveConfig()
        }
    }) 
    
    // makes all variables uppercase
    function toUpper(item) {
        return item.toUpperCase();
    }
    function infoDiv (message){
        $('.info').fadeIn("slow");
        $('#alert').text(message)
        setTimeout(function() {
                    $('.info').fadeOut("slow");}, 2000);
              }
            
    function postRequest(urlString){
        var path = "config/" + $('#pathName').text();
        
        fs.readFile(path,'utf8', function (err,data){
            if(err) throw err;
            var obj=JSON.parse(data)
            values = Object.keys(obj).map(function (key) { return obj[key]; });
            keys = Object.keys(obj);

            for(i=0; i<keys.length-1;i++){
                    newobj[keys[i]] = values[i];
            }
            newobj[keys[keys.length-1]] = array;
            console.log(JSON.stringify(newobj))
        });
            request.post({
              url: urlString,
              body: newobj,
              json:true
            }, function(error, response, body){    
                // Get keys and values
                values = Object.keys(body).map(function (key) { return body[key]; });
                keys = Object.keys(body);
                if(error){
                    infoDiv('Please check your URL or Variables')
                }else if (values=="Internal server error" || keys =="message") {
                    infoDiv("One or more variables are invalid")
                    $('.results').css("display", "none");
                    
                }else{
                    
                    // add id header
                    array.unshift("ID");
                    console.log(array)
                    var table = arrayToTable(array, formatData(keys,values), {
                        thead: true,
                        attrs: {id: 'resultTab', class:'table table-hover table-dark '}
                    })
                    $('#postResult').append(table);
                    $('.results').css("display", "block");
                }
           });
          }

    // format the data so that it can be displayed in the table
    function formatData(keys,values){
        var splitVal =[];
        var count= 0;
        values.forEach(function(e){
            splitVal.push(keys[count]);
            var middle = e.split(",")
            middle.forEach(function(e2){splitVal.push(e2)});
            count++;
        });
        console.log(splitVal);
        return (splitVal);
    }
          
});
