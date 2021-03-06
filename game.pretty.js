//Adam Kent - MSc Computer Science COMP518-12 - 201443064 - Images drawn in photohop and paint

// HTML elements

var Area = document.getElementById("area");
var Button = document.getElementById("button");
var Score = document.getElementById("score");
var NumberOfMoves = document.getElementById("moves");

//initialising variables
var x_Select = 0;
var y_Select = 0;
var hunter_Location = [];
var theScore = 0;
var theMove = 0;
var Treasures = 0;

//strings for alerts
var alert_Setup = "typing 1-4 will place a treasure of that value on a cell, typing o will place an obstacle on a cell, typing h will place the treasure hunter on the cell.";

var alert_Controls = "a to move left, w to move up, d to move right, x to move down";

var alert_Off_Grid = "Unable to move off of the grid";

var alert_Hunter_Down = "Only one hunter can be set at a time";

var alert_Keys_Permitted = "The permitted entry keys are 1-4 for treasure, o for obstacle and h for the treasure hunter";

var alert_Obstacle = "Unable to move here as you have placed an obstacle";

var alert_Treasure = "Points added from this treasure: ";

var alert_Not_Empty = "This cell already has something in it";

var obstacleValue = 5;

var GridMap = new Array(10);

var gameState = -2; //-2 in pre-setup
window.document.onload = init();


//main init method
function init() {
    Button.innerHTML = "Setup Grid";
    NumberOfMoves.innerHTML = "0";
    Score.innerHTML = "0";
    Button.addEventListener("click", buttonClick);
}

//setup
function setupInit(isStarting) {
    gameState = -1; //-1 in setup
    Button.innerHTML = "Start";

    if (isStarting === undefined){
        alert("Click on a cell to place something in it");
        clearSettings();
    }

    for (var i = 0; i < 10; i++){
        GridMap[i] = new Array(10);
        GridMap[i].fill(0);
    }

    Area.addEventListener("click", areaClick);
    Area.addEventListener("mousemove", areaMouseOver);
}

//play
function playInit() {
    gameState = 0; //0 in play

    if(!checkSetup()){
        setupInit(true);
        return;
    }

    clearTimeouts();
    Button.innerHTML = "End Game";

    theMove = 1;
    theScore = 0;
    updateStatus();

    Area.removeAttribute("class");
    Area.removeEventListener("click", areaClick());
    Area.removeEventListener("mousemove", areaMouseOver);
    window.removeEventListener("keydown", areaConfig);


    x_Select = hunter_Location[0]*64;
    y_Select = hunter_Location[1]*64;
    alert("Game has now begun")
    if (Treasures == 0){
        finalOutput("There is no treasure to find! Please set up the game again! ");
        return;
    }
    window.addEventListener("keydown", controlHunter);
}

function clearTimeouts() {
    var highestTimeoutId = setTimeout("null");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i);
    }
}

function clearSettings() {
    while(Area.firstChild){
        Area.removeChild(Area.firstChild);
    }
    hunter_Location = [];
    theScore = 0;
    theMove = 0;
    Treasures = 0;
    x_Select = 0;
    y_Select = 0;
}

function updateStatus() {
    Score.innerHTML = theScore;
    NumberOfMoves.innerHTML = theMove;
}

function showAlert(msg){
    alert(msg);
}

function controlHunter(event) {
    window.removeEventListener("keydown", controlHunter);
    switch (event.key){
        case "a":
            updateUserPosition(-1, 0);
            break;
        case "d":
            updateUserPosition(1, 0);
            break;
        case "w":
            updateUserPosition(0, -1);
            break;
        case "x":
            updateUserPosition(0, 1);
            break;
        default:
            showAlert(alert_Controls);
            window.addEventListener("keydown", controlHunter);
            break;
    }
        return;
}


function finalOutput(argStr) {
    gameState = 1; //for the end of the game

    if (argStr === undefined){
        argStr = "";
    }
    window.removeEventListener("keydown", controlHunter);

    Button.innerHTML = "SETUP";

    alert(argStr + "Thank you for playing!");
}

function areaConfig(event) {
    var hasProcessed = false;
    if (event.key >= "1" && event.key <= "4"){
        GridMap[x_Select/64][y_Select/64] = event.key;
        Treasures += 1;
        placeObject("treasure-"+event.key);
        hasProcessed = true;
    }
    else{
        switch(event.key){
            case "o":
                GridMap[x_Select/64][y_Select/64] = obstacleValue;
                placeObject("obstacle");
                hasProcessed = true;
                break;
            case "h":
                if (hunter_Location.length == 0){
                    GridMap[x_Select/64][y_Select/64] = -2;
                    hunter_Location.push(x_Select/64);
                    hunter_Location.push(y_Select/64);
                    placeObject("hunter");
                    hasProcessed = true;
                }
                else{
                    showAlert(alert_Hunter_Down);
                }
                break;

            default:
                showAlert(alert_Keys_Permitted);
                break;
        }
    }
    if (hasProcessed){
        window.removeEventListener("keydown", areaConfig);
        Area.addEventListener("mousemove", areaMouseOver);
        Area.addEventListener("click", areaClick);
    }
}

