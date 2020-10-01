<?php

$url = '../json/countries_small.geo.json';
$data = file_get_contents($url);
$decode = json_decode($data, true);

$country = $decode['features'];

foreach($country as $entry){
    if($entry['id'] === $_REQUEST['countryCode']){
        $retArr['border'] = $entry['geometry'];
    }
}


echo json_encode($retArr);
?>

