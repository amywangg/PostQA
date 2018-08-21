// Handles all of the animations and processes of the side nav

function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
    document.getElementById("main").style.marginLeft = "400px";
    document.getElementById("postqa").style.marginLeft = "400px";
    document.body.style.backgroundColor = "#EDF2F4";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("postqa").style.marginLeft = "0";
    document.body.style.backgroundColor = "#EDF2F4";
}

function show(element, text){
    $(element).toggle("slow")
}

function check(element){
    if(element=='.customCheck' && $(element).text()==''){
        $('.reqCheck').text('X')
    }
    if( $(element).text()=='X'){
        $(element).text("")
    } else {
        $(element).text("X")
    }
    if(element=='.postCheck'){
        $('.getCheck').text('')
        $('#reqH1').text('POST Request')
        $('#reqLabel').text('POST URL:')
    }else if(element=='.getCheck'){
        $('.postCheck').text('')
        $('#reqH1').text('GET Request')
        $('#reqLabel').text('GET URL:')
    }
}
// refresh the request body panel information
function refresh(){
    $(".reqbody").find("tr:gt(0)").remove();
    counter=2;
    startup()
    displayBody()
}

$(".reqbody").on("click","#delete", function(event){
    //will remove the parent "li"
    $(this).parent().fadeOut(500, function(){
        $(this).closest("tr").remove();
        counter -= 1
        });
    event.stopPropagation();
});

function addRow () {
    var newRow = $("<tr>");
    var cols = "";

    cols += '<td style="padding-top:0px; padding-bottom:0px;"><input type="text"  class="form-control keyIn" " name="key' + counter + '" onkeypress="return AvoidSpace(event)"/></td>';
    cols += '<td style="padding-top:0px; padding-bottom:0px;"><input type="text"  class="form-control valueIn" name="value' + counter + '" onkeypress="return AvoidSpace(event)"/></td>';

    cols += '<td><a href="#" id="delete" style="padding-left:0px">X</a></td>';
    newRow.append(cols);
    $(".reqbody").append(newRow);
    counter++;
}

// disallow use of spacebar for key value pairs
function AvoidSpace(event) {
    var k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}

