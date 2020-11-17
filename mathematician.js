var ans;
var n1;
var n2;
var score = 0;
var falsityColor;
var backgroundImages = [];

function nextQuestion() {
	//n1 to be between 0 & 4
	n1 = Math.floor(Math.random() * 5);
	document.getElementById('n1').innerHTML = n1;

	//n2 to be between 0 & 5
	n2 = Math.floor(Math.random() * 6);
	document.getElementById('n2').innerHTML = n2;

	ans = n1 + n2;
}

function checkAnswer() {
	const prediction = predictImage();

	var teacherComments = '';
    var teacherCommentsBrief = '';
    var pupil = document.getElementById('surfer').innerHTML;
  
	if (prediction == ans) {
		// CORRECT ANSWER
		falsityColor = '#30CB00';
		teacherComments = '👍🏼 correct';
		teacherCommentsBrief = ``;
		document.getElementById('memory').innerHTML = `<font style="font-size:1.2em;">Blooms!</font>`;

        score++;
        
		if (score <= 6) {
            //special appearances within..
            backgroundImages.push(`url('images/background${score}.svg')`);
			document.body.style.backgroundImage = backgroundImages;
		} else {
			// congratulate and reset
			alert('Well done! Your math garden is in full bloom! Play again?');
			score = 0;
			backgroundImages = [];
			document.body.style.backgroundImage = backgroundImages;
			document.getElementById('lastQuestion').innerHTML = ``;
			document.getElementById('teacherComments').innerHTML = ``;
			document.getElementById('memory').innerHTML = `Memory`;
		}
	} else {
		// WRONG ANSWER
		falsityColor = '#CC0000';
		teacherComments = `👎🏼 idiot!!\n jinga kapsarr 💯 tusi not good.... but try hard next time`;
		teacherCommentsBrief = `!Oops.. Check your calculations and try writing the number neater next time<br />Your garden <font style="color:${falsityColor};">wanes!</font>`;
		document.getElementById('memory').innerHTML = `Memory`;

		if (score != 0) {
			// let teacher be merciful so score doesn't drop below zero, :)
			score--;
		}
		setTimeout(function() {
			backgroundImages.pop();
			document.body.style.backgroundImage = backgroundImages;
		}, 1000);
    }
    // update title bar
    var newPageTitle = `${pupil} Math Garden | Score: ${score}`;
    document.title = `${newPageTitle}`;


    // teacher comments
	console.log(`\n`);
	console.log(`sum: ${n1} + ${n2} = ${prediction}?`);
	console.log(`ans: ${ans}, \n teacher mark ghoha comments: ${teacherComments}, score ${score}`);

	
	document.getElementById(
		'lastQuestion'
	).innerHTML = `${n1} + ${n2} = <font style="color:${falsityColor}; font-size:1.2em; font-family:Architects Daughter;">${prediction}</font>`;
	document.getElementById('teacherComments').innerHTML = `${teacherCommentsBrief}`;
}
