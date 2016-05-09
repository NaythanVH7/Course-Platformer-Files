var Enemy = function()
{
	this.image = document.createElement("img");
	this.x = 200;
	this.y = 200;
	this.width = 159;
	this.height = 163;
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;

/*
	this.position = new Vector2(this.x, this.y);
	this. velocity = new Vector2(0, 0);
*/

	this.image.src = "hero.png";
}

