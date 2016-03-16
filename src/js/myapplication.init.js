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
					return (false);
				});
			});
		});
		
		return (this);
	};

	/**
	 * open modal dialog
	 * 
	 * @param  mixed  data  the modal content
	 * @param  string  updateWindowHref  URL to update browser history and location, -false/null- disables, default -false- 
	 * @return jQuery
	 */
	MyApplication.openModal = function (data, updateWindowHref) {
		if ((typeof $.fn.modal == 'undefined') && (typeof Foundation.Reveal == 'undefined')) {
			console.warn('Bootstrap Modal and/or Foundation Reveal plug-ins not found...');
			return;
		}
		var $modal = null;
		if (typeof Foundation != 'undefined') {
			if ( $('#'+MyApplication.Config.modals.foundationElementClassname).size() == 0 ) {
				$('BODY').append('<div id="'+MyApplication.Config.modals.foundationElementClassname+'" class="'+MyApplication.Config.modals.foundationElementClassname+'" data-reveal></div>')
			}
			var modalData = ''+data+'',
			    m = new Foundation.Reveal($('#'+MyApplication.Config.modals.foundationElementClassname))
			;
			$('#'+MyApplication.Config.modals.foundationElementClassname).html(data).foundation('open');
			$modal = $('.'+MyApplication.Config.modals.foundationElementClassname);
		} else {
			$modalDefaults = {
				show: true
			};
			$(data).modal($modalDefaults);
			$modal = $('.'+MyApplication.Config.modals.bootstrapElementClassname);
		}
		
		if (updateWindowHref) {
			document._old_href = window.location.href;
		    window.history.pushState(
		        {
		            "html" : null,
		            "pageTitle" : document.title
		        },
		        "",
		        updateWindowHref
		    );
		}
		
		return ($modal);
	};
	
	/**
	 * close modal dialog
	 * 
	 * @return MyApplication
	 */
	MyApplication.closeModal = function () {
		if ((typeof $.fn.modal == 'undefined') && (typeof Foundation.Reveal == 'undefined')) {
			console.warn('jQuery Modal and/or Foundation Reveal plug-ins not found...');
			return;
		}
		
		// close/destroy modals
		if (typeof Foundation != 'undefined') {
			$modal = $('.'+MyApplication.Config.modals.foundationElementClassname)
			$modal.foundation('close');
			$modal.foundation('destroy');
		} else {
			$modal = $('.'+MyApplication.Config.modals.bootstrapElementClassname)
			$modal.modal('hide');
		}
		
		// clean up
		$('BODY').removeClass('is-reveal-open');
		$('.reveal, .modal, .modal-backdrop').remove();
		
		// (re)set document URL
		if (document._old_href) {
		    window.history.pushState(
	            {
	                "html":null,
	                "pageTitle":document.title
	            },
	            "",
	            document._old_href
		    );
		    document._old_href = null;
		}
		
		return (this);
	};

	/**
	 * init modal (click) triggers
	 * 
	 * @return MyApplication
	 */
	MyApplication.initCTAXHRModals = function () {
		
		if ((typeof $.fn.modal == 'undefined') && (typeof Foundation.Reveal == 'undefined')) {
			console.warn('jQuery Modal and/or Foundation Reveal plug-ins not found...');
			return;
		}
		var $body = $('BODY'),
			$ajaxButtons  = MyApplication.Config.xhrSelectors.xhrButtons, // "A.btn[href*='add'], A.btn[href*='edit'], A.btn[href*='details'], A.btn[href*='delete']",
			$ajaxCTAOpen  = MyApplication.Config.xhrSelectors.xhrCTAOpen, // "A.btn-cta-xhr.cta-xhr-modal",
			$ajaxCTAClose = MyApplication.Config.xhrSelectors.xhrCTAClose, // ".modal-content .btn-cta-xhr-close, .modal-content .alert, .modal-content .close, .modal-content .cta-xhr-modal-close",
			$ajaxForms    = MyApplication.Config.xhrSelectors.xhrForms // ".modal-content .form-xhr"
		;
		
		//
		// modal triggers
		//
		$body.on('click', $ajaxCTAOpen, {}, function (oEvent) {
			var $this = $(this),
				$actioncontext = $.data($this, "actioncontext")
				$btnUrl = $this.attr('href');
			
			$.ajax({
				headers : {
					'Accept' : 'text/html',
					'X-layout' : 'modal'
				},
				type	: "GET",
				cache	: false,
				url		: $this.attr('href'),
				success	: function (data) {
					
					MyApplication.openModal(data, $btnUrl);

					if ($.dataTable) {
						$('.datatable').dataTable().api().ajax.reload(function ( tabledata ) {
							// console.log( tabledata );
						}, true);
					}
					
				}
			});
			
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return (false);
			
		}); 
	
		//
		// modal forms
		//
		$body.on('submit', $ajaxForms, {}, function (oEvent) {
			var $form = $(this),
				formURL = $form.attr('action'),
				formData = $form.serializeArray()
			;
			
			formData.push( 
				($form.find('INPUT[name=del].btn').size() > 0) ? {name: 'del', value: 'delete'} : null 
			);
			
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

					MyApplication.closeModal();
					MyApplication.openModal(data, $formURL);
					
					if ($.dataTable) {
						$('.datatable').dataTable().api().ajax.reload(function ( tabledata ) {
							// console.log( tabledata );
						}, true);
					}
					
				}
			});
			
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return (false);
		});

		//
		// modal close
		//
		$body.on('click', $ajaxCTAClose, {}, function (oEvent) {
			MyApplication.closeModal();
			
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return (false);
		});
		
		return (this);
	};
	
	//
	// init application components
	//
	$doc.ready(function () {
		$(document).myapplication();
		
		try {
			if (MyApplication.initCTAXHRModals) { MyApplication.initCTAXHRModals(); }
		} catch (ex) {}
		
		try {
			/*if (MyApplication.initDatatables) { MyApplication.initDatatables(); }*/
		} catch (ex) {}
		
		try {
			if (MyApplication.initCTAXHRAclMatrix) { MyApplication.initCTAXHRAclMatrix(); }
		} catch (ex) {}
	});

})(jQuery, document, window, MyApplication);