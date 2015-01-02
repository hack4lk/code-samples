<?php
/**
 * @file
 * Take the user when they return from Twitter. Get access tokens.
 * Verify credentials and redirect to based on response from Twitter.
 */

/* Start session and load lib */
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

/* If the oauth_token is old redirect to the connect page. */
if (isset($_REQUEST['oauth_token']) && $_SESSION['oauth_token'] !== $_REQUEST['oauth_token']) {
  $_SESSION['oauth_status'] = 'oldtoken';
  header('Location: ./clearsessions.php');
}

/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);

/* Request access tokens from twitter */
$access_token = $connection->getAccessToken($_REQUEST['oauth_verifier']);

/* Save the access tokens. Normally these would be saved in a database for future use. */
$_SESSION['access_token'] = $access_token;

$conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or DIE('could not connect to DB');
mysql_select_db(DB_NAME) or DIE('could not select DB');

$oauth_token = $_SESSION['access_token']['oauth_token'];
$oauth_token_secret = $_SESSION['access_token']['oauth_token_secret'];
$screen_name = $_SESSION['access_token']['screen_name'];
$user_id = $_SESSION['access_token']['user_id'];

///check if the user already exists and if so do nothing
$sql = "SELECT * FROM access_token WHERE user_id  = '$user_id'";

$result = mysql_query($sql);

if( mysql_num_rows($result) < 1 ){
	$sql = "INSERT INTO access_token (id, oauth_token, oauth_token_secret, user_id, screen_name, full_name) VALUES (NULL, '$oauth_token', '$oauth_token_secret', '$user_id', '$screen_name', '') ";
	mysql_query($sql);
}

mysql_close($conn);

/* Remove no longer needed request tokens */
unset($_SESSION['oauth_token']);
unset($_SESSION['oauth_token_secret']);

/* If HTTP response is 200 continue otherwise send to connect page to retry */
if (200 == $connection->http_code) {
  /* The user has been verified and the access tokens can be saved for future use */
  $_SESSION['status'] = 'verified';
  header('Location: ./thankyou.php');
} else {
  /* Save HTTP status for error dialog on connnect page.*/
  header('Location: ./clearsessions.php');
}
