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
$tableMeta=AttributesTable::GetMetadata("rappAttributes");

AttributesRecord::Set($marker->getId(), $marker->getType(), array(
	'sent'=>true
	),$tableMeta);

$attributes=AttributesRecord::Get($marker->getId(), $marker->getType(), $tableMeta);



$data=array(

	'eventArgs'=>$eventArgs,
	'marker'=>$marker->getMetadata(),
	'attributes'=>$attributes,


);
//TODO: submit to form.


Core::Broadcast("bcwfapp", "notification", $data);

mail($to, 'Submitted Report ('.$marker->getId().') to RAPP', '<pre>'.htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT)).'</pre>', $headers);


$mobile=Core::LoadPlugin('IOSApplication');
$devices=$mobile->getUsersDeviceIds($marker->getUserId());


Core::Emit("onNotifyDevices", array(
	"devices"=>$devices,
	"text"=>"Your report has been submitted to Report All Poachers and Polluters",
	"trigger"=>"onCreateMapitem: (delay:180) ".$marker->getId()
));


foreach($devices as $device){
	Core::Broadcast("bcwfapp.".$device, "notification", array("text"=>"Your report has been submitted to Report All Poachers and Polluters"));
}