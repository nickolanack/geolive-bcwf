<?php

/**
 * this test should only be run within an application environment. and requires some sort of actual database.
 * @author nblackwe
 *
 */
class ReportFormatTest extends PHPUnit_Framework_TestCase {

	protected function _includeCore() {
		$dir = __DIR__;
		while ((!file_exists($dir . DIRECTORY_SEPARATOR . 'core.php') && (!empty($dir)))) {
			$dir = dirname($dir);
		}

		if (file_exists($dir . DIRECTORY_SEPARATOR . 'core.php')) {
			include_once $dir . DIRECTORY_SEPARATOR . 'core.php';
		} else {
			throw new Exception('failed to find core.php');
		}
	}

	/**
	 * @runInSeparateProcess
	 */
	public function testFormatReport() {

		$this->_includeCore();
		Core::HTML()->setProtocol('https')->setDomain('bcwf.geolive.ca')->setRemoteAddress('108.180.73.231');

		$data = json_decode('{
		    "eventArgs": {
		        "id": 1026,
		        "type": "marker"
		    },
		    "marker": {
		        "type": "marker",
		        "id": 1026,
		        "uid": 531,
		        "ownable": true,
		        "name": "Water",
		        "description": "<video poster=\"components\/com_geolive\/users_files\/user_files_531\/Uploads\/6Gb_[G]_0dq_[ViDeO]_UFo.mp4.videoscreens[ImAgE][1].png\" controls=\"controls\"><source src=\"components\/com_geolive\/users_files\/user_files_531\/Uploads\/6Gb_[G]_0dq_[ViDeO]_UFo.mp4\" type=\"video\/mp4\" \/><source src=\"components\/com_geolive\/users_files\/user_files_531\/Uploads\/6Gb_[G]_0dq_[ViDeO]_UFo.webm\" type=\"video\/webm\" \/><source src=\"components\/com_geolive\/users_files\/user_files_531\/Uploads\/6Gb_[G]_0dq_[ViDeO]_UFo.ogv\" type=\"video\/ogg\" \/><\/video>",
		        "creationDate": "2016-09-13 13:46:47",
		        "modificationDate": "2016-09-13 13:46:47",
		        "readAccess": "special",
		        "writeAccess": "registered",
		        "published": true,
		        "viewable": true,
		        "views": 0,
		        "layerId": 11,
		        "coordinates": [
		            49.939514861827,
		            -119.39657056971,
		            0
		        ],
		        "coordinatesType": "point",
		        "bounds": [
		            49.939514861827,
		            49.939514861827,
		            -119.39657056971,
		            -119.39657056971
		        ],
		        "precision": 0,
		        "icon": "https:\/\/bcwf.geolive.ca\/components\/com_geolive\/users_files\/user_files_400\/Uploads\/dlN_[ImAgE]_E36_2F0_[G].png"
		    },
		    "attributes": {
		        "id": "262",
		        "name": null,
		        "address": null,
		        "phone": null,
		        "email": null,
		        "witnessed": null,
		        "suspectDescription": null,
		        "transport": null,
		        "otherWitnesses": null,
		        "comments": null,
		        "suspectContact": null,
		        "violationAffects": null,
		        "agenciesContacted": null,
		        "urgencyReason": null,
		        "hazards": null,
		        "inProgress": null,
		        "requestAnonymous": null,
		        "dateStart": null,
		        "dateEnd": null,
		        "violationType": null,
		        "sent": null,
		        "viewed": "true"
		    }
		}');

		$url = 'localhost';

		$violation_details = '';

		Core::LoadPlugin('GoogleMaps');

		$coords = $data->marker->coordinates;
		$response = GoogleMapsGeocode::FromCoordinates($coords[0], $coords[1]);
		if ($response->status == 'OK') {
			$location = $response->results[0]->formatted_address;
			$violation_details .= 'Location: ' . $location . "\n";
		}

		$violation_details .= 'Coordinates (lat, lng): ' . $coords[0] . ', ' . $coords[1] . "\n";
		$violation_details .= GoogleMapsStaticMapTiles::UrlForMapitem($data->marker->id) . "\n";

		$ip = Core::Client()->ipAddress();

		$response = Core::LoadPlugin('Geolocate')->geocodeIp($ip);
		$geocode = trim(trim($response->region_name . ' ' . $response->city) . ' ' . $response->zip_code);
		//$this->fail(print_r($response, true));

		$comments = '';
		$comments .= 'This report was submitted using the BCWF RAPP mobile app';
		$comments .= 'Senders IP Address is: ' . $ip . ' (' . $geocode . ')';

		$fields = array(
			'template' => 'hli\cos\violation-report.txt',
			'subject' => urlencode('BCWF - RAPP Violation Report'),
			'redirect-url' => '/hli/cos/rapp-thank-you.html',
			'origin' => '',
			'comp_name' => 'n/a 1',
			'comp_address' => 'n/a 2',
			'comp_phone' => 'n/a 3',
			'comp_email' => 'n/a 4',
			'violation_details' => urlencode($violation_details),
			'violation_observed' => "yes",
			'violator_description' => 'b',
			'transport_involved' => 'c',
			'witnesses' => 'd',
			'comments' => urlencode($comments),
			'test' => 'report',
			'toEmail' => 'nickblackwell82@gmail.com', // 'SGPEP.ECC1@gov.bc.ca',
			'fromEmail' => 'bcwf.geolive@gov.bc.ca', //'SGPEP.ECC1@gov.bc.ca',
		);

		//$this->fail(print_r($fields));

		$fields_string = '';
		foreach ($fields as $key => $value) {
			$fields_string .= $key . '=' . $value . '&';
		}
		rtrim($fields_string, '&');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, count($fields));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$result = curl_exec($ch);
		curl_close($ch);

