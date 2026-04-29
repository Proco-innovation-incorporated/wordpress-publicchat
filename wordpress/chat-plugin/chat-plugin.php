<?php
/**
 * Plugin Name: EZee Assist Chat Plugin
 * Description: A Vue.js-based chat plugin for WordPress.
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
    wp_enqueue_script(
      'chat-plugin-app',
      plugin_dir_url(__FILE__) . 'assets/js/widget-app.js',
      [],
      'VERSION_PLACEHOLDER',
      true
    );
  }
  add_action('wp_enqueue_scripts', 'chat_plugin_enqueue_scripts');

  function chat_plugin_display() {
    // Retrieve stored options
    $options = get_option('chat_plugin_settings');

    // Retrieve the necessary data
    $public_token = has_value($options['public_token']) ? esc_attr($options['public_token']) : '';

    $private_token = has_value($options['private_token']) ? esc_attr($options['private_token']) : '';
  }

  add_action('wp_footer', 'chat_plugin_display');

  function get_user_token($private_token, $client_email) {
    $api_url = 'https://channel.prod.ezeeassist.io';
    $url = "$api_url/api/streamchat/org/auth?token=$private_token&email=$client_email";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // You might want to turn this on in production
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // You might want to turn this on in production

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
      echo 'Error:' . curl_error($ch);
      return null;
    }

    curl_close($ch);

    $auth_response = json_decode($response, true);

    return has_value($auth_response['token']) ? $auth_response['token'] : null;
  }

  function get_current_user_email() {
    try {
      $current_user = wp_get_current_user();
      return $current_user->user_email;
    }
    catch(Exception $e) {
      return NULL;
    }
  }

  function has_value($value) {
    return isset($value) && !empty($value);
  }

  function enqueue_chat_plugin_script() {
    // Enqueue your JavaScript file
    wp_enqueue_script(
      'your-script-handle',
      plugin_dir_url(__FILE__).'assets/js/application-exec.js',
      [],
      'VERSION_PLACEHOLDER',
    );

    // Retrieve necessary data
    $options = get_option('chat_plugin_settings');

    $is_public_chat = has_value($options['public_token']);
    $is_private_chat = has_value($options['private_token']);
    $client_email_external = get_current_user_email();

    $has_user_email = has_value($client_email_external);

    // Call api for user token
    $user_token = $is_private_chat && $has_user_email ? get_user_token($options['private_token'], $client_email_external) : null;
    $has_user_token = has_value($user_token);

    // Localize the script with data
    if ($has_user_token) {
      wp_localize_script('your-script-handle', 'pluginData', array(
        'pluginBasePath' => esc_js(plugin_dir_url(__FILE__)),
        'publicToken' => '',
        'privateToken' => '',
        'userEmail' => '',
        'userToken' => esc_js($user_token),
      ));
    }
    elseif ($is_private_chat) {
      wp_localize_script('your-script-handle', 'pluginData', array(
        'pluginBasePath' => esc_js(plugin_dir_url(__FILE__)),
        'publicToken' => '',
        'privateToken' => esc_js($options['private_token']),
        'userEmail' => $has_user_email ? esc_js($client_email_external) : '',
        'userToken' => '',
      ));
    }
    elseif ($is_public_chat) {
      wp_localize_script('your-script-handle', 'pluginData', array(
        'pluginBasePath' => esc_js(plugin_dir_url(__FILE__)),
        'publicToken' => esc_js($options['public_token']),
        'privateToken' => '',
        'userEmail' => '',
        'userToken' => '',
      ));
    }

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
          <th scope="row" colspan="2" style="text-align: left;">Provide only one Token</th>
        </tr>
        <tr valign="top">
          <th scope="row">Public Token</th>
          <td>
            <input type="text" name="chat_plugin_settings[public_token]" value="<?php echo isset($options['public_token']) ? esc_attr($options['public_token']) : ''; ?>" />
          </td>
        </tr>
        <tr valign="top">
          <th scope="row">Private Token</th>
          <td>
            <input type="text" name="chat_plugin_settings[private_token]" value="<?php echo isset($options['private_token']) ? esc_attr($options['private_token']) : ''; ?>" />
          </td>
        </tr>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <?php
}
