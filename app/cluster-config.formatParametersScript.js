GetPlugin('Attributes');
$values=(new attributes\Record('rappAttributes'))->distinctValues('violationType');

$parameters=array();
foreach($values as $type){

    
    $name='cluster-'.strtolower(str_replace(' ', '-', str_replace(',', '', str_replace('/', '', $type))));
    $parameters[$name]=json_decode(json_encode(
        array(
                'name'=>$name,
                "type"=> "color",
                "default"=>"rgb(0,0,0)",
                "label"=>"Color For ".$type
            )
        
        
    ));
    
}


return (object) $parameters;