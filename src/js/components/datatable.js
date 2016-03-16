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
		        var $columnDefs = [ {
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
  
  MyApplication.plugin(Datatable, 'MyApplicationDatatable');
  
}(jQuery, window.MyApplication);