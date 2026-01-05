<?php
/**
 * Blank Template for Tabesh Dashboard
 * This template removes all theme headers, footers, and sidebars
 * 
 * @package Tabesh_v2
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="tabesh-blank-page">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex,nofollow">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'tabesh-dashboard-blank-page' ); ?>>
	<?php
	// Output the page content.
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	?>
	<?php wp_footer(); ?>
</body>
</html>