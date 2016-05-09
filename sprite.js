var sprite;

function initialize()
{
	sprite = new Sprite("ChuckNorris.png");
	sprite.buildAnimation(7, 8, 165, 126, 0.05, [12, 13, 14, 15, 16, 17, 18, 19]); //build the idle animation.
}

function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height)

	var deltaTime = getDeltaTime();

	sprite.update(deltaTime);
	sprite.draw(context, 10, 10);
}