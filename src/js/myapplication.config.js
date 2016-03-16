/** @var  object  myApplication  global myApplication namespace */
if (!MyApplication) {
	var MyApplication = {};
}

/** @var  object  myApplication.Config  myApplication global configuration container */
if (!MyApplication.Config) {
	MyApplication.Config = {
		// detect UI framework
		renderer : ((typeof Foundation != 'undefined') ? 'foundation' : 'bootstrap'),
		// detect language
		lang : $('HTML').attr('lang') || 'en',
		
		// XHR selectors
		xhrSelectors : {
			xhrButtons  : "A.btn[href*='add'], A.btn[href*='edit'], A.btn[href*='details'], A.btn[href*='delete']",
			xhrCTAOpen  : "A.btn-cta-xhr.cta-xhr-modal",
			xhrCTAClose : ".modal-content .btn-cta-xhr-close, .modal-content .alert, .modal-content .close, .modal-content .cta-xhr-modal-close",
			xhrForms    : ".modal-content .form-xhr"
		},
		
		// modal settings
		modals : {
			bootstrapElementClassname  : 'modal',
			foundationElementClassname : 'reveal'
		},
		
		// dataTable plug-in settings
		dataTable : {
			langURLs : {
			    'en' : '//cdn.datatables.net/plug-ins/1.10.9/i18n/English.json',
				'de' : '//cdn.datatables.net/plug-ins/1.10.9/i18n/German.json',
				'fr' : '//cdn.datatables.net/plug-ins/1.10.9/i18n/French.json',
				'es' : '//cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json',
				'it' : '//cdn.datatables.net/plug-ins/1.10.9/i18n/Italian.json'
			},
			stateSave : true,
			stateDuration : 60 * 60 * 24 * 1  // sec * min * h * d
		},
		
	};
}
