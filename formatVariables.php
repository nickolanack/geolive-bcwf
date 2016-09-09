<?php
function formatVariables($variables, $event)
{

    if (key_exists('[MARKERID]', $variables)) {

        $logo = 'https://bcwf.geolive.ca/templates/protostar/logo.jpg';
        $file = Core::WebsiteRoot() . '/templates/protostar/logo.jpg';
        $jsonFile = Core::WebsiteRoot() . '/assets/' . rand(10000000000, 99999999999) . '.json';

        $imageTriggerData = array(
            "file" => $file,
            "user" => $variables['[USERID]'],
            "item" => $variables['[MARKERID]'],
            "type" => "marker",
            "event" => "onViewImage",
        );

        Core::Emit('onGenerateImageViewTrigger', $imageTriggerData);

        file_put_contents($jsonFile, json_encode($imageTriggerData, JSON_PRETTY_PRINT));

        $variables['[PREFIX]'] = '<img src="' . substr(UrlFrom($jsonFile), 0, -5) . '.png' . '"/>';

        file_put_contents(__DIR__ . '/variables.log', json_encode($variables, JSON_PRETTY_PRINT), FILE_APPEND);
    }

    return $variables;
}
