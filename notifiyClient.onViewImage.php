<?php 

$file=$eventArgs->image;

//Core::Emit("onNotifyDevices", array("file"=>$file));

$p=explode('user_files_', $file);
if(count($p)!=2){
	return;
}
$p=explode('/', $p[1]);
$uid=intval($p[0]);
//Core::Emit("onNotifyDevices", array("uid"=>$uid));

$mobile=Core::LoadPlugin('IOSApplication');
$devices=$mobile->getUsersDeviceIds($uid);


Core::Emit("onNotifyDevices", array(
	"devices"=>$devices,
	"text"=>"An administrator has viewed your report",
	"trigger"=>"onViewImage: ".$file
));

foreach($devices as $device){
	Core::Broadcast("bcwfapp.".$device, "notification", array("text"=>"An administrator has viewed your report"));
}