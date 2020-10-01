<?php

//Fetches the basic info.//

$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country='.$_REQUEST['country'].'&username=surfermatty&style=full';

$ch = curl_init();
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($ch, CURLOPT_URL,$url);

 $res=curl_exec($ch);

curl_close($ch);

$decode = json_decode($res, true);

$retArr['status']['code'] = "200";
$retArr['data'] = $decode['geonames'];

header('Content-Type: application/json; charset=UTF-8');

//Fetches time zone & currency//

$url = 'https://restcountries.eu/rest/v2/alpha/'.$_REQUEST['country'];

$ch = curl_init();
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($ch, CURLOPT_URL,$url);

 $res=curl_exec($ch);

curl_close($ch);

$decode = json_decode($res, true);

$retArr['status']['code'] = "200";
$retArr['data']['timezone'] = $decode['timezones'];
$retArr['data']['currency'] = $decode['currencies'][0]['name'];
$retArr['data']['flag'] = $decode['flag'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($retArr);

?>