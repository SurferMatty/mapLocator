<?php

//Gets places//
$url = 'http://api.geonames.org/citiesJSON?north='. $_REQUEST['north']. '&south='. $_REQUEST['south']. '&east='. $_REQUEST['east']. '&west='. $_REQUEST['west']. '&lang=en&username=surfermatty';

$ch = curl_init();
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($ch, CURLOPT_URL,$url);

 $res=curl_exec($ch);

curl_close($ch);

$decode = json_decode($res, true);

$arr = $decode['geonames'];

foreach($arr as $entry){
    if($entry['countrycode'] === $_REQUEST['countryCode']){
        $retArr[$entry['name']] = $entry;
    }
}

$retArr['status']['code'] = "200";
echo json_encode($retArr);

?>