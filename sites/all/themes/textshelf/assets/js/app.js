jQuery(document).ready(function($) {

// A.1. User Interaction
	
	//A.1.1 Show/Hide element
	
	$(".reveal").click(function(e) {
		var target = $(this).attr('href');
		if ($(target).css('display') === 'none') {
		  $('.reveal-body').fadeOut(50);
		  $(target).fadeIn(100);
		}
		else {
		  $(target).fadeOut(50);
		}
		e.preventDefault();
	  });

	
	//A.1.1 End
	
	//A.1.2 Show/Hide element for mobile
	
	$(".mobi-reveal").click(function(e) {
		var target = $(this).attr('href');
		if ($(target).css('display') === 'none') {
		  $(target).fadeIn(130);
		}
		else {
		  $(target).fadeOut(130);
		}
		e.preventDefault();
	  });
	
	//A.1.2 End
	
// A.1. End
	
// A.2. Page Elements/Effects
    
    /**
     * Written by Rob Schmitt, The Web Developer's Blog
     * http://webdeveloper.beforeseven.com/
     */

    /**
     * The following variables may be adjusted
     */
    var active_color = '#000'; // Colour of user provided text
    var inactive_color = '#ccc'; // Colour of default text

    /**
     * No need to modify anything below this line
     */

      $('input.default-value').css('color', inactive_color);
      var default_values = new Array();
      $('input.default-value').focus(function() {
        if (!default_values[this.id]) {
          default_values[this.id] = this.value;
        }
        if (this.value == default_values[this.id]) {
          this.value = '';
          this.style.color = active_color;
        }
        $(this).blur(function() {
          if (this.value == '') {
            this.style.color = inactive_color;
            this.value = default_values[this.id];
          }
        });
      });



	// A.2.2 End
	
// A.2. End
	
	
});