/**
 * BB's Zend Framework 2 Components
 * 
 * MyApplication client (init-)script
 *   
 * @package		[MyApplication]
 * @package		BB's Zend Framework 2 Components
 * @package		MyApplication client script
 * @author		Björn Bartels <development@bjoernbartels.earth>
 * @link		https://gitlab.bjoernbartels.earth/groups/themes
 * @license		http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @copyright	copyright (c) 2016 Björn Bartels <development@bjoernbartels.earth>
 */
if (!jQuery) {
	console.error('jQuery not found...');
	window.stop();
}
//jQuery.noConflict();



(function ($, doc, win, MyApplication) {
	
	var $doc = $(doc),
		$lang = MyApplication.Config.lang
	;
		
	
	/**
	 * init acl matrix/table ajax triggers
	 * 
	 * @return MyApplication
	 */
	MyApplication.initCTAXHRAclMatrix = function () {
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
		
		return (this);
	};


	
	
	

	//
	// init application components
	//
	$doc.ready(function () {

		$(document).myapplication();
		
		try {
			/*if (MyApplication.initCTAXHRModals) { MyApplication.initCTAXHRModals(); }*/
		} catch (ex) {}
		
		try {
			/*if (MyApplication.initDatatables) { MyApplication.initDatatables(); }*/
		} catch (ex) {}
		
		try {
			if (MyApplication.initCTAXHRAclMatrix) { MyApplication.initCTAXHRAclMatrix(); }
		} catch (ex) {}
	});

})(jQuery, document, window, MyApplication);