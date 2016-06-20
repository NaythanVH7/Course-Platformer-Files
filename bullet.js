var bullet = document.createElement("img");
bullet.src = "bullet.png";

var Bullet = function(x, y, moveRight)
{

	this.position = new Vector2();
	this.position.set(player.position.x, player.position.y);

	this.velocity = new Vector2();

	this.moveRight = moveRight;
	if(this.moveRight == true)
	{
		this.velocity.set(MAXDX *2, 0);
	}
	else
	{
		this.velocity.set(-MAXDX *2, 0);
	}
}

Bullet.prototype.update = function(deltaTime)
{
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
}

Bullet.prototype.draw = function()
{
	//var screenX = this.position.x - worldOffsetX;
	context.drawImage(bullet, this.position.x - worldOffsetX, this.position.y);
}