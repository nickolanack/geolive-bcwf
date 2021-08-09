<?php

        $config=GetWidget('app-config');
        $delay=$config->getParameter('delay', 4);
        $delay=max(0,min(intval($delay),10));
        sleep(max(10, 60 * $delay));
        
        
    
       // include_once GetPath('{front}/bcwf/BCWFSubmit.php');
       // BCWFSubmit::ProcessEvent($eventArgs);
       
?>