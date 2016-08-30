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

$data = array(
    "devices" => $devices,
    "text" => "An administrator has viewed your report",
    "trigger" => "onViewImage: " . $file,
    'image'=>$file;
);

Core::Emit("onNotifyDevicesAndClients", $data);

Core::LoadPlugin('Attributes');
$tableMeta = AttributesTable::GetMetadata("rappAttributes");

AttributesRecord::Set($eventArgs->item, $eventArgs->type, array(
    'viewed' => true,
), $tableMeta);

foreach ($devices as $device) {
    Core::Broadcast("bcwfapp." . $device, "notification", $data);
}

Core::Broadcast("user." . $uid, "notification", $data);
