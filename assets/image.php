<?php

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL); //php 5 only

$default = dirname(__FILE__) . DS;

$image = dirname(__FILE__) . DS . urldecode($_GET['file']);

$base = substr($image, 0, strrpos($image, '.'));
$jsonFile = $base . '.json';

if (!file_exists($jsonFile)) {
    echo 'Error no json file';
    return;
}

$json = json_decode(file_get_contents($jsonFile));
$file = $json->file;

$ext = substr($file, strrpos($file, '.') + 1);

if (!file_exists($file)) {
    echo 'Error file does not exist: ' . $file;
    return;
}

if (!in_array($ext, array('png', 'jpg', 'gif', 'jpeg', 'bmp'))) {
    echo 'Error json->file not one of [png, jpg, gif, jpeg, bmp]';
    return;
}

if ($json->event) {

    include_once dirname(__DIR__) . '/administrator/components/com_geolive/core.php';

    $eventArgs = array_merge(get_object_vars($json), array(
        'image' => UrlFrom($file),
        'trigger' => UrlFrom($image),
    ));

    Core::Emit($json->event, $eventArgs);
    //Core::Broadcast("bcwfapp", "notification", array("text"=>"An administrator has viewed your report"));

}

header('Content-Type: image/' . $ext . ';');
echo file_get_contents($file);
