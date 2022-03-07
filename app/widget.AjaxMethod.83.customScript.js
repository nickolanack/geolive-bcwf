



return array(
    'ios'=>intval(GetPlugin("Apps")->getDatabase()->countAccounts(array("username"=>array(
					"comparator"=>"NOT LIKE",
					"value"=>"android%"
					)))),

    'android'=>intval(GetPlugin("Apps")->getDatabase()->countAccounts(array("username"=>array(
					"comparator"=>"LIKE",
					"value"=>"android%"
					))))
    
    );