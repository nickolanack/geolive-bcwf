


        Broadcast('onHandleReportInit', 'event', $eventArgs);

        $config=GetWidget('app-config');
        
        try {
            GetPlugin('Maps');
			$marker = (new \spatial\FeatureLoader())->fromId($eventArgs->id);
		} catch (Exception $e) {
			Emit('onDelayedCreateMapitemMarkerWasDeletedWhileSleeping', array_merge(get_object_vars($eventArgs), array(
				'error' => $e->getMessage(),
			)));
			
		}
		
		
		Broadcast('onHandleReportStart', 'event', $eventArgs);	
    
       // include_once GetPath('{front}/bcwf/BCWFSubmit.php');
       // BCWFSubmit::ProcessEvent($eventArgs);
       
