<?php 

sleep(180);

Core::Emit('onDelayedCreateMapitem', $eventArgs);


$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: ' . 'Geolive'. ' <' .
 'admin@geolive.ca' . '>' . "\r\n";
$to = array('nickblackwell82@gmail.com', 'jon.corbett@gmail.com');
$to = rtrim(implode(', ', $to), ',');
mail($to, 'Submit to RAPP', 'Message', $headers);