<?php 

ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL); //php 5 only

sleep(5);

Core::Emit('onDelayedCreateMapitem', $eventArgs);

include_once Core::WebsiteRoot().'/bcwf/BCWFSubmit.php';

/*
		 * instantiate the marker from the event data: {id:int, type:"marker"}
		 */
		$marker = MapController::LoadMapItem($eventArgs->id);


		/*
		 * update state attribute "sent" to true;
		 */
		$tableMeta = AttributesTable::GetMetadata("rappAttributes");
		AttributesRecord::Set($marker->getId(), $marker->getType(), array(
			'sent' => true,
		), $tableMeta);




		/*
		 * get attributes, this should reflect the change to "sent"
		 */
		$attributes = AttributesRecord::Get($marker->getId(), $marker->getType(), $tableMeta);




		$form=BCWFSubmit::GetFormDestination($attributes);
		$destinationLabel=BCWFSubmit::GetReadableDestinationName($form);

		


		$mobile = Core::LoadPlugin('IOSApplication');
		$devices = $mobile->getUsersDeviceIds($marker->getUserId());



		$devicesMetadata=array_map(function($deviceId)use($mobile){

			return $mobile->getDeviceMetadata($deviceId);

		}, $devices);



		Core::Emit("onNotifyDevicesAndClients", array(
			"devices" => $devices,
			"devicesMetadata"=>$devicesMetadata,
			"text" => "Your report has been submitted to ".$destinationLabel,
			"trigger" => "onCreateMapitem: (delay:180) " . $marker->getId(),
		));




		$variables=BCWFSubmit::GetFormVariables($marker, $attributes);




		
	


		$fields=BCWFSubmit::FormatFormFields($variables, $marker, $attributes);




		Core::Emit("onSubmitRAPPReportForItem", array(
			"item" => $marker->getId(),
			"post" => $fields,
		));

		/*
		 * debugging, email marker data to nick...
		 */
		BCWFSubmit::EmailRawData('Variables (' . $marker->getId() .
			') to '.$destinationLabel, $variables);
		BCWFSubmit::EmailRawData('Attributes (' . $marker->getId() .
			') to '.$destinationLabel, $attributes);
		BCWFSubmit::EmailRawData('Marker (' . $marker->getId() .
			') to '.$destinationLabel, $marker->getMetadata());
		BCWFSubmit::EmailRawData('Form (' . $marker->getId() .
			') to '.$destinationLabel, $fields);

		$response=BCWFSubmit::SubmitForm($form, $fields, $variables['url']);

		


		Core::Emit("onSubmitedRAPPReportForItem", array(
			"item" => $marker->getId(),
			"response" => $response,
		));




		foreach ($devices as $device) {
			Core::Broadcast("bcwfapp." . $device, "notification", array("text" => "Your report has been submitted to ".$destinationLabel));
		}

		Core::Broadcast("user." . $marker->getUserId(), "notification", array("text" => "Your report has been submitted to ".$destinationLabel));