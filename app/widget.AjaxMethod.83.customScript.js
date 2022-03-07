



return array(
    'ios'=>GetPlugin("Apps")->getDatabase()->countAccounts(array("username"=>array(
					"comparator"=>"NOT LIKE",
					"value"=>"android%"
					))),

    'android'=>GetPlugin("Apps")->getDatabase()->countAccounts(array("username"=>array(
					"comparator"=>"LIKE",
					"value"=>"android%"
					)))
    
    );