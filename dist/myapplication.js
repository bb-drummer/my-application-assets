/**
 * BB's Zend Framework 2 Components
 * 
 * myApplication client (init-)script
 *   
 * @package   [MyApplication]
 * @package   BB's Zend Framework 2 Components
 * @package   myApplication client script
 * @author    Björn Bartels <development@bjoernbartels.earth>
 * @link      https://gitlab.bjoernbartels.earth/groups/themes
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @copyright copyright (c) 2016 Björn Bartels <development@bjoernbartels.earth>
 */
!function($) {
"use strict";

var MYAPPLICATION_VERSION = '';

// Global [MyApplication] object
// This is attached to the window, or used as a module for AMD/Browserify
var MyApplication = {
  version: MYAPPLICATION_VERSION,

  /**
   * Stores initialized plugins.
   */
  _plugins: {},

  /**
   * Stores generated unique ids for plugin instances
   */
  _uuids: [],

  /**
   * Returns a boolean for RTL support
   */
  rtl: function(){
    return $('html').attr('dir') === 'rtl';
  },
  /**
   * Defines a [MyApplication] plugin, adding it to the `MyApplication` namespace and the list of plugins to initialize when reflowing.
   * @param {Object} plugin - The constructor of the plugin.
   */
  plugin: function(plugin, name) {
    // Object key to use when adding to global MyApplication object
    // Examples: MyApplication.Object1, MyApplication.Object2
    var className = (name || functionName(plugin));
    // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
    // Examples: data-objecttriggername1, data-objecttriggername2
    var attrName  = hyphenate(className);

    // Add to the MyApplication object and the plugins list (for reflowing)
    this._plugins[attrName] = this[className] = plugin;
  },
  /**
   * @function
   * Populates the _uuids array with pointers to each individual plugin instance.
   * Adds the `myappPlugin` data-attribute to programmatically created plugins to allow use of $(selector).myapplication(method) calls.
   * Also fires the initialization event for each plugin, consolidating repeditive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @param {String} name - the name of the plugin, passed as a camelCased string.
   * @fires Plugin#init
   */
  registerPlugin: function(plugin, name){
    var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
    plugin.uuid = this.GetYoDigits(6, pluginName);

    if(!plugin.$element.attr('data-' + pluginName)){ plugin.$element.attr('data-' + pluginName, plugin.uuid); }
    if(!plugin.$element.data('myappPlugin')){ plugin.$element.data('myappPlugin', plugin); }
          /**
           * Fires when the plugin has initialized.
           * @event Plugin#init
           */
    plugin.$element.trigger('init.myapp.' + pluginName);

    this._uuids.push(plugin.uuid);

    return;
  },
  /**
   * @function
   * Removes the plugins uuid from the _uuids array.
   * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
   * Also fires the destroyed event for the plugin, consolidating repeditive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @fires Plugin#destroyed
   */
  unregisterPlugin: function(plugin){
    var pluginName = hyphenate(functionName(plugin.$element.data('myappPlugin').constructor));

    this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
    plugin.$element.removeAttr('data-' + pluginName).removeData('myappPlugin')
          /**
           * Fires when the plugin has been destroyed.
           * @event Plugin#destroyed
           */
          .trigger('destroyed.myapp.' + pluginName);
    for(var prop in plugin){
      plugin[prop] = null;//clean up script to prep for garbage collection.
    }
    return;
  },

  /**
   * @function
   * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
   * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
   * @default If no argument is passed, reflow all currently active plugins.
   */
   reInit: function(plugins){
     var isJQ = plugins instanceof $;
     try{
       if(isJQ){
         plugins.each(function(){
           $(this).data('myappPlugin')._init();
         });
       }else{
         var type = typeof plugins,
         _this = this,
         fns = {
           'object': function(plgs){
             plgs.forEach(function(p){
               $('[data-'+ p +']').myapplication('_init');
             });
           },
           'string': function(){
             $('[data-'+ plugins +']').myapplication('_init');
           },
           'undefined': function(){
             this['object'](Object.keys(_this._plugins));
           }
         };
         fns[type](plugins);
       }
     }catch(err){
       console.error(err);
     }finally{
       return plugins;
     }
   },

  /**
   * returns a random base-36 uid with namespacing
   * @function
   * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
   * @param {String} namespace - name of plugin to be incorporated in uid, optional.
   * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
   * @returns {String} - unique id
   */
  GetYoDigits: function(length, namespace){
    length = length || 6;
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1) + (namespace ? '-' + namespace : '');
  },
  /**
   * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
   * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
   * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
   */
  reflow: function(elem, plugins) {

    // If plugins is undefined, just grab everything
    if (typeof plugins === 'undefined') {
      plugins = Object.keys(this._plugins);
    }
    // If plugins is a string, convert it to an array with one item
    else if (typeof plugins === 'string') {
      plugins = [plugins];
    }

    var _this = this;

    // Iterate through each plugin
    $.each(plugins, function(i, name) {
      // Get the current plugin
      var plugin = _this._plugins[name];

      // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
      var $elem = $(elem).find('[data-'+name+']').addBack('[data-'+name+']');

      // For each plugin found, initialize it
      $elem.each(function() {
        var $el = $(this),
            opts = {};
        // Don't double-dip on plugins
        if ($el.data('myappPlugin')) {
          console.warn("Tried to initialize "+name+" on an element that already has a [MyApplication] plugin.");
          return;
        }

        if($el.attr('data-options')){
          var thing = $el.attr('data-options').split(';').forEach(function(e, i){
            var opt = e.split(':').map(function(el){ return el.trim(); });
            if(opt[0]) opts[opt[0]] = parseValue(opt[1]);
          });
        }
        try{
          $el.data('myappPlugin', new plugin($(this), opts));
        }catch(er){
          console.error(er);
        }finally{
          return;
        }
      });
    });
  },
  getFnName: functionName,
  transitionend: function($elem){
    var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'otransitionend'
    };
    var elem = document.createElement('div'),
        end;

    for (var t in transitions){
      if (typeof elem.style[t] !== 'undefined'){
        end = transitions[t];
      }
    }
    if(end){
      return end;
    }else{
      end = setTimeout(function(){
        $elem.triggerHandler('transitionend', [$elem]);
      }, 1);
      return 'transitionend';
    }
  }
};


