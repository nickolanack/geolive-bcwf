<?php 
    $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
    if(stripos($ua,'android') !== false) { // && stripos($ua,'mobile') !== false) {
    	header('Location: https://play.google.com/store/search?q=BCWF+conservation+app&c=apps&utm_content=buffer1a736&utm_medium=social&utm_source=facebook.com&utm_campaign=buffer');
    	exit();
    }
    
    if(stripos($ua,'iphone') !== false||stripos($ua,'ipod') !== false||stripos($ua,'ipad') !== false) { // && stripos($ua,'mobile') !== false) {
    	header('Location: https://itunes.apple.com/ca/app/conservation-app/id1151528829?mt=8');
    	exit();
    }


?>


<a href="https://itunes.apple.com/ca/app/conservation-app/id1151528829?mt=8">IOS App</a>
<a href="https://play.google.com/store/search?q=BCWF+conservation+app&c=apps&utm_content=buffer1a736&utm_medium=social&utm_source=facebook.com&utm_campaign=buffer">Android App</a>