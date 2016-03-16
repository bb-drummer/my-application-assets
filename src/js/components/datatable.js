/**
 * jQuery DataTable module.
 * @module myapplication.datatable
 * @requires jQuery.datatable
 */
!function($, Foundation){
  'use strict';

  /**
   * initializes jQuery DataTable objects on page...
   * 
   * @class Datatable
   * @param {mixed} parameters - ...
   */
  function Datatable( parameters ){

    this._init();
 
    Foundation.registerPlugin(this);
    Foundation.Keyboard.register('Drilldown', {
      'ENTER': 'open',
      'SPACE': 'open',
      'ARROW_RIGHT': 'next',
      'ARROW_UP': 'up',
      'ARROW_DOWN': 'down',
      'ARROW_LEFT': 'previous',
      'ESCAPE': 'close',
      'TAB': 'down',
      'SHIFT_TAB': 'up'
    });
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
   * Initializes the datatable object ...
   * @private
   */
  Datatable.prototype._init = function(){
  };
  
};