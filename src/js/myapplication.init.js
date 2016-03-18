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

(function ($, doc, win, MyApplication) {
	
	var $doc = $(doc),
		$lang = MyApplication.Config.lang
	;
		
	//
	// init my-application
	//
	$doc.ready(function () {

		$doc.myapplication();
		
	});

})(jQuery, document, window, MyApplication);