var Coin = function(x, y)
{
	this.sprite = new Sprite("coin.png");
	this.sprite.buildAnimation(6, 1, 32, 32, 0.05, [0, 1, 2, 3, 4, 5]);

	this.position = new Vector2();
	this.position.set(35*TILE, 4.3*TILE);

	//this.width = 32;
	//this.height = 32;

	//this.position.x = 1700;
	//this.position.y = 60;
}

Coin.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

Coin.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}