<?php

/**
 * @file
 * template.php
 */

// 0. TEMPLATE CUSTOM CODE ############################################################################################

// A.1. SEARCH ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// A.1.1. Search results page -----------------------------------------------------------------------------------------

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
    
}

// A.1.1. END ---------------------------------------------------------------------------------------------------------

// A.1.2. END ---------------------------------------------------------------------------------------------------------

function textshelf_form_alter(&$form, &$form_state, $form_id) {
    
    if ($form_id == 'search_block_form') {
        
        $form['search_block_form']['#title'] = t('Search'); // Change the text on the label element
        $form['search_block_form']['#title_display'] = 'invisible'; // Toggle label visibility
        $form['actions']['submit']['#value'] = t('GO!'); // Change the text on the submit button
        $form['actions']['submit']['#attributes']['alt'] = "Search Button"; //add alt tag
         
        // Remove the value attribute from the input tag, since it is not valid when input type = image
        unset($form['actions']['submit']['#value']);

        $form['actions']['submit'] = array('#type' => 'image_button', '#src' => base_path() . path_to_theme() . '/assets/images/icons/search.png');

        // Add extra attributes to the text box
        $form['search_block_form']['#attributes']['placeholder'] = "Enter ISBN or Keyword";
        
    }
    
}

// A.1.2. END ---------------------------------------------------------------------------------------------------------
    
// A.1. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
?>