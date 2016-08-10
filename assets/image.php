<?php

if(!defined('DS'))define('DS', DIRECTORY_SEPARATOR);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);		//php 5 only


$default=dirname(__FILE__).DS;

$file=dirname(__FILE__).DS.urldecode($_GET['file']);

$base=substr($file,0, strrpos($file, '.'));
$jsonFile=$base.'.json';


if(file_exists($jsonFile)){

	$json=json_decode(file_get_contents($jsonFile));
	$file=$json->file;

	$ext=substr($file,strrpos($file, '.')+1);

	if(file_exists($file)&&in_array($ext, array('png', 'jpg', 'gif', 'jpeg', 'bmp'))){



		if(file_exists($file)){

			if($json->event){

				include_once dirname(__DIR__).'/administrator/components/com_geolive/core.php';

				$eventArgs=array(

					'image'=>UrlFrom($file)
				);
				
				Core::Emit($json->event, $eventArgs);
				//Core::Broadcast("bcwfapp", "notification", array("text"=>"An administrator has viewed your report"));

			}


			header('Content-Type: image/'.$ext.';');
			echo file_get_contents($file);
		}
			
			
		

		
		return;
		

	}
}
	
echo 'Error';



