<?php

/**
 * @file
 * template.php
 */

// 0. TEMPLATE CUSTOM CODE ############################################################################################

// A.1. SEARCH ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function textshelf_template_preprocess_search_results(&$variables) {
    
    $variables['search_results'] = '';
    
    if (!empty($variables['module'])) {
        $variables['module'] = check_plain($variables['module']);
    }
    foreach ($variables['results'] as $result) {
        $variables['search_results'] .= theme('search_result', array('result' => $result, 'module' => $variables['module']));
    }
    
    $variables['pager'] = theme('pager', array('tags' => NULL));
    $variables['theme_hook_suggestions'][] = 'search_results__' . $variables['module'];

    // Add image to product search result 
    if ($result['node']->type == "classified") {
        
        $node = node_load($result['node']->nid);
        $field_product_image = field_view_field('node', $node, 'field_product_image', $display = array());
        $variables['image'] = $field_product_image;
        
    }
    
    
}
    
// A.1. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
?>