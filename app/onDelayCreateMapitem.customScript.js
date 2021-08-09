


        Broadcast('onHandleReportInit', 'event', $eventArgs);

        $config=GetWidget('app-config');
        
        try {
            GetPlugin('Maps');
            GetPlugin('Attributes');
			$marker = (new \spatial\FeatureLoader())->fromId($eventArgs->id);
			$attributes = (new attributes\Record('rappAttributes'))->getValues($marker->getId(), $marker->getType());
		} catch (Exception $e) {
			Emit('onDelayedCreateMapitemMarkerWasDeletedWhileSleeping', array_merge(get_object_vars($eventArgs), array(
				'error' => $e->getMessage(),
			)));
			
		}
		
		
		Broadcast('onHandleReportStart', 'event', $eventArgs);	
    
        include_once GetPath('{front}/bcwf/ViolationReport.php');
        (new \bcwf\ViolationReport())->submit($marker, $attributes);
        
        Broadcast('onHandleReportCompletet', 'event', $eventArgs);	
       
