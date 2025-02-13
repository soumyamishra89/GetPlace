
$(document).ready(function () {
	$(document).on("scroll", onScroll);

	$('a[href^="#"]').on('click', function (e) {
		e.preventDefault();
		$(document).off("scroll");

		$('a').each(function () {
			$(this).removeClass('active');
		})
		$(this).addClass('active');

		var target = this.hash;
		$target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top
		}, 500, 'swing', function () {
			window.location.hash = target;
			$(document).on("scroll", onScroll);
		});
	});
});

function onScroll(event){
	var scrollPosition = $(document).scrollTop();
	$('nav a').each(function () {
		var currentLink = $(this);
		var refElement = $(currentLink.attr("href"));
		if (refElement.position()) {
			if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
				$('nav ul li a').removeClass("active");
				currentLink.addClass("active");
			}
			else{
				currentLink.removeClass("active");
			}
		}else{
			// do nothing
		}
	});
}

jQuery(function ($) {
    // custom formatting example
    $('.timer').data('countToOptions', {
      	formatter: function (value, options) {
      		return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
      	}
    });

    // start all the timers
    $('#starts').waypoint(function() {
      	$('.timer').each(count);
    });

    function count(options) {
      	var $this = $(this);
      	options = $.extend({}, options || {}, $this.data('countToOptions') || {});
      	$this.countTo(options);
    }
});
