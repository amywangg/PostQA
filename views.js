let $ = require('jquery')  // jQuery now loaded and assigned to $
let jQuery = require('jquery')
const request = require('request')

$('#sendPost').on('click', () => {
    var url = $('#getPost').val()
    var param = $('#getVar').val()

    if (url == ""){
        alert('URL cannot be blank');
    }else if(param == ""){
        alert('Variables Cannot be blank');
    } else if (param.indexOf(",")!=-1){
        console.log(param)
        alert('Variables are not formatted correctly')
    } else {
        param = param.replace(/\s+/g, " ").trim();
        var array = param.split(" ").map(toUpper);
        console.log(array);
        $('#test').text($('#getPost').val())
        console.log(postRequest(url , array));
    }
}) 
function toUpper(item) {
    return item.toUpperCase();
}

function postRequest(urlString, array){
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
            var values = Object.keys(body).map(function (key) { return body[key]; });
            var keys = Object.keys(body);
            if(error){
                alert('Please check your URL or Variables')
            }else if (values=="Internal server error" || keys =="message") {
                alert("One or more variables invalid")
            }else{
                console.log(values)
                console.log(keys)
            }
       });
      }

    //   else if (response.IncomingMessage.readable== "false") {
    //     alert('Please Check Validity of Variables')
    //     console.log(body)
    // }