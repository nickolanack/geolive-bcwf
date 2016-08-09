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
$attributes=AttributesRecord::Get($marker->getId(), $marker->getType(), AttributesTable::GetMetadata("rappAttributes"));

$data=array(

	'eventArgs'=>$eventArgs,
	'marker'=>$marker->getMetadata(),
	'attributes'=>$attributes,


);
//TODO: submit to form.

Core::Broadcast("bcwfapp", "notification", $data);

mail($to, 'Submitted Report ('.$marker->getId().') to RAPP', '<pre>'.htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT)).'</pre>', $headers);