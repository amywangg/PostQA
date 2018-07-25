var arrayToTable = function(header, data, options = {}) {
    var table = $('<table "/>'),
      rows = [],
      row,
      i, j,
      defaults = {
        attrs: {} // attributes for the table element, can be used to
      }

    options = $.extend(defaults, options);
    table.attr(options.attrs)
    var rowNum =0;

    // loop through all the rows, we will deal with tfoot and thead later
    for (i = 0; i < (data.length/header.length)+ 1; i++) {
        if (i == (header.length-1) ){
            row = $('<tbody> <tr />');
            } else {
            row = $('<tr />');
            }
   
      for (j = 0; j < header.length; j++) {
        if (i == 0 ) {
          row.append($('<th scope="col"/>').html(header[j]));
            
        } else {
          row.append($('<td />').html(data[rowNum-(header.length)]));
        }
        rowNum++;
      } 
      rows.push(row);
    }
    rows.push("</tbody>")
    // add all the rows
    for (i = 0; i < (data.length/header.length)+ 1; i++) {
      table.append(rows[i]);
    };
    return table;
  }
  
  
