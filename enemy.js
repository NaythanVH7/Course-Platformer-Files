var scorpion = document.createElement("img");
scorpion.src = "scorpion.png";

var Enemy = function(x, y)
{

	this.position = new Vector2();
	this.position.set(35*TILE, 4.3*TILE);

	this.velocity = new Vector2();

	this.moveRight = true;
	this.pause = 0;
}

Enemy.prototype.update = function(deltaTime)
{

	if(this.pause > 0)
	{
		this.pause -= deltaTime;
	}
	else
	{
		var ddx = 0; 		//acceleration

		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE; 		//true if enemy overlaps right
		var ny = (this.position.y)%TILE; 		//true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		if(this.moveRight)
		{
			if(this.position.x < 1300)
			{
				ddx = ddx + 350; 		//enemy wants to go right
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = false;
				this.pause = 0.5;
			}
		}

		if(!this.moveRight)
		{
			if(this.position.x > 1000)
			{
				ddx = ddx - 350; 		//enemy wants to go left
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}
		console.log(celldiag);
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), 
													-ENEMY_MAXDX, ENEMY_MAXDX)
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	}
}

Enemy.prototype.draw = function()
{
	//var screenX = this.position.x - worldOffsetX;
	context.drawImage(scorpion, this.position.x - worldOffsetX, this.position.y);
}

