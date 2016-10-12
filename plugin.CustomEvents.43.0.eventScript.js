ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);		//php 5 only

sleep(5);

Core::Emit('onDelayedCreateMapitem', $eventArgs);

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: ' . 'Geolive' . ' <' .
    'admin@geolive.ca' . '>' . "\r\n";
$to = array('nickblackwell82@gmail.com');
$to = rtrim(implode(', ', $to), ',');


$mapsPlugin=Core::LoadPlugin('Maps');
$marker = MapController::LoadMapItem($eventArgs->id);

Core::LoadPlugin('Attributes');
$tableMeta = AttributesTable::GetMetadata("rappAttributes");

AttributesRecord::Set($marker->getId(), $marker->getType(), array(
    'sent' => true,
), $tableMeta);

$attributes = AttributesRecord::Get($marker->getId(), $marker->getType(), $tableMeta);

$data = array(

    'eventArgs' => $eventArgs,
    'marker' => $marker->getMetadata(),
    'attributes' => $attributes,

);
//TODO: submit to form.

Core::Broadcast("bcwfapp", "notification", $data);

mail($to, 'Submitted Report (' . $marker->getId() . ') to RAPP', '<pre>' . htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT)) . '</pre>', $headers);

$mobile = Core::LoadPlugin('IOSApplication');
$devices = $mobile->getUsersDeviceIds($marker->getUserId());

Core::Emit("onNotifyDevicesAndClients", array(
    "devices" => $devices,
    "text" => "Your report has been submitted to Report All Poachers and Polluters",
    "trigger" => "onCreateMapitem: (delay:180) " . $marker->getId(),
));




$url = 'https://www.for.gov.bc.ca/pscripts/webmail/mofwebmail.asp';

$violation_details = '';

Core::LoadPlugin('GoogleMaps');

$coords = $marker->getCoordinates();
$response = GoogleMapsGeocode::FromCoordinates($coords[0], $coords[1]);
if ($response->status == 'OK') {
	$location = $response->results[0]->formatted_address;
	$violation_details .= "  ".'Location: ' . $location . "\n";
}


$violation_details .= "  ".'Coordinates (lat, lng): ' . $coords[0] . ', ' . $coords[1] . "\n";
//$violation_details .= GoogleMapsStaticMapTiles::UrlForMapitem($marker) . "\n";


$staticmaptile = Core::HTML()->website().'/'.Core::HTML()->Link($mapsPlugin->urlVarsToNamedView('mapitem.staticmap'), 
array(
    'format' => 'raw',
    'mapitem' => $marker->getId(),
    'size'=>'500x500'
));
$violation_details .="  ".$staticmaptile . "\n\n";

$ip = Core::Client()->ipAddress();


$response = Core::LoadPlugin('Geolocate')->geocodeIp($ip);


$geocode = trim(trim($response->region_name . ' ' . $response->city) . ' ' . $response->zip_code);
//$this->fail(print_r($response, true));

$comments = '';
$comments .= "  ".'This report was submitted using the BCWF RAPP mobile app'."\n";
$comments .= "  ".'Senders IP Address is: ' . $ip . ' (' . $geocode . ')'."\n\n";

$fields = array(
	'template' => 'hli\cos\violation-report.txt',
	'subject' => urlencode('BCWF - RAPP Violation Report'),
	'redirect-url' => '/hli/cos/rapp-thank-you.html',
	'origin' => '',
	'comp_name' => 'n/a 1',
	'comp_address' => 'n/a 2',
	'comp_phone' => 'n/a 3',
	'comp_email' => 'n/a 4',
	'violation_details' => urlencode($violation_details),
	'violator_description' => 'b',
	'transport_involved' => 'c',
	'witnesses' => 'd',
	'comments' => urlencode($comments),
	'test' => 'report',
	'toEmail' => 'nickblackwell82@gmail.com, jon.corbett@gmail.com', // 'SGPEP.ECC1@gov.bc.ca',
	'fromEmail' => 'bcwf.geolive@gov.bc.ca', //'SGPEP.ECC1@gov.bc.ca',
);


Core::Emit("onSubmitRAPPReportForItem", array(
	"item"=>$marker->getId(),
	"post"=>$fields,
));

//$this->fail(print_r($fields));

$fields_string = '';
foreach ($fields as $key => $value) {
	$fields_string .= $key . '=' . $value . '&';
}
rtrim($fields_string, '&');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, count($fields));
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

Core::Emit("onSubmitedRAPPReportForItem", array(
	"item"=>$marker->getId(),
	"response"=>$result
));



foreach ($devices as $device) {
    Core::Broadcast("bcwfapp." . $device, "notification", array("text" => "Your report has been submitted to Report All Poachers and Polluters"));
}

Core::Broadcast("user." . $marker->getUserId(), "notification", array("text" => "Your report has been submitted to Report All Poachers and Polluters"));