// this creates the player object and assigns it some properties
var Player = function()
{
	this.image = document.createElement("img");
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.width = 159;
	this.height = 163;
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;


	this.image.src = "hero.png";
}

Player.prototype.update = function(deltaTime)
{
	if( typeof(this.rotation) == "undefined" )
		this.rotation = 0;

	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.rotation -= deltaTime;
		console.log("turning");
	}
	else
	{
		this.rotation += deltaTime;
	}
}