/**
 * library container/namespace
 */
MyApplication.libs = {

};

/**
 * utility container/namespace
 */
MyApplication.util = {
  /**
   * Function for applying a debounce effect to a function call.
   * @function
   * @param {Function} func - Function to be called at end of timeout.
   * @param {Number} delay - Time in ms to delay the call of `func`.
   * @returns function
   */
  throttle: function (func, delay) {
    var timer = null;

    return function () {
      var context = this, args = arguments;

      if (timer === null) {
        timer = setTimeout(function () {
          func.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }
};

// TODO: consider not making this a jQuery function
// TODO: need way to reflow vs. re-initialize
/**
 * The MyApplication jQuery method.
 * @param {String|Array} method - An action to perform on the current jQuery object.
 */
var myapplication = function(method) {
  var type = typeof method,
      $meta = $('meta.myapplication-mq'),
      $noJS = $('.no-js');

  if(!$meta.length){
    $('<meta class="myapplication-mq">').appendTo(document.head);
  }
  if($noJS.length){
    $noJS.removeClass('no-js');
  }

  if(type === 'undefined'){//needs to initialize the MyApplication object, or an individual plugin.
    MyApplication.MediaQuery._init();
    MyApplication.reflow(this);
  }else if(type === 'string'){//an individual method to invoke on a plugin or group of plugins
    var args = Array.prototype.slice.call(arguments, 1);//collect all the arguments, if necessary
    var plugClass = this.data('myappPlugin');//determine the class of plugin

    if(plugClass !== undefined && plugClass[method] !== undefined){//make sure both the class and method exist
      if(this.length === 1){//if there's only one, call it directly.
          plugClass[method].apply(plugClass, args);
      }else{
        this.each(function(i, el){//otherwise loop through the jQuery collection and invoke the method on each
          plugClass[method].apply($(el).data('myappPlugin'), args);
        });
      }
    }else{//error for no class or no method
      throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
    }
  }else{//error for invalid argument type
    throw new TypeError("We're sorry, '" + type + "' is not a valid parameter. You must use a string representing the method you wish to invoke.");
  }
  return this;
};

window.MyApplication = MyApplication;
$.fn.myapplication = myapplication;

// Polyfill for requestAnimationFrame
(function() {
  if (!Date.now || !window.Date.now)
    window.Date.now = Date.now = function() { return new Date().getTime(); };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
      window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                 || window[vp+'CancelRequestAnimationFrame']);
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function() { callback(lastTime = nextTime); },
                          nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
  /**
   * Polyfill for performance.now, required by rAF
   */
  if(!window.performance || !window.performance.now){
    window.performance = {
      start: Date.now(),
      now: function(){ return Date.now() - this.start; }
    };
  }
})();
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// Polyfill to get the name of a function in IE9
function functionName(fn) {
  if (Function.prototype.name === undefined) {
    var funcNameRegex = /function\s([^(]{1,})\(/;
    var results = (funcNameRegex).exec((fn).toString());
    return (results && results.length > 1) ? results[1].trim() : "";
  }
  else if (fn.prototype === undefined) {
    return fn.constructor.name;
  }
  else {
    return fn.prototype.constructor.name;
  }
}
function parseValue(str){
  if(/true/.test(str)) return true;
  else if(/false/.test(str)) return false;
  else if(!isNaN(str * 1)) return parseFloat(str);
  return str;
}
// Convert PascalCase to kebab-case
// Thank you: http://stackoverflow.com/a/8955580
function hyphenate(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

}(jQuery);

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

!function($, MyApplication) {

// Default set of media queries
var defaultQueries = {
  'default' : 'only screen',
  landscape : 'only screen and (orientation: landscape)',
  portrait : 'only screen and (orientation: portrait)',
  retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
    'only screen and (min--moz-device-pixel-ratio: 2),' +
    'only screen and (-o-min-device-pixel-ratio: 2/1),' +
    'only screen and (min-device-pixel-ratio: 2),' +
    'only screen and (min-resolution: 192dpi),' +
    'only screen and (min-resolution: 2dppx)'
};

var MediaQuery = {
  queries: [],
  current: '',

  /**
   * Checks if the screen is at least as wide as a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
   */
  atLeast: function(size) {
    var query = this.get(size);

    if (query) {
      return window.matchMedia(query).matches;
    }

    return false;
  },

  /**
   * Gets the media query of a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to get.
   * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
   */
  get: function(size) {
    for (var i in this.queries) {
      var query = this.queries[i];
      if (size === query.name) return query.value;
    }

    return null;
  },

  /**
   * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
   * @function
   * @private
   */
  _init: function() {
    var self = this;
    var extractedStyles = $('.myapplication-mq').css('font-family');
    var namedQueries;

    namedQueries = parseStyleToObject(extractedStyles);

    for (var key in namedQueries) {
      self.queries.push({
        name: key,
        value: 'only screen and (min-width: ' + namedQueries[key] + ')'
      });
    }

    this.current = this._getCurrentSize();

    this._watcher();

    // Extend default queries
    // namedQueries = $.extend(defaultQueries, namedQueries);
  },

  /**
   * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
   * @function
   * @private
   * @returns {String} Name of the current breakpoint.
   */
  _getCurrentSize: function() {
    var matched;

    for (var i in this.queries) {
      var query = this.queries[i];

      if (window.matchMedia(query.value).matches) {
        matched = query;
      }
    }

    if(typeof matched === 'object') {
      return matched.name;
    } else {
      return matched;
    }
  },

  /**
   * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
   * @function
   * @private
   */
  _watcher: function() {
    var _this = this;

    $(window).on('resize.zf.mediaquery', function() {
      var newSize = _this._getCurrentSize();

      if (newSize !== _this.current) {
        // Broadcast the media query change on the window
        $(window).trigger('changed.zf.mediaquery', [newSize, _this.current]);

        // Change the current media query
        _this.current = newSize;
      }
    });
  }
};

MyApplication.MediaQuery = MediaQuery;

// matchMedia() polyfill - Test a CSS media type/query in JS.
// Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
window.matchMedia || (window.matchMedia = function() {
  'use strict';

  // For browsers that support matchMedium api such as IE 9 and webkit
  var styleMedia = (window.styleMedia || window.media);

  // For those that don't support matchMedium
  if (!styleMedia) {
    var style   = document.createElement('style'),
    script      = document.getElementsByTagName('script')[0],
    info        = null;

    style.type  = 'text/css';
    style.id    = 'matchmediajs-test';

    script.parentNode.insertBefore(style, script);

    // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
    info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

    styleMedia = {
      matchMedium: function(media) {
        var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

        // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.textContent = text;
        }

        // Test if media query is true or false
        return info.width === '1px';
      }
    };
  }

  return function(media) {
    return {
      matches: styleMedia.matchMedium(media || 'all'),
      media: media || 'all'
    };
  };
}());

// Thank you: https://github.com/sindresorhus/query-string
function parseStyleToObject(str) {
  var styleObject = {};

  if (typeof str !== 'string') {
    return styleObject;
  }

  str = str.trim().slice(1, -1); // browsers re-quote string style values

  if (!str) {
    return styleObject;
  }

  styleObject = str.split('&').reduce(function(ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = parts[0];
    var val = parts[1];
    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
    return ret;
  }, {});

  return styleObject;
}

}(jQuery, MyApplication);

;(function ($, window, document, MyApplication, undefined) {
  'use strict';


  MyApplication.libs.myUtility = {
    name : 'myutility',

    version : '0.0.1',

    settings : {
      callback : function () {}
    },

    init : function (scope, method, options) {
      var self = this;
      // MyApplication.inherit(this, 'modulename1 modulename2');

      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = this.S;

      $(this.scope).off('.alert').on('click.myapp.myutility', '[' + this.attr_name() + '] .close', function (e) {
        var alertBox = S(this).closest('[' + self.attr_name() + ']'),
            settings = alertBox.data(self.attr_name(true) + '-init') || self.settings;

        e.preventDefault();
        if (Modernizr.csstransitions) {
          alertBox.addClass('myutility-close');
          alertBox.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
            S(this).trigger('close.fndtn.myutility').remove();
            settings.callback();
          });
        } else {
          alertBox.fadeOut(300, function () {
            S(this).trigger('close.fndtn.myutility').remove();
            settings.callback();
          });
        }
      });
    },

    reflow : function () {}
  };

  // code, private functions, etc here...

  MyApplication.myUtility = {
    // public properties, methods here 
  };
  
})(jQuery, window, document, window.MyApplication);



/**
 * jQuery DataTable module.
 * @module myapplication.datatable
 * @requires jQuery.datatable
 */
!function($, MyApplication){
  'use strict';

  /**
   * initializes jQuery DataTable objects on page...
   * 
   * @class Datatable
   * @param {mixed} parameters - ...
   */
  function Datatable(element, options){
		if (!$.fn.dataTable) {
			console.warn('jQuery dataTable plug-in not found...');
			return;
		}
		
	    this.$element = element;
	    this.options = $.extend({}, Datatable.defaults, this.$element.data(), options);

		this._init();
 
		MyApplication.registerPlugin(this);
  }
  
  Datatable.defaults = {
		/**
		 * options and default settings...
		 * @option
		 * @example 'value'
		 */
		//var: value
  };
  
  /**
   * Initializes the component object ...
   * @private
   */
  Datatable.prototype._init = function(){
	  	// ... init stuff
	  	this._datatable();
	  
		this._events();

 
  };
  
  /**
   * Initializes the component object ...
   * @private
   */
  Datatable.prototype._datatable = function () {
    var $id = this.$element.attr('id');

	var $table = $(this.$element),
		$lang_url = MyApplication.Config.dataTable.langURLs[MyApplication.Config.lang],
		datatableOptions = $.extend({
			renderer : ((typeof Foundation != 'undefined') ? 'foundation' : 'bootstrap'),
			language : {
				url : $lang_url
			},
			stateSave : MyApplication.Config.dataTable.stateSave,
			stateDuration : MyApplication.Config.dataTable.stateDuration  // sec * min * h * d
		}, this.options)
	;
	
	// has data source and is 'CRUD' table?
	var $src = $($table).data("src");
	if ( $src && $($table).hasClass('crud') ) {
		// set ajax options
		datatableOptions.ajax = {
			url : $src,
			type : "POST"
		};
		// set (data) columns, read from TH's 'data-column' attribute
		var $columns = false;
		$table.find('THEAD TH').each(function () {
			var columnname = $(this).data("column");
			if (columnname) {
				if (!$columns) { $columns = []; }
				$columns.push({
					data : columnname
				});
			}
		});
		if ($columns) {
			// action columns
			if ($table.find('THEAD TH.actions').size() > 0) {
				$columns.push(null);
		        $columnDefs = [ {
		            targets : -1,
		            data : "_actions_",
		            sortable : false,
		            searchable : false
		        } ];
		        datatableOptions.columnDefs = $columnDefs;
			}
			datatableOptions.columns = $columns;
		}
	}
	
	var $dataTable=  $table.dataTable(datatableOptions);
  
	return $dataTable;
	
  };


  /**
   * Initializes the component events ...
   * @private
   */
  Datatable.prototype._events = function(){
  };


  /**
   * Destroys the Component.
   * @function
   */
  Datatable.prototype.destroy = function(){
		// ... clean up stuff

		MyApplication.unregisterPlugin(this);
  };
  
  MyApplication.plugin(Datatable, 'Datatable');
  
}(jQuery, window.MyApplication);
/**
 * 
 */
/**
 * 
 */
/**
 * 
 */
/**
 * 
 */
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
	 * init jQuery dataTable plug-in
	 * 
	 * @return MyApplication
	 */
	/*MyApplication.initDatatables = function () {
		if (!$.fn.dataTable) {
			console.warn('jQuery dataTable plug-in not found...');
			return;
		}
		$('.datatable').each(function (idx, elm) {
			var $table = $(this),
				$lang_url = MyApplication.Config.dataTable.langURLs[MyApplication.Config.lang],
				datatableOptions = {
					renderer : ((typeof Foundation != 'undefined') ? 'foundation' : 'bootstrap'),
					language : {
						url : $lang_url
					},
					stateSave : MyApplication.Config.dataTable.stateSave,
					stateDuration : MyApplication.Config.dataTable.stateDuration  // sec * min * h * d
				}
			;
			
			// has data source and is 'CRUD' table?
			var $src = $($table).data("src");
			if ( $src && $($table).hasClass('crud') ) {
				// set ajax options
				datatableOptions.ajax = {
					url : $src,
					type : "POST"
				};
				// set (data) columns, read from TH's 'data-column' attribute
				var $columns = false;
				$table.find('THEAD TH').each(function () {
					var columnname = $(this).data("column");
					if (columnname) {
						if (!$columns) { $columns = []; }
						$columns.push({
							data : columnname
						});
					}
				});
				if ($columns) {
					// action columns
					if ($table.find('THEAD TH.actions').size() > 0) {
						$columns.push(null);
				        $columnDefs = [ {
				            targets : -1,
				            data : "_actions_",
				            sortable : false,
				            searchable : false
				        } ];
				        datatableOptions.columnDefs = $columnDefs;
					}
					datatableOptions.columns = $columns;
				}
			}
			
			$table.dataTable(datatableOptions);
		});
		
		return (this);
	};*/
	
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