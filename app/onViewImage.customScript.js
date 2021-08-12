

$file = $eventArgs->image;
$user = $eventArgs->user;

//Core::Emit("onNotifyDevices", array("file"=>$file));

$uid = $user;
//Core::Emit("onNotifyDevices", array("uid"=>$uid));

$devices = GetPlugin('Apps')->getUsersDeviceIds($uid);

GetPlugin('Maps');
try{
$marker = (new \spatial\FeatureLoader())->fromId($eventArgs->item);
}catch(\Exception $e){
    return;
}
$images = HtmlDocument()->parseImageUrls($marker->getDescription());
$images = array_map(function ($i) {

    if (strpos($i, 'http') !== 0) {
        return HtmlDocument()->website() . '/' . ltrim($i, '/');
    }

}, array_merge($images, HtmlDocument()->parseVideoPosterUrls($marker->getDescription())));

$data = array(
    "devices" => $devices,
    "text" => "An administrator has viewed your report",
    "trigger" => "onViewImage: " . $file,
    'item' => $marker->getMetadata(),
);

if (count($images)) {
    $data['image'] = $images[0];
}

Emit("onNotifyDevicesAndClients", $data);

GetPlugin('Attributes');

(new attributes\Record('rappAttributes'))->setValues($marker->getId(), $marker->getType(), array(
    'viewed' => true,
));

foreach ($devices as $device) {
    Broadcast("bcwfapp." . $device, "notification", $data);
}

Broadcast("user." . $uid, "notification", $data);

