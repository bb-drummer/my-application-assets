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
			$switchform.on('submit.myapp.aclmatrix', function (oEvent) {
				var $form = $(this),
					$class = $form.hasClass('allow') ? 'allow' : 'deny',
					formURL = $form.attr('action'),
					formData = $form.serializeArray(),
					$td = $form.parents('td').first()
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
						var enabledSel = 'INPUT[type=submit]:not(:disabled), INPUT[type=submit]:not([disabled=disabled])';
						var disabledSel = 'INPUT[type=submit]:disabled, INPUT[type=submit][disabled=disabled]';
						$form.find( enabledSel ).attr('disabled', 'disabled');
						$form.next().find( disabledSel ).attr('disabled', false);
						$form.prev().find( disabledSel ).attr('disabled', false);
					}
				});
				
				oEvent.preventDefault();
				oEvent.stopPropagation();
				//oEvent.stopImmediatePropagation();
				return (false);
			});
		});
	});

})(jQuery, window, document, window.MyApplication);
