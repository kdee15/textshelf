<!-- C. WORK AREA ++++++++++++++++++++++++++++++++++++++ -->

<!-- C.1. Masthead -->

<?php include('includes/header.inc'); ?>

<!-- C.2. End -->

<section id="mast">
	
	<div class="container">	
		<!-- C.2.1. Page -->
		<section class="page">
			<div class="wrapper">
                <!-- C.2.1 Tabs -->

                <?php if ($tabs): ?>
                  <nav class="tabbed navigation">
                    <?php print render($tabs); ?>
                  </nav>
                <?php endif; ?>
                <?php print render($title_prefix); ?>
                <?php if ($title): ?>
                  <h1 class="title" id="page-title">
                    <?php print $title; ?>
                  </h1>
                <?php endif; ?>
                <?php print render($title_suffix); ?>
                
                <section class="section-search">
                    <?php print render($page['search']); ?>
                </section>
                
                <?php print render($page['help']); ?>
                <?php if ($action_links): ?>
                  <ul class="action-links">
                    <?php print render($action_links); ?>
                  </ul>
                <?php endif; ?>
                <?php print render($page['content']); ?>
                <?php print $feed_icons; ?>

                <section class="section-region page-bottom">
                    <?php print render($page['page_bottom']); ?>
                </section>
			</div>
		</section>

	</div>	
	
</section>

<!-- C.3. Footend -->

<?php include('includes/footer.inc'); ?>

<!-- C. END ++++++++++++++++++++++++++++++++++++++ -->