


        Broadcast('onHandleReportInit', 'event', $eventArgs);

        $config=GetWidget('app-config');
        
        try {
            GetPlugin('Maps');
            GetPlugin('Attributes');
			$marker = (new \spatial\FeatureLoader())->fromId($eventArgs->id);
			
			(new attributes\Record('rappAttributes'))->setValues($marker->getId(), $marker->getType(), array(
    			'sent' => true,
    		));
			
			$attributes = (new attributes\Record('rappAttributes'))->getValues($marker->getId(), $marker->getType());
		} catch (Exception $e) {
			Emit('onDelayedCreateMapitemMarkerWasDeletedWhileSleeping', array_merge(get_object_vars($eventArgs), array(
				'error' => $e->getMessage(),
			)));
			
			return;
			
		}
		
		
		Broadcast('onHandleReportStart', 'event', $eventArgs);	
		
		
		$mobile = GetPlugin('Apps');
		$devices = $mobile->getUsersDeviceIds($marker->getUserId());

		$devicesMetadata = array_map(function ($deviceId) use ($mobile) {

			return $mobile->getDeviceMetadata($deviceId);

		}, $devices);

		
		
		 GetPlugin('GoogleMaps');
    
        include_once GetPath('{front}/bcwf/ViolationReport.php');
        $reportData=(new \bcwf\ViolationReport())
        	->setEnabled($config->getParameter('enableSubmitReportForm'))
        	->addEventHandler(function($event, $data){

                Emit('violationReport.'.$event, $data);
                Broadcast('violationReport.'.$event, 'event', $data);

            })
        	
            ->withBlacklistedLocations($config->getParameter('blacklist',array()))
            ->withStaticMapLink(
                (new \GoogleMapsStaticMapTiles())->featureTileUrl($marker,array(
                    "key"=> $config->getParameter('staticMapApiKey')
                ))
            )
            ->submit($marker, $attributes);
        
        
        
        
        
        
        Emit("onSubmitedBCWFReportForItem", array(
			"item" => $marker->getId(),
			"reportData" => $reportData
		));
		
		Broadcast("onSubmitedBCWFReportForItem",'event', array(
			"item" => $marker->getId(),
			"reportData" => $reportData
		));
		
		
		Emit("onNotifyDevicesAndClients", array(
			"devices" => $devices,
			"devicesMetadata" => $devicesMetadata,
			"text" => "Your report has been submitted to " . $reportData['destinationName'],
			"trigger" => "onCreateMapitem: (delay:180) " . $marker->getId(),
		));

		foreach ($devices as $device) {
			Broadcast(
			        "bcwfapp." . $device, 
			        "notification", 
			        array("text" => "Your report has been submitted to ". $reportData['destinationName'])
			    );
		}

		Broadcast(
		        "user." . $marker->getUserId(), 
		        "notification", 
		        array("text" => "Your report has been submitted to ". $reportData['destinationName'])
		    );

        
        
        
        
        Broadcast('onHandleReportComplete', 'event', $eventArgs);	
       
