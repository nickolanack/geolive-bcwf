<?php
function formatVariables($variables, $event){

	if(key_exists('[MARKERIMAGESHTML]', $variables)){

		$urls=Core::HTML()->parseImageUrls($variables['[MARKERIMAGESHTML]']);
		foreach($urls as $url){


			if(Core::HTML()->isLocalFileUrl($url)){
				$file=Core::HTML()->urlToPath($url);
				$jsonFile=Core::WebsiteRoot().'/assets/'.rand(10000000000, 99999999999).'.json';
				while(file_exists($jsonFile)){
					$jsonFile=Core::WebsiteRoot().'/assets/'.rand(10000000000, 99999999999).'.json';
				}
				
				file_put_contents($jsonFile,json_encode(array(
					"file"=>$file,
					"item"=>$variables['[MARKERID]'],
					"type"=>"marker",
					"event"=>"onViewImage"
				), JSON_PRETTY_PRINT));

				$variables['[MARKERIMAGESHTML]']=str_replace($url, UrlFrom(substr($jsonFile, 0, -4).'png'), $variables['[MARKERIMAGESHTML]']);

			}
		}

	}

	file_put_contents(__DIR__.'variables.log',json_encode($variables, JSON_PRETTY_PRINT), FILE_APPEND);
	return $variables;
}