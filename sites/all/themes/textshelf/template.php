<?php

	function textshelf_preprocess_node(&$variables) {
	  $variables['theme_hook_suggestions'][] = 'node__' . $variables['type'] . '__' . $variables['view_mode'];
	}

    drupal_add_js(drupal_get_path('theme', 'textshelf') .'/assets/js/components/modernizr.js');
	
	 /**
	* Implements hook_css_alter().
	* @TODO: Once http://drupal.org/node/901062 is resolved, determine whether
	* this can be implemented in the .info file instead.
	*
	* Omitted:
	* - color.css
	 * - contextual.css
	 * - dashboard.css
	 * - field_ui.css
	 * - image.css
	 * - locale.css
	 * - shortcut.css
	 * - simpletest.css
	 * - toolbar.css
	 */
	 
	 /*
	 function traaidmark_css_alter(&$css) {
	 $exclude = array(
	 'misc/vertical-tabs.css' => FALSE,
	 'modules/aggregator/aggregator.css' => FALSE,
	 'modules/block/block.css' => FALSE,
	 'modules/book/book.css' => FALSE,
	 'modules/comment/comment.css' => FALSE,
	 'modules/dblog/dblog.css' => FALSE,
	 'modules/file/file.css' => FALSE,
	 'modules/filter/filter.css' => FALSE,
	 'modules/forum/forum.css' => FALSE,
	 'modules/help/help.css' => FALSE,
	 'modules/menu/menu.css' => FALSE,
	 'modules/node/node.css' => FALSE,
	 'modules/openid/openid.css' => FALSE,
	 'modules/poll/poll.css' => FALSE,
	 'modules/profile/profile.css' => FALSE,
	 'modules/search/search.css' => FALSE,
	 'modules/statistics/statistics.css' => FALSE,
	 'modules/syslog/syslog.css' => FALSE,
	 'modules/system/admin.css' => FALSE,
	 'modules/system/maintenance.css' => FALSE,
	 'modules/system/system.css' => FALSE,
	 'modules/system/system.admin.css' => FALSE,
	 'modules/system/system.base.css' => FALSE,
	 'modules/system/system.maintenance.css' => FALSE,
	 'modules/system/system.menus.css' => FALSE,
	 'modules/system/system.theme.css' => FALSE,
	 'modules/taxonomy/taxonomy.css' => FALSE,
	 'modules/tracker/tracker.css' => FALSE,
	 'modules/update/update.css' => FALSE,
	 'modules/user/user.css' => FALSE,
	 );
	 $css = array_diff_key($css, $exclude);
	 } */