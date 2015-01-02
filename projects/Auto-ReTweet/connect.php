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
	font-size:28px;
	color:#999;
	float:left;
	width:100%;
	padding:10px;
}

</style>
</head>

</body>

<div class="container">
<h1><strong style="font-size:38px;">MWW Group</strong><br /> Auto Retweet Application</h1>
<p>Click the button below to sign up for the MWW Auto retweet service.</p>
<?php
/* Build an image link to start the redirect process. */
$content = '<span style="display:block; width:100%; text-align:center; margin-top:15px; float:left;"><a href="./redirect.php"><img src="./images/lighter.png" alt="Sign in with Twitter"/></a></span>';
 
/* Include HTML to display on the page. */
echo "$content";

?>
</div>
</body>
</html>