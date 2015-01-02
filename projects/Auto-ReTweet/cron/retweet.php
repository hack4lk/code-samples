<?php
//error_reporting(E_ALL);
/*-----------------------------
MWW Retwitter Application
(C)Copyright 2011 MWW Group
OAUTH API (twitteroauth) is distributed under the general commons license
Author: Lukasz Karpuk
Version: 1.5(RC)
-----------------------------*/

//require twitter OAUTH API class
require_once('../twitteroauth/twitteroauth.php');
require_once('../config.php');

class Retweet{

	//set initial class vars...
	var $sourceUserID = "";
	var $accounts = array();
	var $tweetArray = array();
	var $conn = "";
	var $sql = "";
	var $source_user_record = "";
	var $source_user = "";
	var $latest_stored_tweet_data = "";
	var $latest_stored_tweet;
	var $connection;
	var $result = "";
	var $latest_tweet = "";
	var $latest_tweet_result = "";
	var $lastInsertID = ""; 
	var $processArray = array();
	var $processCount = 0;
	
	//constructor....
	function __Construct($sourceID){
		$this->sourceUserID = $sourceID;
		$this->connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
		$this->init();
	}
	
	function init(){
		//connect to db
		$this->conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or DIE('could not connect to DB');
		mysql_select_db(DB_NAME) or DIE('could not select DB');
		
		//get all user data and drop into array...
		$this->sql = "SELECT * FROM access_token";
		$this->result = mysql_query($this->sql);
		while( $row = mysql_fetch_assoc($this->result) ){
			$this->accounts[$row['user_id']] = array("oauth_token" => $row['oauth_token'], 
													"oauth_token_secret" => $row['oauth_token_secret'], 
													"user_id" => $row['user_id'], 
													"screen_name"=> $row['screen_name']);
		}
		
		//get tweet data and drop into array
		$this->sql = "SELECT * FROM latest_tweet ORDER BY id DESC LIMIT 10";
		$this->result = mysql_query($this->sql);
		
		while( $row = mysql_fetch_assoc($this->result) ){
			$this->tweetArray[$row['id']] = array("id" => $row['id'], 
													"tweet_id" => $row['tweet_id'],
													"tweet" => $row['tweet'],
													"user_id" => $row['user_id']);
		}
	}
	
	function getSourceUser(){
		$this->source_user = $this->accounts[$this->sourceUserID];
	}
	
	function getStoredTweet(){
		//select the latest stored tweet from source user...
		$this->sql = "SELECT * from latest_tweet WHERE user_id = '" . $this->source_user['user_id'] . "' ORDER BY ID DESC LIMIT 1";
		$this->latest_stored_tweet_data = mysql_query($this->sql);
		$this->latest_stored_tweet = mysql_fetch_assoc($this->latest_stored_tweet_data);
		//print_r($this->latest_stored_tweet);
	}
	
	function getLatestTweet(){
		//get the latest tweet from source user from twitter...
		$this->connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $this->source_user['oauth_token'], $this->source_user['oauth_token_secret']);
		//print_r($this->connection);
		$this->result = $this->connection->get('statuses/user_timeline.json?user_id=' . $this->source_user['user_id']);
		
		//print_r($this->result);
		$this->latest_tweet = $this->result[0];
		//print_r($this->latest_tweet);
	}
	
	function updateLatestTweet(){
		if( $this->latest_tweet->created_at != $this->latest_stored_tweet['tweet'] ){
			//echo "new tweet";
			//save the latest tweet to the database
			$this->sql = "INSERT INTO latest_tweet (id, tweet_id, tweet, user_id) Values (NULL, '" . $this->latest_tweet->id_str . "', '" . $this->latest_tweet->created_at . "', '" . $this->source_user['user_id'] . "')";
			mysql_query($this->sql);
			$this->lastInsertID = mysql_insert_id();
			
			//since we added another tweet to the table, we have to add that tweet to 
			//our tweet array
			$this->tweetArray[$this->lastInsertID] = array("id" => $this->lastInsertID, 
														"tweet_id" => $this->latest_tweet->id_str,
														"tweet" => $this->latest_tweet->created_at,
														"user_id" => $this->source_user['user_id']);
			
			//populate the twitter queue table with new tweet...
			$this->addToTwitterQueue();
		}
	}
	
	function addToTwitterQueue(){
		//add a retweet entry into the queue table for everyone except the source user... 
		foreach($this->accounts as $key => $value){
			$user = $value;
			if( $user['user_id'] != $this->source_user['user_id']){
				mysql_query("INSERT INTO tweet_queue (id, access_token_id, tweet_id) VALUES (NULL, '" . $user['user_id'] . "', '" . $this->tweetArray[$this->lastInsertID]["tweet_id"] . "') ");
			}
		}
	}
	
	function processQueue(){
		//get all tweets in the queue and put into array...
		$this->sql = "SELECT * FROM tweet_queue";
		$this->result = mysql_query($this->sql);
			
		if( mysql_num_rows($this->result) > 0){
			$tweetArray = array();
				
			while( $row = mysql_fetch_assoc($this->result) ){
				$user = $this->accounts[$row['access_token_id']];
				array_push( $this->processArray, array( "oauth_token" => $user['oauth_token'], 
														"oauth_token_secret" => $user['oauth_token_secret'],
														"tweet_id" => $row['tweet_id'],
														"retweet_id" => $row['id']
													));
			}
			
			//shuffle the array to add a level of randomization...
			shuffle($this->processArray);
			
			//choose the appropriate amount of tweets...
			//the rule is 3-7% of all re-tweets per round
			$queueCount = mysql_num_rows($this->result);
			$randomPercentSelect = rand(3,7);
			$this->processCount = ceil($queueCount * $randomPercentSelect * 0.01);
			
			$this->sendRetweets();
		}
	}
	
	function sendRetweets(){
		//process the re-tweet queue by making
		//calls to the Twitter OAUTH API 
		
		for($i = 0; $i < $this->processCount; $i++){
			//Create a TwitterOauth object with consumer/user tokens.
			$this->connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $this->processArray[$i]['oauth_token'], $this->processArray[$i]['oauth_token_secret']);

			// If method is set change API call made. Test is called by default.
			//echo "<br />retweeting: " . 'statuses/retweet/' . " : " . $this->processArray[$i]['tweet_id'];
			$response = $this->connection->post('statuses/retweet/' . $this->processArray[$i]['tweet_id']);
			
			//print_r($response);
			//after a successful retweet, remove that entry from the re-tweet table
			$this->sql = "DELETE FROM tweet_queue WHERE id = " . $this->processArray[$i]['retweet_id'];
			mysql_query($this->sql);
		}
		
		mysql_close($this->conn);
	}
	
}


$test = new Retweet("xxxx====redacted======xxxx");
$test->getSourceUser();
$test->getStoredTweet();
$test->getLatestTweet();
$test->updateLatestTweet();
$test->processQueue();
?>