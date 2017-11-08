'use strict';

var droppable;
var droppedScrufadorUnits = 0, aquariumContent = 0;

function createDraggable() {
	var pos;
	Draggable.create('.scrufador', {
		bounds: window,
		onDragStart: function(e) {
			pos = $(this.target).find('.scrufadorInner').position();
			droppable = this.target;
			droppable.startX = this.x;
			droppable.startY = this.y; 
			// console.log('Item: ', $(this), ' clicked');
			this.startX = this.x;
			this.startY = this.y;
		},		
		onDragEnd: function(e) {
			$("#wrapper").addClass('disabled');
			if( this.hitTest('.maincontent__image', '50%') ) {
				// console.warn('hittest true')
				$(this.target).find('.scrufadorInner').addClass('hiding');
				// console.warn("this position: x, y", pos.left, pos.top)

				// let ourX = 410 - pos.left;
				// let ourY = 100 - pos.top;
				// TweenLite.to(droppable, 0.5, {
				// 	x: ourX,
				// 	y: ourY
				// });
				let _id = $(droppable).attr('id').slice(-1)
 				addWaterToAquarium(_id);
 				droppedScrufadorUnits++;
 				$('.scrufador .scrufadorInner.hiding').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
 					// console.log("animation end, this.target: ", droppable.startX, droppable.startY)
					TweenLite.to(droppable, 0.3, {
						x: 0,
						y: 0,
						onComplete: function() {
							$(droppable).removeClass('hiding');
							$(droppable).find('.scrufadorInner').removeClass('hiding');
							$("#wrapper").removeClass('disabled');
						}
					});
				});
			}
			else {
				// console.warn("hittest wrong, this.target: ", this.target)
				TweenLite.to(this.target, 0.3, {
					x: 0,
					y: 0
				});
				$("#wrapper").removeClass('disabled');
			}
		}
	});
}

function addWaterToAquarium(_id) {
	// console.log('arrayOfDisplacements: ', arrayOfDisplacements)
	try {
		var value = arrayOfDisplacements[_id];
		updateCurrentContent(value, aquariumContent);
		aquariumContent = aquariumContent*1.0 + value*1.0;
		moveWater();
	}
	catch( err) {
		console.warn(err)
		console.warn('value: ', value)
	}
}

function updateCurrentContent(value) {
    $('.currentContent .number').prop('Counter',aquariumContent).animate({
        Counter: parseInt(aquariumContent)+parseInt(value)
    }, {
        duration: 1600,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
}

function moveWater() {
	var percentage = 100 - (aquariumContent / aquariumDisplacement * 100);
	if( percentage < 0) {
		percentage = 0;
	}
	let _duration = 200 + (percentage)*8;
	 $('.maincontent__water').css({
	   top: percentage+'%',
	   'transition-duration' : _duration+'ms',
	   'transition-property' : 'all',
	   'transition-timing-function' : 'ease-in-out'
	 });
}

function updateFeedbackItems() {
	// count how many items have class solved!
	$('.feedback-items:not(.active):first').addClass('active');

	if ( $('.feedback-items.active').length == number_of_examples) {
		$('.finalGreeting').addClass('active');
		$('.buttons').addClass('disabled');
	}
	else {
		console.log("Lesson not completed yet")
	}
}

$('#buttonCheck').on('click', function() {
	console.log('checkResult(aquariumContent): ', checkResult(aquariumContent) )
	if( checkResult(aquariumContent)) {
		updateFeedbackItems();
		$('#buttonNextWrapper').addClass('active');
		$('#buttonCheckWrapper').removeClass('active');	
	}
	else {
		$(this).addClass('rubberBand');
		$(this).one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {
			$(this).removeClass('rubberBand');
		});
		lightReset();
	}
});

$('#buttonNext').on('click', function() {
	$('#buttonCheckWrapper').addClass('active');	
	$('#buttonNextWrapper').removeClass('active');	
	loadNextLesson();
});

function checkResult(s) {
	console.log('s: ', s, "numberToBeComposed", numberToBeComposed)
	if( s == numberToBeComposed) {
	   if( droppedScrufadorUnits == minimumScrufadorUnits) {
	   	return true;
	   }
	   else {
	   	return false;
	   }
	}
	else {
		return false;
	}
}

$('.finalGreeting .finalGreeting_button').on('click', function() {
	playAgain();
});

$('body').on('keydown', function(e) {
	if( e.which == 27) {
		if( $('.finalGreeting').hasClass('active') ){
			console.log("triggering closebutton")
			$('.closeButton.finalGreeting__closeBtn').trigger("click");		
		}
	}
});

function lightReset() {
	droppedScrufadorUnits = 0;
	aquariumContent = 0;
	$('.currentContent .currentContent__inner .number').text('0');
	moveWater();
}

function loadNextLesson() {
	lightReset();
	populateMainContent($('.feedback-items.active').length);
}

function hardReset() {
	lightReset();
	populateMainContent(0);
	resetCounters();
	fillNumbersToBeComposed();
	$('#feedbackContent .feedback-items').removeClass('solved');
	$("#wrapper").removeClass('disabled');
}

$('#closeButton').on('click', function() {
	window.history.back();
});

$('.closeButton.finalGreeting__closeBtn').on('click', function() {
	playAgain();
});

function playAgain() {
	// play again
	$("#wrapper").addClass('disabled');
	hardReset();
	$('.finalGreeting').removeClass('active');
	$('.buttons').removeClass('disabled');
	$('#buttonCheckWrapper').addClass('active');	
	$('#buttonNextWrapper').removeClass('active');		
}

function resetCounters() {
	$('.solved').removeClass('solved');
	$('.feedback-items').removeClass('active');	
}