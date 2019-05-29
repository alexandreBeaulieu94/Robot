//make a new file on protocder and past this code into there

var arduino = boards.startArduino(9600, function(){});

//ui stuff
ui.allowScroll(true);

function ard(){
    network.httpGet("http://172.20.34.40/receive", function(status, response) { //this is the line that you have change
        //make variable equal to contents of file on http serverwasd
        var x = response[0];
        //write character to arduino over serial port
        if(x == "w"){
            arduino.write("w");
        }
        else if(x=="a"){
            arduino.write("a");
        }
        else if(x == "s"){
            arduino.write("s");
        }
        else if(x == "d"){
            arduino.write("d");
        }
        else if(x == "x"){
            arduino.write(" ");
        }
    });
}

var looper = util.loop(500, function() {
    ard();
});
