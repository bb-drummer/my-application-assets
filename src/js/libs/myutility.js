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


