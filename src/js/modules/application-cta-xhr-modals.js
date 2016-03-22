/**
 * initialize modal XHR triggers and watch for modal XHR forms
 */
;(function ($, window, document, MyApplication, undefined) {
    'use strict';
    
	if ((typeof $.fn.modal == 'undefined') && (typeof Foundation.Reveal == 'undefined')) {
		console.warn('jQuery Modal and/or Foundation Reveal plug-ins not found...');
		return;
	}
	var $body = $(document),
		$ajaxButtons  = MyApplication.Config.xhrSelectors.xhrButtons, // "A.btn[href*='add'], A.btn[href*='edit'], A.btn[href*='details'], A.btn[href*='delete']",
		$ajaxCTAOpen  = MyApplication.Config.xhrSelectors.xhrCTAOpen, // "A.btn-cta-xhr.cta-xhr-modal",
		$ajaxCTAClose = MyApplication.Config.xhrSelectors.xhrCTAClose, // ".modal-content .btn-cta-xhr-close, .modal-content .alert, .modal-content .close, .modal-content .cta-xhr-modal-close",
		$ajaxForms    = MyApplication.Config.xhrSelectors.xhrForms // ".modal-content .form-xhr"
	;
	
	//
	// modal triggers
	//
	var handler_initXHRModalTrigger = function (oEvent) {
		
		var $this = $(this),
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

				MyApplication.Modal.open(data, $btnUrl);

				if ( (typeof $.fn.dataTable != 'undefiened') ) {
					$('.datatable.crud').dataTable().api().ajax.reload(function ( tabledata ) {
						// console.log( tabledata );
					}, true);
				}
				
			}
		});
		
		oEvent.preventDefault();
		oEvent.stopPropagation();
		oEvent.stopImmediatePropagation();
		return (false);
		
	}; 

	//
	// modal forms
	//
	var handler_initXHRModalForm = function (oEvent) {
		var $form = $(this),
			formURL = $form.attr('action'),
			formData = $form.serializeArray()
		;
		
		formData.push( 
			($form.find('input[name=del].btn').size() > 0) ? {name: 'del', value: 'delete'} : null 
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

				MyApplication.Modal.close();
				MyApplication.Modal.open(data, formURL);
				
				if ( (typeof $.fn.dataTable != 'undefiened') ) {
					$('.datatable.crud').dataTable().api().ajax.reload(function ( tabledata ) {
						// console.log( tabledata );
					}, true);
				}
				
			}
		});
		
		oEvent.preventDefault();
		oEvent.stopPropagation();
		oEvent.stopImmediatePropagation();
		return (false);
	};

	//
	// modal close
	//
	var handler_closeModal = function (oEvent) {
		try {
			MyApplication.Modal.close();
		} catch (e) {}
		
		oEvent.preventDefault();
		oEvent.stopPropagation();
		oEvent.stopImmediatePropagation();
		return (false);
	};

	//
	// watch DOM elements
	//
	$body.on('click.myapp.xhrmodalopen',  $ajaxCTAOpen,  {}, handler_initXHRModalTrigger);
	$body.on('submit.myapp.xhrmodalsubmit', $ajaxForms,    {}, handler_initXHRModalForm);
	$body.on('click.myapp.xhrmodalclose',  $ajaxCTAClose, {}, handler_closeModal);

	$(document).ready(function () {
		$($ajaxCTAOpen).on('click.myapp.xhrmodalopen', handler_initXHRModalTrigger);
		$($ajaxForms).on('submit.myapp.xhrmodalsubmit', handler_initXHRModalForm);
		$($ajaxCTAClose).on('click.myapp.xhrmodalclose', handler_closeModal);
	});

})(jQuery, window, document, window.MyApplication);
