		<?php
	/**
	 * @file
	 * User has successfully authenticated with Twitter. Access tokens saved to session and DB.
	 */

	/* Load required lib files. */
	error_reporting(0);
	
	session_start();
	require_once('twitteroauth/twitteroauth.php');
	require_once('config.php');

	/* If access tokens are not available redirect to connect page. */
	if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret'])) {
		header('Location: ./clearsessions.php');
	}
	/* Get user access tokens out of the session. */
	$access_token = $_SESSION['access_token'];

	//echo "session data:";
	//print_r($_SESSION);

	/* Create a TwitterOauth object with consumer/user tokens. */
	//$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	/* If method is set change API call made. Test is called by default. */
	//$content = $connection->get('account/verify_credentials');

	/* Some example calls */
	//$connection->get('users/show', array('screen_name' => 'abraham')));
	//$connection->post('statuses/update', array('status' => date(DATE_RFC822)));
	//$connection->post('statuses/destroy', array('id' => 5437877770));
	//$connection->post('friendships/create', array('id' => 9436992)));
	//$connection->post('friendships/destroy', array('id' => 9436992)));

	?>

	<!DOCTYPE html>
	<html lang="eng">
	<head>
		<title>MWW Auto Retweet | Activation</title>
		
	<style rel="stylesheet" media="screen">

	body, div, p{
		margin:0;
		padding:0;
		font-family:Georgia, Tacoma;
		font-size:14px;
	}

	body{
		background:#efefef;
	}

	.container{
		margin:30px auto;
		width:500px;
		height:300px;
		padding:10px;
		border:1px solid #cecece;
		background:#fff;
		box-shadow:0px 0px 20px #666;
		-webkit-box-shadow:0px 0px 20px #666;
		-moz-box-shadow:0px 0px 20px #666;
		-moz-border-radius: 10px;
		border-radius: 10px;
	}

	h1{
		font-size:28px;
		font-weight:normal;
		color:#333;
		float:left;
		width:100%;
		padding:10px;
		line-height:32px;
	}

	p{
		font-size:18px;
		color:#999;
		float:left;
		width:90%;
		padding:10px;
		line-height:26px;
	}

	</style>
	</head>

	</body>

	<div class="container">
	<h1><strong style="font-size:38px;">MWW Group</strong><br /> Auto Retweet Application</h1>
	<p><strong>Thank you for signing up!</strong><br /><span style="color:#ff0000"><strong>Important:</strong> You can easily remove yourself from the list by going to your "Settings" page on your twitter account and choosing "Applications." From there you can click the "Revoke Access" button next to "MWW Auto Retweet."</span></p>
	<?php

	?>
	</div>
	</body>
	</html>
