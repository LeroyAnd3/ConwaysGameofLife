$(document).ready(function () {
    alert('Init function');
    /*alert($('#d').val())
    alert($('#height-entry').val());*/
    createTable(10,10);
});

var createTable = function (x,y) {
    var table = $('<table></table>');
    var row;
    var columns;
    for(i=0; i<10; i++){
        row = getRow();
        for (j=0; j < 10; j++) {
            columns = getCol();
            row.append(columns);
            table.append(row);
        }
    }
    $('#play').append(table);
};

var getRow = function() {
    return $("<tr></tr>");
};

var getCol = function() {
    return $("<td></td>");
};