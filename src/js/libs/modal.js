/**
 * 
 */
;(function ($, window, document, MyApplication, undefined) {
  'use strict';


  MyApplication.libs.modal = {
    name : 'modal',

    version : '0.0.1',

    settings : {
      callback : function () {}
    },

    /*init : function (scope, method, options) {
      var self = this;
      // MyApplication.inherit(this, 'modulename1 modulename2');

      this.bindings(method, options);
    },*/

	/**
	 * open modal dialog
	 * 
	 * @param  mixed  data  the modal content
	 * @param  string  updateWindowHref  URL to update browser history and location, -false/null- disables, default -false- 
	 * @return MyApplication.libs.modal
	 */
	open : function (data, updateWindowHref) {
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
			var $modalDefaults = {
				show: true
			};
			$(data).modal($modalDefaults);
			$modal = $('.'+MyApplication.Config.modals.bootstrapElementClassname);
		}
		
		if (updateWindowHref) {
			MyApplication.WindowHref.reset();
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
	},
	
	/**
	 * close modal dialog
	 * 
	 * @return MyApplication.libs.modal
	 */
	close : function () {
		if ((typeof $.fn.modal == 'undefined') && (typeof Foundation.Reveal == 'undefined')) {
			console.warn('jQuery Modal and/or Foundation Reveal plug-ins not found...');
			return;
		}
		
		var $modal;
		// close/destroy modals
		if (typeof Foundation != 'undefined') {
			$modal = $('.'+MyApplication.Config.modals.foundationElementClassname);
			if ($modal) {
				try {
					$modal.foundation('close');
					$modal.foundation('destroy');
				} catch (e) {}
			}
		} else {
			$modal = $('.'+MyApplication.Config.modals.bootstrapElementClassname);
			if ($modal) {
				$modal.modal('hide');
			}
		}
		
		// clean up
		$('BODY').removeClass('is-reveal-open');
		$('.reveal, .modal, .modal-backdrop').remove();
		
		// (re)set document URL
		MyApplication.WindowHref.reset();
		
		return (this);
	}

  };

  // code, private functions, etc here...

  MyApplication.Modal = {
	  open : MyApplication.libs.modal.open,
	  close : MyApplication.libs.modal.close,
  };
  
})(jQuery, window, document, window.MyApplication);


