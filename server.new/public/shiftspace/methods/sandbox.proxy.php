<?php

$localurl = $_POST['url'];
if (empty($_POST['url'])) {
  if (empty($_GET['url']))
    exit;
  else
    $localurl = $_GET['url'];
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $localurl);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
echo curl_exec($ch);
curl_close($ch);

?>