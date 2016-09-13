<?php

/**
 * this test should only be run within an application environment. and requires some sort of actual database.
 * @author nblackwe
 *
 */
class EmailTemplateTest extends PHPUnit_Framework_TestCase
{

    protected function _includeCore()
    {
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
    public function testFormatReport()
    {
  
    	$jsonData='{
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
		}';


		$post=array(
			'template'=>'hli\cos\violation-report.txt',
			'subject'=>'RAPP Violation Report',
			'redirect-url'=>'/hli/cos/rapp-thank-you.html',
			'origin'=>'',
			'comp_name'=>'',
			'comp_address'=>'',
			'comp_phone'=>'',
			'comp_email'=>'',
			'violation_details'=>'',
			'violator_description'=>'',
			'transport_involved'=>'',
			'witnesses'=>'',
			'comments'=>'',
			'test'=>'',
			'toEmail'=>'SGPEP.ECC1@gov.bc.ca',
			'fromEmail'=>'SGPEP.ECC1@gov.bc.ca'
		);



    }
}
