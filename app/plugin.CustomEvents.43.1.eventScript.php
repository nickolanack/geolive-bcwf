<?php 

$file = $eventArgs->image;
$user = $eventArgs->user;

//Core::Emit("onNotifyDevices", array("file"=>$file));

$uid = $user;
//Core::Emit("onNotifyDevices", array("uid"=>$uid));

$mobile = Core::LoadPlugin('IOSApplication');
$devices = $mobile->getUsersDeviceIds($uid);

Core::LoadPlugin('Maps');
$marker = MapController::LoadMapItem($eventArgs->item);

$images = Core::HTML()->parseImageUrls($marker->getDescription());
$images = array_map(function ($i) {

    if (strpos($i, 'http') !== 0) {
        return Core::HTML()->website() . '/' . ltrim($i, '/');
    }

}, array_merge($images, Core::HTML()->parseVideoPosterUrls($marker->getDescription())));

$data = array(
    "devices" => $devices,
    "text" => "An administrator has viewed your report",
    "trigger" => "onViewImage: " . $file,
    'item' => $marker->getMetadata(),
);

if (count($images)) {
    $data['image'] = $images[0];
}

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