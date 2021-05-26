if (key_exists('marker', $variables)) {

        $logo = 'https://bcwf.geolive.ca/templates/protostar/logo.jpg';
        $file = Core::WebsiteRoot() . '/templates/protostar/logo.jpg';
        $jsonFile = Core::WebsiteRoot() . '/assets/' . rand(10000000000, 99999999999) . '.json';

        $imageTriggerData = array(
            "file" => $file,
            "user" => $variables['user']['id'],
            "item" => $variables['marker']['id'],
            "type" => "marker",
            "event" => "onViewImage",
        );

        Core::Emit('onGenerateImageViewTrigger', $imageTriggerData);

        file_put_contents($jsonFile, json_encode($imageTriggerData, JSON_PRETTY_PRINT));

        $variables['prefix'] = '<img src="' . substr(UrlFrom($jsonFile), 0, -5) . '.png' . '"/>';
        
        GetPlugin('Attributes');
        $variables['marker']['attributes']['rappAttributes']=(new attributes\Record('rappAttributes'))->getValues($variables['marker']['id'], $variables['marker']['type']);
        //$variables['marker']['attributes']['wild']=(new attributes\Record('rappAttributes'))->getValues($variables['marker']['id'], $variables['marker']['type']);
        
        include_once GetPath('{front}/bcwf/BCWFSubmit.php');
        //try{
            
            $marker=MapController::LoadMapItem($variables['marker']['id']);
            $handlerVariables = BCWFSubmit::GetFormVariables( $marker, $variables['marker']['attributes']['rappAttributes']);
		    $handlerFormFields = BCWFSubmit::FormatFormFields($handlerVariables, $marker, $variables['marker']['attributes']['rappAttributes']);
        
            $variables['handler']=array(
                'variables'=>$handlerVariables,
                'form'=>$handlerFormFields
            );
    
        //}catch(Exception $e){}
        //file_put_contents(__DIR__ . '/variables.log', json_encode($variables, JSON_PRETTY_PRINT), FILE_APPEND);
    }

    return $variables;