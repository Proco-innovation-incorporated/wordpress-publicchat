<?php
/**
 * Plugin Name: EZee Assist Public Chat Plugin
 * Description: A Vue.js-based chat plugin for WordPress.
 * Version: 0.0.16
 * Author: EZee Assist
 */


if (!defined("ABSPATH")) {
  exit; // Exit if accessed directly
}
function is_divi_builder_active() {
  return strpos($_SERVER['REQUEST_URI'], 'et_fb') !== false;
}

if(defined('DOING_CRON') || defined('REST_REQUEST')) {
  exit;
}

if(!is_divi_builder_active() && !is_admin()) {
  function chat_plugin_enqueue_scripts() {
    wp_enqueue_script('chat-plugin-app', plugin_dir_url(__FILE__) . 'assets/js/widget-app.js', [], null, true);

  }
  add_action('wp_enqueue_scripts', 'chat_plugin_enqueue_scripts');

  $client_email_external;

  function chat_plugin_display() {
    // Retrieve stored options
    $options = get_option('chat_plugin_settings');

    // Retrieve the necessary data
    $public_token = isset($options['public_token']) ? esc_attr($options['public_token']) : '';
  }


  add_action('wp_footer', 'chat_plugin_display');

  function enqueue_chat_plugin_script() {
    // Enqueue your JavaScript file
    wp_enqueue_script('your-script-handle', plugin_dir_url(__FILE__).'assets/js/application-exec.js');

    // Retrieve necessary data
    $options = get_option('chat_plugin_settings');

    // Localize the script with data
    wp_localize_script('your-script-handle', 'pluginData', array(
      'publicToken' => isset($options['public_token']) ? esc_js($options['public_token']) : '',
      'pluginBasePath' => esc_js(plugin_dir_url(__FILE__)),
    ));
  }
  add_action('wp_enqueue_scripts', 'enqueue_chat_plugin_script');
}

// Add settings page to the admin menu
function chat_plugin_add_admin_menu() {
  add_menu_page(
    'Chat Plugin Settings',
    'Chat Plugin',
    'manage_options',
    'chat-plugin',
    'chat_plugin_settings_page'
  );
}
add_action('admin_menu', 'chat_plugin_add_admin_menu');

// Register settings
function chat_plugin_register_settings() {
  register_setting('chat_plugin_settings_group', 'chat_plugin_settings');
}
add_action('admin_init', 'chat_plugin_register_settings');

// Settings page HTML
function chat_plugin_settings_page() {
  ?>
  <div class="wrap">
    <h1>Chat Plugin Settings</h1>
    <form method="post" action="options.php">
      <?php
      settings_fields('chat_plugin_settings_group');
      do_settings_sections('chat_plugin_settings_group');
      $options = get_option('chat_plugin_settings');
      ?>
      <table class="form-table">
        <tr valign="top">
          <th scope="row">Public Token</th>
          <td>
            <input type="text" name="chat_plugin_settings[public_token]" value="<?php echo isset($options['public_token']) ? esc_attr($options['public_token']) : ''; ?>" />
          </td>
        </tr>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <?php
}
