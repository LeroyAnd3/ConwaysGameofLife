$(document).ready(function () {
    var current_game = null;
    var start;
    $( "#start-button" ).click(function(e) {
        start = setInterval(function(){ 
            algorithm(current_game); }, parseInt($("#speed-entry").val()));
        $("#increment-button").hide();
    });
    
    $("#pause-button").click(function(e) {
        clearInterval(start);
        $("#increment-button").show();
    });

    
    $( "#create-button" ).click(function(e) {
        var r = parseInt($("#radius").val());
        var l = parseInt($("#lonely").val());
        var o = parseInt($("#over").val());
        var gmin = parseInt($("#min").val());
        var gmax = parseInt($("#max").val());
        r2 = (4*r*r) + (4*r);
        if((1 <= r <= 10) && (0 < l <= o < r2) && (0 < gmin <= gmax < r2)){
        e.preventDefault();        
        var width = getWidth();
        var height = getHeight();
        if(current_game != null){
            current_game.kill();
        }      

        current_game = new GameOfLife($("#play"), height, width);
        } else {
            alert("Invalid Input");
        }
    });
    
    $(document).on('mousedown', 'td', function(e) {
        e.preventDefault();
        s = this.id;
        //alert(s);
        sArray = s.split("-");
        selector = $('#'+sArray[0]+'-'+sArray[1]);
        
        if(e.shiftKey){//force alive  
            if(selector.hasClass("alwaysdead") || selector.hasClass("dead")){
            selector.removeClass("alwaysdead");
            selector.removeClass("dead");
            selector.addClass("alive");   
            current_game.dead.splice(current_game.dead.indexOf(s), 1);
            current_game.living.push(s);
        }
            
        }else if(e.ctrlKey){//murder
            
            selector.removeClass("alive");
            selector.addClass("alwaysdead");   
            current_game.living.splice(current_game.living.indexOf(s), 1);
            current_game.dead.push(s);
            
        }else if(e.which == 1 && (!e.altKey) && (!e.shiftKey)){
            
            if(selector.hasClass("alwaysdead") || selector.hasClass("dead")){
            selector.removeClass("alwaysdead");
            selector.removeClass("dead");
            selector.addClass("alive"); 
            current_game.dead.splice(current_game.dead.indexOf(s), 1);
            current_game.living.push(s);
            } else {
            selector.removeClass("alive");
            selector.addClass("alwaysdead");
            current_game.living.splice(current_game.living.indexOf(s), 1);
            current_game.dead.push(s);
            }
            
        }
        //alert("Dead: " + current_game.dead);
        //alert("Alive: " + current_game.living);
    });
    
    $("#reset-button").click(function (e) {
        e.preventDefault();       
        var r = parseInt($("#radius").val());
        var l = parseInt($("#lonely").val());
        var o = parseInt($("#over").val());
        var gmin = parseInt($("#min").val());
        var gmax = parseInt($("#max").val());
        r2 = (4*r*r) + (4*r);
        if((1 <= r <= 10) && (0 < l <= o < r2) && (0 < gmin <= gmax < r2)){        
        var width = getWidth();
        var height = getHeight();
        if(current_game != null){
            current_game.kill();
        }      

        current_game = new GameOfLife($("#play"), height, width);
        } else {
            alert("Invalid Input");
        }
    });
    
    $("#random-button").click(function (e) {
        e.preventDefault();
        var width = getWidth();
        var height = getHeight();
        var halfArea = (width*height)/2;
        var s; 
        var rand = Math.floor(Math.random() * halfArea);
        
        if(current_game != null){
            current_game.kill();
        }      
        current_game = new GameOfLife($("#play"), height, width);
        
       for(i = 0; i < rand; i++){
        var rx = Math.floor(Math.random() * width);
	    var ry = Math.floor(Math.random() * height);
        $("#"+rx+"-"+ry).removeClass("alwaysdead");
        $("#"+rx+"-"+ry).addClass("alive");
        
        s = rx+"-"+ry;   
           if(current_game.dead.indexOf(s)!= -1){
        current_game.dead.splice(current_game.dead.indexOf(s), 1);
        current_game.living.push(s);
           }

       
        }
                             
    });
    
    $("#increment-button").click(function(e) {
        algorithm(current_game);        
    });
    
    $("#gameMode").change(function(e) {
       // alert($("#gameMode").val());
    });
    
    
});



