( function() {
  "use strict";
 
	var json = 'data.json';
  var wateringCans = 'wateringCans.json';

  var page_title,
      background_color,
      background_right_shape_color,
      background_right_shape_opacity,
      background_image,
      header_text,
      header_allCaps,
      header_fontBold,
      header_textAlignCenter,
      header_fontSize,
      number_of_examples = 0,
      buttonCheck_text,
      buttonCheck_hover_bgr_color,
      buttonCheck_background_color,
      feedback_buttons_on_curvedPath,
      final_greeting_message,
      final_greeting_button_text,
      number_of_examples,
      numberToBeComposed,
      numbersToBeComposed = [],
      numberToBeComposed_min,
      numberToBeComposed_max,
      arrayOfDisplacements = [],
      number_of_scrufadors = 0,
      aquariumDisplacement = 100;

  $.getJSON( wateringCans)
  .done(onWateringCanComplete)
  .fail( function(error) {
    console.log("Request failed: " +err );
  });    

  function onWateringCanComplete(data) {
    jQuery.each(data, function(i, val) {
      arrayOfDisplacements.push(val.displacement);
      number_of_scrufadors++;
    });
    window.arrayOfDisplacements = arrayOfDisplacements;
    window.aquariumDisplacement = aquariumDisplacement;
    $.getJSON( json)
    .done(onJsonComplete)
    .fail( function(error) {
      console.log("Request failed: " +err );
    });
  }

  function onJsonComplete(data) {
    // console.log("getjson returns: ", data.parameters.background_color[0].value)
    try {
      page_title = data.parameters.page_title[0].value;
      background_color = data.parameters.background_color[0].value;
      background_right_shape_color = data.parameters.background_right_shape_color[0].value;
      background_right_shape_opacity = parseFloat(data.parameters.background_right_shape_opacity[0].value);
      header_text = data.parameters.header_text[0].value;
      header_allCaps = data.parameters.header_allCaps[0].value;
      header_fontBold = data.parameters.header_fontBold[0].value;
      header_textAlignCenter = data.parameters.header_textAlignCenter[0].value;
      header_fontSize = data.parameters.header_fontSize[0].value;
      buttonCheck_text = data.parameters.buttonCheck_text[0].value;
      buttonCheck_background_color = data.parameters.buttonCheck_background_color[0].value;
      buttonCheck_hover_bgr_color = data.parameters.buttonCheck_hover_bgr_color[0].value;
      feedback_buttons_on_curvedPath = data.parameters.feedback_buttons_on_curvedPath[0].value;
      final_greeting_message = data.parameters.final_greeting_message[0].value;
      final_greeting_button_text = data.parameters.final_greeting_button_text[0].value;
      numberToBeComposed_min = data.parameters.numberToBeComposed_min[0].value;
      numberToBeComposed_max = data.parameters.numberToBeComposed_max[0].value;
      number_of_examples = data.parameters.number_of_examples[0].value;
    }
    catch(e) {
      console.warn("Error reading podiumdata: ", e)
    }

    window.number_of_examples = number_of_examples;
    
    // temporary
    // numbersToBeComposed = [1, 2, 5];

    window.fillNumbersToBeComposed = function(e) {
      numbersToBeComposed = [];

      // temporary
      numbersToBeComposed.push(10);
      numbersToBeComposed.push(15);
      numbersToBeComposed.push(20);
      numbersToBeComposed.push(2);

      Shuffle(numbersToBeComposed);
    }

    function Shuffle(o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    fillNumbersToBeComposed();
    // console.log('numbersToBeComposed: ', numbersToBeComposed)
    
    window.populateMainContent = function(n) {
      numberToBeComposed = numbersToBeComposed[n];
      window.numberToBeComposed = numberToBeComposed;
      
      minimumScrufadorUnits = getMinimumScrufadorUnits(numberToBeComposed);
      window.minimumScrufadorUnits = minimumScrufadorUnits;
      $('.main__num p').text(numberToBeComposed);
      setNumberToBeComposed(n);
      $('.currentContent .currentContent__inner .number').text('0');
    }

    setBackgrounds(background_image, background_right_shape_color, background_color);
    populateHeader();
    populateMainContent(0);
    addHoverToButtonNext();
    
    fillButtonCheck();   
    fillScrufadors(); 
    populateFinalGreeting(final_greeting_message, final_greeting_button_text);
    populateFeedbackWrapper(number_of_examples, feedback_buttons_on_curvedPath);
    $('#buttonCheck p').text(buttonCheck_text);
    $('#buttonCheck').css({
      'background-color' : buttonCheck_background_color
    });    
    createDraggable();
	}

  function setNumberToBeComposed(n) {
    $('.numberToBeComposed .numberToBeComposed__inner .number').text(numbersToBeComposed[n]);
  }
  
  function setBackgrounds(img, sha, clr) {
    $('#wrapper').css({
      'background-color' : clr
    });

    if( img != undefined) {
      // Sample usage
      var imageUrl = img;
      imageExists(imageUrl, function(exists) {
        // console.log('RESULT: url=' + imageUrl + ', exists=' + exists);
        if( exists == true) {
         $('#wrapper').css({
            'background-image' : 'url('+img+')'
          });  
        }
      });
    }

    var s = Snap('#svg_right_shape');
    Snap.load("assets/images/rightShape2.svg", onSVGLoaded);
    
    function onSVGLoaded(data) {
      // following line does nothing
      Snap(data.node).select('#rightShape path').attr('fill', background_right_shape_color);
      s.append(data); 
    }
    $('#svg_right_shape').css({
      'opacity' : background_right_shape_opacity
    });
  }  //setBackground end  

  function populateHeader() {
    document.title = page_title;
    $("#headingWrapper #heading p").html(header_text);
    if( header_allCaps.toUpperCase() == "TRUE" ) {
      $("#headingWrapper #heading p").css({ 'text-transform' : 'uppercase' });
    }
    if( header_fontBold.toUpperCase() == "TRUE" ) {
      $("#headingWrapper #heading p").css({ 'font-weight' : 'bold' });
    }
    if( header_textAlignCenter.toUpperCase() ==  "TRUE") {
      $("#headingWrapper #heading p").css({ 'text-align' : 'center' });
    }
    $("#headingWrapper #heading p").css({ 'font-size' : header_fontSize+'px' });
  }

  var snap_buttonNext = Snap('#buttonNext');
  function addHoverToButtonNext() {
    Snap.load("assets/images/buttonNext.svg", onSVGLoaded_2);
    
    function onSVGLoaded_2(data) {
      snap_buttonNext.append(data); 
        $("#buttonNext").on('mouseleave', function() {
          // Snap(data.node).select('#buttonNext svg #border polygon').animate({ stroke: '#120309'}, 100);
        });
        $("#buttonNext").on('mouseenter', function() {
          // Snap(data.node).select('#buttonNext svg #border polygon').animate({ stroke: '#2E0F15'}, 100);
        });        
    }
  }  
  
  function fillButtonCheck() {
    $('#buttonCheck p').text(buttonCheck_text);
    $('#buttonCheck').css({
      'background-color' : buttonCheck_background_color
    });
    $('#buttonCheck').hover( function() {
      $(this).css({
        'background-color' : buttonCheck_hover_bgr_color
      });
    });
    $('#buttonCheck').mouseleave( function() {
      $(this).css({
        'background-color' : buttonCheck_background_color
      });
    });    
  }   

  function fillScrufadors() {
    for( var j=0; j<number_of_scrufadors; j++) {
      var p = arrayOfDisplacements[j];
      $('.scrufadorWrapper').append("<div class='scrufador scrufador__0"+j+"' id='scrufadorId_"+j+"'><div class='scrufadorInner'><p>"+p+"<span>&thinsp;&thinsp;l</span></p></div></div>");
      try {
        $('.scrufador__0'+j+' .scrufadorInner').css({
          'background-image' : 'url(assets/images/skrufador.png)'
        });
      }
      catch(e2) {
        console.error("Error loading scrufadors: ", e2)
      }
      
    }
    // $('.moneyWrapper').clone().addClass('staticCopy').prependTo('#wrapper');
  }

  function populateFinalGreeting(msg, btn_txt) {
    $('.finalGreeting .finalGreeting__message p').text(msg);
    $('.finalGreeting .finalGreeting_button p').text(btn_txt);
  }

  function populateFeedbackWrapper(n, curved) {
    for( let i=0; i<n; i++) {
      if( curved.toUpperCase() == "TRUE") {
        $('#feedbackWrapper #feedbackContent').append("<div class='feedback-items curved'></div>");  
      }
      else {
       $('#feedbackWrapper #feedbackContent').append("<div class='feedback-items'></div>");   
      }
    }
  }

  function getMinimumScrufadorUnits(rest) {
    // console.log('rest: ', rest)
    var unitsCounter = 0, nTimes;
    var j = arrayOfDisplacements.length - 1;
    while( rest > 0) 
    {
      nTimes = rest / arrayOfDisplacements[j];
      if( nTimes < 1) {
        j--;
        continue;
      }
      else {
        let numOfUnits = Math.floor(rest/arrayOfDisplacements[j]);
        rest = rest - Math.floor(rest/arrayOfDisplacements[j])*arrayOfDisplacements[j];
        unitsCounter+=numOfUnits;
        // console.log("We need ", numOfUnits, " * ", arrayOfDisplacements[j], "e. Unitscounter: ", unitsCounter);
        j--;
      }
    }
    // console.log('unitsCounter', unitsCounter)
    window.minimumScrufadorUnits = unitsCounter;
    return unitsCounter;
  }
})();















































































