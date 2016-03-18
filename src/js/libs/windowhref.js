/**
 * 
 */
;(function ($, window, document, MyApplication, undefined) {
  'use strict';


  MyApplication.libs.windowhref = {
    name : 'windowhref',

    version : '0.0.1',

    settings : {
      callback : function () {}
    },

    init : function (scope, method, options) {
      var self = this;
      // MyApplication.inherit(this, 'modulename1 modulename2');
    },

	/**
	 * update window's href to URL and save old href
	 * 
	 * @param  string  url  URL to update to
	 * @return MyApplication.libs.windowhref
	 */
	update : function ( url ) {
		if ( (url == '') || (url == window.location.href) ) { return; }
		
		document._old_href = window.location.href;
	    window.history.pushState(
	        {
	            "html" : null,
	            "pageTitle" : document.title
	        },
	        "",
	        updateWindowHref
	    );
		
		return (this);
	},
	
	/**
	 * reset window's href to stored URL
	 * 
	 * @return MyApplication.libs.windowhref
	 */
	reset : function () {
		if (document._old_href) {
		    window.history.pushState(
	            {
	                "html":null,
	                "pageTitle":document.title
	            },
	            "",
	            document._old_href
		    );
		    this.clear();
		}
		return (this);
	},
	
	/**
	 * clear stored URL
	 * 
	 * @return MyApplication.libs.windowhref
	 */
	clearOldHref : function () {
		document._old_href = null;
		return (this);
	}

  };

  // code, private functions, etc here...

  MyApplication.WindowHref = {
	  update : MyApplication.libs.windowhref.update,
	  reset : MyApplication.libs.windowhref.reset,
	  clear : MyApplication.libs.windowhref.clearOldHref
  };
  
})(jQuery, window, document, window.MyApplication);


