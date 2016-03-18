/**
 * 
 */
;(function ($, window, document, MyApplication, undefined) {
    'use strict';
    

    /**
	 * init acl matrix/table ajax triggers
	 * 
	 * @return MyApplication
	 */
	$('.datatable.matrix').each(function (idx, elm) {
		var $table = $(this),
			$switches = $table.find('FORM.allow, FORM.deny')
		;
		
		$switches.each(function (idx, elm) {
			var $switchform = $(this)
			;
			$switchform.on('submit', function (oEvent) {
				var $form = $(this),
					formURL = $form.attr('action'),
					formData = $form.serializeArray(),
					$td = $form.parent()
				;
				$.ajax({
					headers : {
						'Accept' : 'text/html',
						'X-layout' : 'modal'
					},
					type	: "POST",
					cache	: false,
					url		: formURL,
					data	: formData,
					success	: function (data) {
						
						$td.find('> FORM.allow > INPUT[type=submit], > FORM.deny > INPUT[type=submit]').each(function (idx, elm) {
							var $formsubmitter = $(this);
							if ( $formsubmitter.attr('disabled') == 'disabled' ) {
								$formsubmitter.attr('disabled', false);
							} else {
								$formsubmitter.attr('disabled', 'disabled');
							}
						});
						
					}
				});
				
				oEvent.preventDefault();
				oEvent.stopPropagation();
				oEvent.stopImmediatePropagation();
				return (false);
			});
		});
	});

})(jQuery, window, document, window.MyApplication);
