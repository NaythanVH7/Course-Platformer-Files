var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
var TILE = 35;
var TILESET_TILE = TILE * 2;
var MAP = {tw: 35, th: 35};

/*
	var tx = pixelToTile(player.x),
		ty = pixelToTile(player.y),
		nx = player.x%TILE, 		//true if player overlaps right
		ny = player.y%TILE, 		//true if plauer overlaps below
		cell = cellAtTileCoord(tx,ty),
		cellright = cellAtTileCoord(tx + 1, ty),
		celldown = cellAtTileCoord(tx, ty + 1),
		celldiag = cellAtTileCoord(tx + 1, ty + 1);
*/

var METER = TILE; //abitrary choice for 1m

var GRAVITY = METER * 9.8 * 6;  //very exaggerated gravity (6x)

var MAXDX = METER * 10; // max horizontal speed ( 10 tiles per second)

var MAXDY = METER * 15; // max vertical speed ( 15 tiles per second)

var ACCEL = MAXDX * 2; //horizontal acceleration - take 1/2 second to reach maxdx

var FRICTION = MAXDX * 6; //horizontal friction - take 1/6 second to stop from maxdx

var JUMP = METER * 1500; // a large instantaneous jump impulse


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var player = new Player();
var keyboard = new Keyboard();

var cells =[];

function initialize()
{
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level1.layers[layerIdx].height; y++)
		{
			cells[layerIdx][y] = [];
			for(var x = 0; x < level1.layers[layerIdx].width; x++)
			{
				if(level1.layers[layerIdx].data[idx] !=0)
				{
					/*
						for each tile we find in the layer data, we need to create 4 collisions
						(becjause out collision squares are 35x35 but the tile in the level
						are 70x70)
					*/
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] !=1)
				{
					cells[layerIdx][y][x] = 0; 	//if the value of the cell isnt set. set it to 0 now.
				}
				idx++;
			}
		}
	}
}

function cellAtPixelCoord(layer, x, y)
{
	if(x<0 || x>SCREEN_WIDTH)
		return 1;
	//let the player fall past the bottom on the screen
	//if so, player dies.
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx<0 || tx>=MAP.tw)
		return 1;
	//let the player fall past the bottom of the screen
	//if so, player dies.
	if(ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
	console.log(tx);
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
};

function drawMap()
{
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
	{
		var idx =0;
		for(var y=0; y<level1.layers[layerIdx].height; y++)
		{
			for(var x=0; x<level1.layers[layerIdx].width; x++)
			{
				if(level1.layers[layerIdx].data[idx] !=0)
				{
					/*
						the tiles in the Tiled map are base 1
						(meaning a value of 0 means no tile)
						so subtract one from the tileset if
						to get the correct tile
					*/
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
					(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * 
					(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE,
						(y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

/*
//DEBUG DRAW LEVEL COLLISION DATA
function DrawLevelCollisionData(tileLayer) {
    for (var y = 0; y < level1.layers[tileLayer].height; y++) {
        for (var x = 0; x < level1.layers[tileLayer].width; x++) {
            if (cells[tileLayer][y][x] == 1) {
                context.fillStyle = "#F00";
                context.fillRect(TILE * x, TILE * y, TILE, TILE);
            }
        }
    }
}
//DEBUG DRAW PLAYER CELL COLLISION DATA
//fill in value of cell
        context.fillStyle = "#00F";
        context.fillRect(tx * 35, ty * 35,35,35);
        //fill in value of cellRight
        context.fillStyle = "#0FF";
        context.fillRect((tx+1) * 35, ty * 35,35,35);
        //fill in value of cellDown
        context.fillStyle = "#F90";
        context.fillRect(tx * 35, (ty+1) * 35,35,35);
        //fill in value of cellDiag
        context.fillStyle = "#F0F";
        context.fillRect((tx+1) * 35, (ty+1) * 35,35,35);
        */


function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();

	drawMap();

	//DrawLevelCollisionData(tileLayer);

	player.update(deltaTime);
	
	context.drawImage
					(
						chuckNorris, SCREEN_WIDTH/2 - 
						chuckNorris.width/2, SCREEN_HEIGHT/2 - 
						chuckNorris.height/2
					);
	
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);

	console.log(tx);
}

initialize();


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