		print_r($result);

	}
}

/*

[results] => Array
(
[0] => stdClass Object
(
[address_components] => Array
(
[0] => stdClass Object
(
[long_name] => 1147b
[short_name] => 1147b
[types] => Array
(
[0] => street_number
)

)

[1] => stdClass Object
(
[long_name] => Research Road
[short_name] => Research Rd
[types] => Array
(
[0] => route
)

)

[2] => stdClass Object
(
[long_name] => Highway 97
[short_name] => Highway 97
[types] => Array
(
[0] => neighborhood
[1] => political
)

)

[3] => stdClass Object
(
[long_name] => Kelowna
[short_name] => Kelowna
[types] => Array
(
[0] => locality
[1] => political
)

)

[4] => stdClass Object
(
[long_name] => Central Okanagan
[short_name] => Central Okanagan
[types] => Array
(
[0] => administrative_area_level_2
[1] => political
)

)

[5] => stdClass Object
(
[long_name] => British Columbia
[short_name] => BC
[types] => Array
(
[0] => administrative_area_level_1
[1] => political
)

)

[6] => stdClass Object
(
[long_name] => Canada
[short_name] => CA
[types] => Array
(
[0] => country
[1] => political
)

)

[7] => stdClass Object
(
[long_name] => V1V 1V7
[short_name] => V1V 1V7
[types] => Array
(
[0] => postal_code
)

)

)

[formatted_address] => 1147b Research Rd, Kelowna, BC V1V 1V7, Canada
[geometry] => stdClass Object
(
[location] => stdClass Object
(
[lat] => 49.939751
[lng] => -119.3972931
)

[location_type] => ROOFTOP
[viewport] => stdClass Object
(
[northeast] => stdClass Object
(
[lat] => 49.941099980291
[lng] => -119.39594411971
)

[southwest] => stdClass Object
(
[lat] => 49.938402019708
[lng] => -119.39864208029
)

)

)

[place_id] => ChIJWZ7Yh33tfVMRYZQnR1Crdv8
[types] => Array
(
[0] => street_address
)

)
 */