if (key_exists('marker', $variables)) {
    
    try {
            GetPlugin('Maps');
            GetPlugin('Attributes');
			$marker = $item;//(new \spatial\FeatureLoader())->fromId($variables['marker']['id']);
	        $attributes = (new attributes\Record('rappAttributes'))->getValues($marker->getId(), $marker->getType());
    } catch (Exception $e) {
		Emit('onEmailModeratorsMarkerWasDeletedWhileSleeping', array_merge(get_object_vars($variables), array(
			'error' => $e->getMessage(),
		)));
			
			
		return $variables;
			
	}	
             
            
            GetPlugin('GoogleMaps');
            $config=GetWidget('app-config');
            
            include_once GetPath('{front}/bcwf/ViolationReport.php');
            
            return (new \bcwf\ViolationReport())
                ->addEventHandler(function($event, $data){

                    Emit('violationReportMailer.'.$event, $data);
                    Broadcast('violationReportMailer.'.$event, 'event', $data);

                })
                ->withBlacklistedLocations($config->getParameter('blacklist',array()))
                ->withStaticMapLink(
                    (new \GoogleMapsStaticMapTiles())->featureTileUrl($marker,array(
                        "key"=> $config->getParameter('staticMapApiKey')
                    ))
                )
                ->formatEmailModerationVariables($marker, $attributes, $variables);
        
        

    
    
}


return $variables;