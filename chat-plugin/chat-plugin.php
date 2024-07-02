<?php
/**
 * Plugin Name: Chat Plugin
 * Description: A Vue.js-based chat plugin for WordPress.
 * Version: 1.0.0
 * Author: Your Name
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
    // wp_enqueue_script('chat-plugin-vue', 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js', [], null, true);
    wp_enqueue_script('chat-plugin-app', plugin_dir_url(__FILE__) . 'assets/js/widget-app.js', [], null, true);

  }
  add_action('wp_enqueue_scripts', 'chat_plugin_enqueue_scripts');

  $client_email_external;

  function chat_plugin_display() {
    // Retrieve stored options
    $options = get_option('chat_plugin_settings');

    // Retrieve the necessary data
    $org_token = isset($options['org_token']) ? esc_attr($options['org_token']) : '';
    $org_secret = isset($options['org_secret']) ? esc_attr($options['org_secret']) : '';
    $current_user = wp_get_current_user();
    $client_email = $current_user->user_email;
    $client_email_external = $client_email;
    $apiResponse = getApiData($client_email);
    $access_token = isset($apiResponse['access_token']) ? $apiResponse['access_token'] : '';
    $refresh_token = isset($apiResponse['refresh_token']) ? $apiResponse['refresh_token'] : '';
  }


  add_action('wp_footer', 'chat_plugin_display');

  function getApiData($client_email) {
    // Retrieve stored options
    $options = get_option('chat_plugin_settings');
    $orgToken = isset($options['org_token']) ? $options['org_token'] : '';
    $orgSecret = isset($options['org_secret']) ? $options['org_secret'] : '';

    // Check if both orgToken and orgSecret are set
    if (empty($orgToken) || empty($orgSecret)) {
      echo 'Org Token or Org Secret is not set.';
      return null;
    }

    $api_url = 'https://channel.dev.ezeeassist.io';
    $url = "$api_url/api/auth/token?org_token=$orgToken&org_secret=$orgSecret&user_id=$client_email";

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

    $apiData = json_decode($response, true);

    return $apiData;
  }

  function enqueue_chat_plugin_script() {
    // Enqueue your JavaScript file
    wp_enqueue_script('your-script-handle', plugin_dir_url(__FILE__).'assets/js/application-exec.js');

    // Retrieve necessary data
    $options = get_option('chat_plugin_settings');
    $current_user = wp_get_current_user();
    $client_email_external = $current_user->user_email;
    $apiResponse = getApiData($client_email_external);
    $access_token = isset($apiResponse['access_token']) ? $apiResponse['access_token'] : '';
    $refresh_token = isset($apiResponse['refresh_token']) ? $apiResponse['refresh_token'] : '';

    // Localize the script with data
    wp_localize_script('your-script-handle', 'pluginData', array(
      'orgToken' => isset($options['org_token']) ? esc_js($options['org_token']) : '',
      'clientEmail' => esc_js($client_email_external),
      'accessToken' => esc_js($access_token),
      'refreshToken' => esc_js($refresh_token),
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
          <th scope="row">Org Token</th>
          <td>
            <input type="text" name="chat_plugin_settings[org_token]" value="<?php echo isset($options['org_token']) ? esc_attr($options['org_token']) : ''; ?>" />
          </td>
        </tr>
        <tr valign="top">
          <th scope="row">Org Secret</th>
          <td>
            <input type="text" name="chat_plugin_settings[org_secret]" value="<?php echo isset($options['org_secret']) ? esc_attr($options['org_secret']) : ''; ?>" />
          </td>
        </tr>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <?php
}
