<?php

//Fetches the Country name//
   $url = "https://api.opencagedata.com/geocode/v1/json?q=". $_REQUEST['lat']. "+". $_REQUEST['lon']. "&key=f532b5192a67483c872696510fb40170";

   $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$res=curl_exec($ch);

    curl_close($ch);
    
    $decode = json_decode($res, true);

    $retArr['status']['code'] = "200";
    $retArr['data']['country'] = $decode['results'];

    //Fetches the weather//
    $url="api.openweathermap.org/data/2.5/weather?lat=". $_REQUEST['lat']. '&lon='. $_REQUEST['lon']. '&appid=738bc0906f1d9a7ad45eed9fccf0fc91';

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$res=curl_exec($ch);

    curl_close($ch);
    
    $decode = json_decode($res, true);

    
    $retArr['status']['code'] = "200";
    $retArr['data']['weather'] = $decode['weather'];



    echo json_encode($retArr);
?>