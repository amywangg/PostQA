let jQuery = require('jquery')
let $ = require('jquery')
const request = require('request')

// connect the results 
$.getScript('results.js', function() {
    console.log('Load was performed.');
});

// connect the results 
$.getScript('settings.js', function() {
    console.log('Load was performed.');
});


// global varaibles 
var param, array ,values, keys;

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
            alert('URL cannot be blank');
        }else if(param == ""){
            alert('Variables Cannot be blank');
        } else if (param.indexOf(",")!=-1){
            alert("Variables are not formatted correctly")
        } else {
            // format the input variables
            param = param.replace(/\s+/g, " ").trim();
            array = param.split(" ").map(toUpper);
            // call the postRequest function
            postRequest(url , array)
        }
    }) 
    
    // makes all variables uppercase
    function toUpper(item) {
        return item.toUpperCase();
    }
    function alert(message){
        $('.info').fadeIn("slow");
        $('#alert').text(message)
        setTimeout(function() {
                    $('.info').fadeOut("slow");}, 2000);
              }
            
    function postRequest(urlString, array, bodyVar){
            request.post({
              url: urlString,
              body: {"Country":"CAN",
              "Period":"20180629",
              "Currency":"CAD",
              "IndustryGroup":"GICSECT",
              "ConfigureName":"data-src",
              "Output":"qa",
              "Titles": array },
              json:true,
              dataType: "json"//set to JSON   
            }, function(error, response, body){    
                // Get keys and values
                values = Object.keys(body).map(function (key) { return body[key]; });
                keys = Object.keys(body);
                if(error){
                    alert('Please check your URL or Variables')
                }else if (values=="Internal server error" || keys =="message") {
                    alert("One or more variables are invalid")
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
