const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#EFEFEF';
const LINE_WIDTH = 12;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var isPainting = false;

var canvas;
var context;

var surfer = prompt('Please enter your name', '');



function prepareCanvas() {
	// console.log('Preparing canvas..');
	if (surfer != null) {
		document.getElementById('surfer').innerHTML = `${surfer}'s `;
		console.log(`Welcome ${surfer}!`);

		var newPageTitle = `${surfer}'s ${document.title}`;
		document.title = `${newPageTitle}`;
	}

	canvas = document.getElementById('my-canvas');
	context = canvas.getContext('2d');

	context.fillStyle = BACKGROUND_COLOR;
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	context.strokeStyle = LINE_COLOR;
	context.lineWidth = LINE_WIDTH;
	context.lineJoin = 'round';

	//Mouse events - desktop
	document.addEventListener('mousedown', function(event) {
		// console.log('\n!!click');

		isPainting = true;

		currentX = event.clientX - canvas.offsetLeft;
		currentY = event.clientY - canvas.offsetTop;

		// console.log(`!!click global coords X,Y: (${event.clientX}, ${event.clientY})`)
		// console.log(`!!click canvas coords X,Y: (${currentX}, ${currentY})`)
		// console.log(`!!click, is painting:${isPainting}`);
	});

	document.addEventListener('mousemove', function(event) {
		// console.log('\n!!move');

		if (isPainting) {
			previousX = currentX;
			currentX = event.clientX - canvas.offsetLeft;

			previousY = currentY;
			currentY = event.clientY - canvas.offsetTop;

			// console.log(`!!move global coords X,Y: (${event.clientX}, ${event.clientY})`)
			// console.log(`!!move canvas coords X,Y: (${currentX}, ${currentY})`)

			draw();
		}
	});

	document.addEventListener('mouseup', function(event) {
		// console.log('\n!!mouse released');

		isPainting = false;

		// console.log(`!!mouse released, is painting:${isPainting}`);
	});

	canvas.addEventListener('mouseleave', function(event) {
		// console.log('\n!!mouse left canvas, uh oh');

		isPainting = false;
	});

	//Touch events - tablet, phones
	//lets roll with the first touch ie touches[0], :)
	canvas.addEventListener('touchstart', function(event) {
		// console.log('\n!!touch');

		isPainting = true;

		currentX = event.touches[0].clientX - canvas.offsetLeft;
		currentY = event.touches[0].clientY - canvas.offsetTop;
	});

	canvas.addEventListener('touchmove', function(event) {
		// console.log('\n!!touch move');

		if (isPainting) {
			previousX = currentX;
			currentX = event.touches[0].clientX - canvas.offsetLeft;

			previousY = currentY;
			currentY = event.touches[0].clientY - canvas.offsetTop;

			draw();
		}
	});

	canvas.addEventListener('touchend', function(event) {
		// console.log('\n!!touch on canvas ended');

		isPainting = false;
	});

	canvas.addEventListener('touchcancel', function(event) {
		// console.log('\n!!touch cancelled');

		isPainting = false;
	});
}

function draw() {
	context.beginPath();
	context.moveTo(previousX, previousY);
	context.lineTo(currentX, currentY);
	context.closePath();
	context.stroke();
}

function clearCanvas() {
	currentX = 0;
	currentY = 0;
	previousX = 0;
	previousY = 0;

	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}
