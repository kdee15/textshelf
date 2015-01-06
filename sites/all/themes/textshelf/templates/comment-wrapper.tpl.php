<h2>Why don't you start a conversation?</h2>
<section class="section-comments <?php print $classes; ?>"<?php print $attributes; ?>>

	<div class="comments">
		<?php if ($content['comments'] && $node->type != 'forum'): ?>
		    <?php print render($title_prefix); ?>
		    <h2 class="title"><?php print t('Comments'); ?></h2>
		    <?php print render($title_suffix); ?>
		  <?php endif; ?>
		
		  <?php print render($content['comments']); ?>
	</div>
	
	<div class="comment-form">
	sdgfsdgdg
		<?php if ($content['comment_form']): ?>
		  <?php print render($content['comment_form']); ?>
		<?php endif; ?>
	</div>
	
</section>
