<?php

    $url="https://openexchangerates.org/api/latest.json?app_id=28d7dfb11bb14dfd9818b6e85aceec56";

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$res=curl_exec($ch);

   curl_close($ch);
   
   $decode = json_decode($res, true);

   
   $retArr['status']['code'] = "200";
   $retArr['data'] = $decode['rates'][$_REQUEST['code']];

   echo json_encode($retArr);

?>