<?php

$file = $eventArgs->image;

//Core::Emit("onNotifyDevices", array("file"=>$file));

$p = explode('user_files_', $file);
if (count($p) != 2) {
    return;
}
$p = explode('/', $p[1]);
$uid = intval($p[0]);
//Core::Emit("onNotifyDevices", array("uid"=>$uid));

$mobile = Core::LoadPlugin('IOSApplication');
$devices = $mobile->getUsersDeviceIds($uid);

Core::Emit("onNotifyDevicesAndClients", array(
    "devices" => $devices,
    "text" => "An administrator has viewed your report",
    "trigger" => "onViewImage: " . $file,
));

Core::LoadPlugin('Attributes');
$tableMeta = AttributesTable::GetMetadata("rappAttributes");

AttributesRecord::Set($eventArgs->item, $eventArgs->type, array(
    'viewed' => true,
), $tableMeta);

foreach ($devices as $device) {
    Core::Broadcast("bcwfapp." . $device, "notification", array("text" => "An administrator has viewed your report"));
}

Core::Broadcast("user." . $uid, "notification", array("text" => "An administrator has viewed your report"));
