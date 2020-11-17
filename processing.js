var model;

async function loadModel() {

	model = await tf.loadGraphModel('TFJS/model.json'); // add await so we wait for the result, not a promise[amazon pledge to deliver order], :)
	
}

function predictImage() {
	// console.log('\nProcessing..');

	// read
	let image = cv.imread(canvas); // from openCv js
	cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0); // update image to grayscale

	// add contrast:
	// lets make pixels above a certain threshold white, rest black
	// use rbg slider to visualize, :)
	cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

	// bounding rect
	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();
	cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

	let cnt = contours.get(0);
	let rect = cv.boundingRect(cnt);
	image = image.roi(rect);

	// resize, crop & square
	// to be compliant to MNIST preops we are so close..
	// scale long edge to 20px, short edge(H or W) should be worked out using the scale factor.. imagine a long nr 2 and a short nr 2 given two ugly handwritings, :)
	// then we'll pad with 4px to get to 28x28
	var height = image.rows;
	var width = image.cols;

	if (height > width) {
		// user drew a tall af image, :)
		height = 20;
		const scaleFactor = image.rows / height;
		width = Math.round(image.cols / scaleFactor);
	} else {
		// user drew a wide _ss image, :)
		width = 20;
		const scaleFactor = image.cols / width;
		height = Math.round(image.rows / scaleFactor);
	}

	let newSize = new cv.Size(width, height);
	cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

	const LEFT = Math.ceil(4 + (20 - width) / 2);
	const RIGHT = Math.floor(4 + (20 - width) / 2);
	const TOP = Math.ceil(4 + (20 - height) / 2);
	const BOTTOM = Math.floor(4 + (20 - height) / 2);
	// console.log(`Padding -> top: ${TOP} bottom: ${BOTTOM} left: ${LEFT} right: ${RIGHT}`);

	const BLACK = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);  // Turn Testing/output canvas down below on to inspect element to see dimensions 
    
    // center of mass
    // M00 is area of our image
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;
    // console.log(`M00: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

    // shift image
    const X_SHIFT = Math.round(image.cols/2.0 - cx);
    const Y_SHIFT = Math.round(image.rows/2.0 - cy);

    newSize = new cv.Size(image.cols, image.rows);
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK); // squint to see the shift, :)

    let pixelValues = image.data;
    // console.log(`\nLolaho chi pixels before: 👇🏼 ${pixelValues}`);  // some of zeroes were paddings, rest "whitespace"


    pixelValues = Float32Array.from(pixelValues);
    
    // normalize
    // map() takes a func as input and runs it on every array element

    pixelValues = pixelValues.map(function (item) {
        return item / 255.0;
    });

    // console.log(`\nLolaho chi pixels after normalization: 👇🏼 ${pixelValues}`); 


    // tensor
    const X = tf.tensor([pixelValues]);
    // console.log(`Shape of tensor: ${X.shape}`);
    // console.log(`dType of tensor: ${X.dtype}`);

    // predict
	const result = model.predict(X);
    // result.print();

    const output = result.dataSync()[0];



    

    // // Testing/output canvas preview only (delete/comment l8r)..
	// const outputCanvas = document.createElement('CANVAS');
	// cv.imshow(outputCanvas, image);
	// document.body.appendChild(outputCanvas);

    // console.log(tf.memory()); // to detect memory bleeding, :)

	// cleanup
	image.delete();
	contours.delete();
	cnt.delete();
    hierarchy.delete();
    M.delete();
    X.dispose();
    result.dispose();


    return output;
}
