var Coin = function(x, y)
{
	this.sprite = new Sprite("coin.js");
	this.sprite.buildAnimation(6, 1, 40, 40, 0.05, [0, 1, 2, 3, 4, 5]);

	this.position = new Vector2();
	this.position.set(35*TILE, 4.3*TILE);

	this.width = 40;
	this.height = 40;

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