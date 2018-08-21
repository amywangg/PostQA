// connect the results 
$.getScript('js/results.js', () => {});

// global varaibles 
var custparam,param, array, values, keys, obj, newobj, url;
var custom, variable, requestBody;

$(document).ready(function() {
    newobj = {}
    // standard logic and checking to prepare for post request
  $('#sendPost').on('click', () => {
    $('.info').fadeOut("slow"); //hide the info div
    // refresh table by deleting old data
    if ($("#resultTab").length != 0) {
      $("#resultTab").remove();
    }
    $("#resultTab").load("index.html #resultTab")
    url = $('#getPost').val()

    fs.readFile('config/defaultconfig.json', 'utf8', function(err, data) {
      if (err) {
        infoDiv("No config file found")
      } else {
        obj = JSON.parse(data)

        // ====================FOR ERROR CHECKING OF THE FIELDS =================================================
        if (url == "") { //check if url is ok first
          infoDiv('URL cannot be blank');
        } else {
          if (obj.variable == false) { //next check if variables are present
            param = $('#getVar').val()
            param = param.replace(/\s+/g, " ").trim();
            array = param.split(" ").map(toUpper);
            if (param == "") {
              infoDiv('Variables Cannot be blank');
            } else if (param.indexOf(",") != -1) {
              infoDiv("Variables are not formatted correctly")
            } else {
              if (obj.custom == true) {
                custparam = $('#getCust').val().replace(" ", "").trim(); //remove spaces
                if (custparam.indexOf("{") == -1) {
                  infoDiv('Missing Opening Bracket, {');
                } else if (custparam.indexOf("}") == -1) {
                  infoDiv('Missing Closing Bracket, }');
                  // error check for custom if it exists
                } else {saveConfig();constructBody()} // if it doesnt exist then execute post calls
              } else {saveConfig();constructBody()}
            }
          } else { //if variables are not present then
            if (obj.custom == true) {
                if ($('#getCust').val()==("" ||" ")){
                    infoDiv('Custom Body cannot be blank');
                }else{
                    console.log( $('#getCust').val())
                    custparam = $('#getCust').val().trim(); //remove spaces
                    if (custparam.indexOf("{") == -1) {
                        infoDiv('Missing Opening Bracket, {');
                      } else if (custparam.indexOf("}") == -1) {
                        infoDiv('Missing Closing Bracket, }');
                        // error check for custom if it exists
                      } else if (custparam.indexOf(":") == -1) {
                        infoDiv('Check Custom Body Format');
                        // error check for custom if it exists
                      }else {saveConfig();constructBody()} // if it doesnt exist then execute post calls
                }                
              }else {saveConfig(); constructBody()}
          }
        }
      }
    });
  });

  function constructBody(){
    var path = "config/" + $('#pathName').text();//gets the path of file containing url
    
        if(requestBody==false){ // Request body is present  
            fs.readFile(path, 'utf8', function(err, data) { //read data from file
            // Collect the key value pairs
                if (err) throw err;
                var obj = JSON.parse(data)
                values = Object.keys(obj).map(function(key) {return obj[key];});
                keys = Object.keys(obj);
                // Fill Key Valu Pairs for body
                for (i = 0; i < keys.length - 1; i++) {
                    newobj[keys[i]] = values[i];
                }
                if (variable==false){// Request body + variable present
                    newobj[keys[keys.length - 1]] = array;
                }
            });
            if($('.postCheck').text()=='X'){console.log(newobj);postRequest(url);}else{console.log(newobj);getRequest(url);}
        } else if(custom==true){ // Custom body selected
            var obj = JSON.parse(custparam)
            values = Object.keys(obj).map(function(key) {return obj[key];});
            keys = Object.keys(obj);
            for (i = 0; i < keys.length; i++) {
                newobj[keys[i]] = values[i];
            }
            if (variable==false){// Request body + variable present
                newobj[$('.varIn').val()] = array;
            }
            if($('.postCheck').text()=='X'){console.log(newobj);postRequest(url, newobj);}else{console.log(newobj);getRequest(url, newobj);}
        } else {
            if (variable==false){// Only URL + Variables
                newobj[$('.varIn').val()] = array;
            }if($('.postCheck').text()=='X'){console.log(newobj);postRequest(url, newobj);}else{console.log(newobj);getRequest(url, newobj);}
        }
}

// Post Request and format data to be put in table
  function postRequest(urlString, newobj) {
      console.log(newObj)
    if(custom==false && requestBody==true){ //Only URL present (NO body)
        request.post({
            url: urlString,
            json: true
          },function(error, response, body) {
            // Get keys and values
            values = Object.keys(body).map(function(key) { return body[key];});
            keys = Object.keys(body);
            if (error) {
              infoDiv('Please check your URL or Variables')
            } else if (values == "Internal server error" || keys == "message") {
              infoDiv("Please check your URL or Variables")
              $('.results').css("display", "none");
            } else {
              var table = arrayToTable(keys, formatData(keys,values), {thead: true,attrs: {id: 'resultTab',class: 'table table-hover table-dark '}})
              $('#postResult').append(table);
              $('.results').css("display", "block");
            }
          });
    // if there is a request body or custom body
    } else {
        request.post({
            url: urlString,
            body: newobj,
            json: true
          }, function(error, response, body) {
            // Get keys and values
            values = Object.keys(body).map(function(key) {return body[key];});
            keys = Object.keys(body);
            // check for any errors in the request object
            if (error) {
              infoDiv('Please check your URL or Variables')
            } else if (values == "Internal server error" || keys == "message") {
              infoDiv("Please check your URL or Variables")
              $('.results').css("display", "none");
            } else {
              // // add id header
              array.unshift(keys[0]);
              var table = arrayToTable(array, formatData(keys, values), {thead: true,attrs: {id: 'resultTab',class: 'table table-hover table-dark '}})
              $('#postResult').append(table);
              $('.results').css("display", "block");
            }
          });
        }
    }
// Post Request and format data to be put in table
function getRequest(urlString) {
    console.log(newObj)
    if(custom==false && requestBody==true){ //Only URL present (NO body)
        $.ajax({
            url: urlString,
            body: newobj,
            success: function(body) {
                // Get keys and values
                values = Object.keys(body).map(function(key) { return body[key];});
                keys = Object.keys(body);
                if (error) {
                  infoDiv('Please check your URL or Variables')
                } else if (values == "Internal server error" || keys == "message") {
                  infoDiv("Please check your URL or Variables")
                  $('.results').css("display", "none");
                } else {
                  var table = arrayToTable(keys, formatData(keys,values), {thead: true,attrs: {id: 'resultTab',class: 'table table-hover table-dark '}})
                  $('#postResult').append(table);
                  $('.results').css("display", "block");
                }
              },
            dataType: 'jsonp',

            error: (err)=> infoDiv("ERROR: " + JSON.stringify(err))
          });
    // if there is a request body or custom body
    } else {
        $.ajax({
            url: urlString,
            success: function(error,body) {
                // Get keys and values
                values = Object.keys(body).map(function(key) { return body[key];});
                keys = Object.keys(body);
                if (error) {
                  infoDiv('Please check your URL or Variables')
                } else if (values == "Internal server error" || keys == "message") {
                  infoDiv("Please check your URL or Variables")
                  $('.results').css("display", "none");
                } else {
                  var table = arrayToTable(keys, formatData(keys,values), {thead: true,attrs: {id: 'resultTab',class: 'table table-hover table-dark '}})
                  $('#postResult').append(table);
                  $('.results').css("display", "block");
                }
              },
            dataType: 'jsonp',

            error: (err)=> infoDiv("ERROR: " + JSON.stringify(err))
          } );
    }
}
    
    
//==================FORMATTING FUNCTIONS ========================
  // format the data so that it can be displayed in the table
  function formatData(keys, values) {
    var splitVal = [];
    var count = 0;
    values.forEach(function(e) {
        console.log(e)
      splitVal.push(keys[count]);
    //   if there are multiple keys that need formatting
        if(typeof e != 'number' || e.toString().indexOf(",")!= -1){
            var middle = e.split(",")
        middle.forEach(function(e2) {
        splitVal.push(e2)});
        } else {
            splitVal.push(e)
        }
      count++;
    });
    console.log(splitVal);
    return (splitVal);
  }
  // makes all variables uppercase
  function toUpper(item) {
    return item.toUpperCase();
  }

  function infoDiv(message) {
    $('.info').fadeIn("slow");
    $('#alert').text(message)
    setTimeout(function() {
      $('.info').fadeOut("slow");
    }, 2000);
  }
});

  