var algorithm = function(gameoflife) {
    //alert(gameoflife.living.length);
    //alert(gameoflife.dead.length);
    var radius = gameoflife.r;
    var lonely = gameoflife.l;
    var overpop = gameoflife.o;
    var gmin = gameoflife.gmin;
    var gmax = gameoflife.gmax;
    var livingLength = gameoflife.living.length;
    var deadLength = gameoflife.dead.length;
    var x, y, x1,y1, x2, y2;
    

    for(counter = 0; counter < livingLength; counter++){
        var livingNeighbors= 0;
        var span = gameoflife.living[counter];
        span = span.split("-");
        x = parseInt(span[0]);
        y = parseInt(span[1]);
        x1 = x-radius;
        y1 = y-radius;
        x2 = x+radius;
        y2 = y+radius;
        var twice;
        
        for (i = (x1); i <= (x2); i++){
            for(j =(y1); j<=(y2); j++ ){
                //twice = false;
                if(i!=x || j!=y){
                    if($("#"+i+"-"+j).hasClass("alive")){
                        livingNeighbors++;
                        //alert(x+"-"+y+": "+i+"-"+j+ "normal");
                    }
                    
                if((i>=gameoflife.width || j>=gameoflife.height || i< 0 || j< 0) && gameoflife.gameMode == "alwaysAlive"){
                        //alert("Out of bounds");
                        livingNeighbors++;
                    //alert("added");
                    }
                    
                /*if((i>=gameoflife.width || j>=gameoflife.height || i< 0 || j< 0) && gameoflife.gameMode == "toroidal"){

                    /*if(i<0){ i += gameoflife.width;} else { i = (i%gameoflife.width);}
                    if(j<0){ j += gameoflife.height;} else {j = (j%gameoflife.height);}/
                    
                    if($("#"+i+"-"+j).hasClass("alive")){
                        livingNeighbors++;
                    }
                }*/
                    
                }
                
            }
        }
        var selector = x+"-"+y;
        if(livingNeighbors<lonely){
        //kill array
            //gameoflife.living.splice(gameoflife.living.indexOf(selector), 1);
            gameoflife.death.push(selector);
        }  
        
        if(livingNeighbors>overpop){
        //kill array
            //gameoflife.living.splice(gameoflife.living.indexOf(selector), 1);
            gameoflife.death.push(selector);
        }
    }   
    
        for(counter = 0; counter < deadLength; counter++){
        var neighbors = 0;
        var span = gameoflife.dead[counter];
        //alert(gameoflife.living[counter]);
        span = span.split("-");
        var x = parseInt(span[0]);
        var y = parseInt(span[1]);
        var x1 = x-radius;
        var y1 = y-radius;
        var x2 = x+radius;
        var y2 = y+radius;
        var redundant;
            for (i = (x1); i <= (x2); i++){
            for(j =(y1); j<=(y2); j++ ){
                //redundant = false;
                if(i!=x || j!=y){
                    if($("#"+i+"-"+j).hasClass("alive")){
                        neighbors++;
                        //alert(x+"-"+y+": "+i+"-"+j);
                    }
                    
                    if((i>=gameoflife.width || j>=gameoflife.height || i<0 || j <0) && gameoflife.gameMode == "alwaysAlive"){
                        //alert("Out of bounds");
                        neighbors++;
                    }
                    
                   /*if((i>=gameoflife.width || j>=gameoflife.height || i< 0 || j< 0) && gameoflife.gameMode == "toroidal"){
                    
                    /*if(i<0){ i += gameoflife.width;} else { i = (i%gameoflife.width);}
                    if(j<0){ j += gameoflife.height;} else {j = (j%gameoflife.height);}/
                    
                    if($("#"+i+"-"+j).hasClass("alive")){
                            neighbors++;
                        }
                    }*/
                }
            }
            }
            
            var selector = x+"-"+y;
            if(neighbors>=gmin && neighbors <= gmax){
            //bring to life array
                gameoflife.birth.push(selector);
            }
            //alert( x + " " + y + ": " + neighbors);
            //alert("Those to be: " +gameoflife.birth);
        }
    
    var deathLength= gameoflife.death.length;
    var birthLength = gameoflife.birth.length;
    var coordinate;
    
    for(i = 0; i < deathLength; i++) {
        coordinate = gameoflife.death[0];//why is the last undefined?
        var selector = $("#"+coordinate);
        gameoflife.living.splice(gameoflife.living.indexOf(coordinate), 1);//better way to cut it out?
        selector.removeClass("alive");
        selector.addClass("dead");
        gameoflife.dead.push(coordinate);
        gameoflife.death.splice(0, 1);
        
    //remove from living array
    //remove alive class
    //add dead class
    //add to dead array
    //remove from death array
        
    }
    
    for(j = 0; j < birthLength; j++) {
        coordinate = gameoflife.birth[0];
        var selector = $("#"+coordinate);
        gameoflife.dead.splice(gameoflife.dead.indexOf(coordinate), 1);//better way to cut it out?
        selector.removeClass("alwaysdead");
        selector.removeClass("dead");
        selector.addClass("alive");
        gameoflife.living.push(coordinate);
        gameoflife.birth.splice(0, 1);

    //remove from dead array
    //remove dead class
    //remove alwaysdead class
    //add alive class
    //add to living array
    //remove from birth array
    }

}

var getHeight = function () {
    return parseInt($("#height-entry").val());
}

var getWidth = function () {
    return parseInt($("#width-entry").val());
}

var GameOfLife = function(game_div, width, height) {
    this.game_div = game_div;
    this.width = width;
    this.height = height;
    this.started = false;
    this.killed = false;
    this.r = parseInt($("#radius").val());//1; //radius
    this.l = parseInt($("#lonely").val());//2; //lonely quotient
    this.o = parseInt($("#over").val());//3; //overpopulation quotient
    this.gmin = parseInt($("#min").val());//3;
    this.gmax = parseInt($("#max").val());//3;
    this.gameMode = $("#gameMode").val();
    
    this.living = [];//keeps track of those that are alive
    this.dead = [];//keeps track of those that are dead or that have always been dead
    this.birth = [];//keeps track of those set to come to life
    this.death = [];//keeps track of those set to die
    
    var table = $('<table></table>');
    var row;
    var columns;
    //can access columns by class i.e., 2-3 would access the block at (2,3)
    for(y = 0; y< height; y++){
        row = $("<tr></tr>");
        for (x=0; x< width; x++) {
            var s = x+"-"+y;
            columns = $('<td id = "'+x+'-'+y+'"></td>').addClass("alwaysdead");
            columns.removeClass("alive");
            row.append(columns);
            table.append(row);
            this.dead.push(idString(x,y));
        }
    }
    $('#play').append(table);
};

var idString = function(x,y){
    return x+'-'+y;
}

GameOfLife.prototype.kill = function () {
    if (this.killed) {
	return;
    }
    this.game_div.empty();
    this.killed = true;  
};