//adding objects to the grid
function placeObject(obj) {
    var objectImg = document.createElement("IMG")
    objectImg.setAttribute("src", obj+".png");

    var objectDiv = document.createElement("DIV");
    objectDiv.setAttribute("class", "objectdiv");
    if (obj == "hunter"){
        objectDiv.setAttribute("id", "user");
    }
    if (obj.split("-")[0] == "treasure")
    {
        objectDiv.setAttribute("id",
            "treasure" + x_Select/64 + y_Select/64);
    }
    objectDiv.style.left = x_Select + "px";
    objectDiv.style.top = y_Select + "px";
    objectDiv.appendChild(objectImg);
    Area.appendChild(objectDiv);
}

function areaMouseOver(event) {
    var child = document.getElementById("selected");
    if (child != null){
        Area.removeChild(child);
    }
    //identify square
    var rect = Area.getBoundingClientRect();
    var xOffset = Math.floor((event.pageX - rect.left)/64) * 64;
    var yOffset = Math.floor((event.pageY - rect.top)/64) * 64;
    var borderDiv = document.createElement("DIV");
    borderDiv.setAttribute("id", "selected");
    borderDiv.style.left = xOffset + "px";
    borderDiv.style.top = yOffset + "px";

    Area.appendChild(borderDiv);
}

//clicking during setting up the grid
function areaClick() {
    var selectedDiv = document.getElementById("selected");

    x_Select = parseInt(selectedDiv.style.left.split("px")[0]);
    y_Select = parseInt(selectedDiv.style.top.split("px")[0]);

    // check whether it's already been set
    if (GridMap[x_Select/64][y_Select/64] != 0){
        showAlert(alert_Not_Empty);
        return;
    }

    Area.removeEventListener("mousemove", areaMouseOver);
    Area.removeEventListener("click", areaClick);


    showAlert(alert_Setup);
    window.addEventListener("keydown", areaConfig);
}

function updateUserPosition(xShiftVal, yShiftVal) {

    var estimatedPosX = hunter_Location[0] + xShiftVal;
    var estimatedPosY = hunter_Location[1] + yShiftVal;

    if (estimatedPosX < 0 || estimatedPosX >9
        || estimatedPosY < 0 || estimatedPosY > 9)
    {
        showAlert(alert_Off_Grid);
        window.addEventListener("keydown", controlHunter);
    }
    else if (GridMap[estimatedPosX][estimatedPosY] == obstacleValue){

        showAlert(alert_Obstacle);

        window.addEventListener("keydown", controlHunter);
    }
    else{
        moveUser(xShiftVal, yShiftVal);
    }
}

//for the smooth movement
function moveUser(xVal, yVal) {
    var userDiv = document.getElementById("user");

    var stepsX = 0;
    var stepsY = 0;
    if (xVal != 0 ){
        stepsX = xVal * 1; 
    }
    if (yVal != 0 ){
        stepsY = yVal * 1;
    }
    var currentX = parseInt(userDiv.style.left.split("px")[0]);
    var currentY = parseInt(userDiv.style.top.split("px")[0]);
    var targetX = (hunter_Location[0] + xVal);
    var targetY = (hunter_Location[1] + yVal);
    var treasureDiv = null;
    if (GridMap[targetX][targetY] > 0 && GridMap[targetX][targetY] < 10){
        treasureDiv = document.getElementById("treasure"+targetX+targetY);    
    }
    userDiv.style.opacity = 1;

    updateStatus();
    movit();
    function movit() {
        if (currentX != targetX*64 || currentY != targetY*64){
            currentX += stepsX;
            currentY += stepsY;
            userDiv.style.left = currentX + "px";
            userDiv.style.top = currentY + "px";
            
            setTimeout(movit, 20);
        }
        else{
            GridMap[hunter_Location[0]][hunter_Location[1]] = 0;

            hunter_Location[0] = targetX;
            hunter_Location[1] = targetY;

            x_Select = hunter_Location[0]*64;
            y_Select = hunter_Location[1]*64;

            if (treasureDiv != null){
                // remove the div
                Area.removeChild(treasureDiv);

                // update the gridmap
                var addTreasure = GridMap[targetX][targetY];

                showAlert(alert_Treasure + addTreasure);

                theScore += parseInt(addTreasure);

                Treasures -= 1;
                if (Treasures == 0){
                    updateStatus();
                    finalOutput("All treasure has been found! ");
                    return;
                }
            }
            GridMap[targetX][targetY] = -2;

            updateStatus();
        
            theMove += 1;
            updateStatus();
            window.addEventListener("keydown", controlHunter);
        }
    }
}

// making sure hunter placed
function checkSetup() {
    if (hunter_Location.length < 2){
        alert("No hunter has been placed in a cell on the grid");
        return false;
    }
    return true;
}

function buttonClick() {
    if (gameState < -1) {
        setupInit();
    }
    else if(gameState < 0) {
        playInit();
    }
    else if(gameState < 1){
        finalOutput();
    }
    else {
        setupInit();
    }
}