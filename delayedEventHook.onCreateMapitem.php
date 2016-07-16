<?php 

sleep(180);

Core::Emit('onDelayedCreateMapitem', $eventArgs);


$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: ' . 'Geolive'. ' <' .
 'admin@geolive.ca' . '>' . "\r\n";
$to = array('nickblackwell82@gmail.com');
$to = rtrim(implode(', ', $to), ',');

Core::LoadPlugin('Maps');
$marker=MapController::LoadMapItem($eventArgs->id);

Core::LoadPlugin('Attributes');
$attributes=AttributesRecord::Get($marker->getId(), $marker->getType(), "rappAttributes");

mail($to, 'Submitted to RAPP', json_encode(array(
	'eventArgs'=>$eventArgs,
	'marker'=>$marker->getMetadata(),
	'attributes'=>$attributes

)), $headers);