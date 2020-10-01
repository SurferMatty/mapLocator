<?php


$url="https://api.opencagedata.com/geocode/v1/json?q=". $_REQUEST['countryName']."&key=f532b5192a67483c872696510fb40170";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$res=curl_exec($ch);

curl_close($ch);

$decode = json_decode($res, true);


$retArr['status']['code'] = "200";
$retArr['coords'] = $decode['results'][0]['geometry'];

echo json_encode($retArr);
?>