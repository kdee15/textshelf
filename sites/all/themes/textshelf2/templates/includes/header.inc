<span id="top"></span>

<header id="masthead">
    <div class="container">
        <section class="section-header grid">

            <!-- C.1.1. Logo -->

            <a href="<?php print $base_path; ?>" rel="home" class="text-logo">
            <img src="<?php print base_path() . path_to_theme() .'/' ?>assets/images/site/logo.png" alt="Textshelf Logo" class="logo" id="logo-textshelf" />
            </a>
            <!-- C.1.1. Navigation -->

            <nav id="nav">

                <a class="burger" href=".m-nav">

                    <svg class="svg-burger" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve" class="svg-hamburger">
                        <rect x="10" y="14" width="30" height="1"/>
                        <rect x="10" y="36" width="30" height="1"/>
                        <rect x="10" y="25" width="30" height="1"/>
                        <path d="M50,50H0V0h50V50z M49,1H1v48h48V1z"/>
                    </svg>

                </a>

                <?php print theme('links__system_main_menu', array(
                    'links' => $main_menu,
                    'attributes' => array(
                    'id' => 'm-nav',
                    'class' => 'nav m-nav',
                    ),
                )); ?>

                <a class="m-nav burger" href=".m-nav"></a>

                <?php print theme('links__system_main_menu', array(
                    'links' => $main_menu,
                    'attributes' => array(
                    'id' => 'f-nav',
                    'class' => 'nav f-nav',
                    ),
                )); ?>
                
            </nav>

        </section>
    </div>
</header>