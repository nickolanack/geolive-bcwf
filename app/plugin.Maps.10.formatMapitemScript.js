$set=GetWidget('mobile-app-markers')->getIconsetData();

if(!key_exists('rappAttributes', $feature->attributes)){
    Emit('onSaveFeatureCustomScriptNotValid', array('error'=>'does not contain `rappAttributes`', 'feature'=>$feature, 'set'=>$set));
    return;
}

if(!key_exists('violationType', $feature->attributes->rappAttributes)){
    Emit('onSaveFeatureCustomScriptNotValid', array('error'=>'does not contain `violationType`', 'feature'=>$feature, 'set'=>$set));
    return;
}

$type= $feature->attributes->rappAttributes->violationType;

if(!in_array($type, $set->names)){
    Emit('onSaveFeatureCustomScriptNotValid', array('error'=>'does not contain violationType:'.$type, 'feature'=>$feature, 'set'=>$set));
    return;
}

$index=array_search($type, $set->names);
$url=$set->icons[$index];

$feature->marker->style=$url."?thumb=48x48";
$feature->params=(object)array("readAccess"=>"special");

Emit('onSaveFeatureCustomScript', array('url'=>$url, 'feature'=>$feature));

return $feature;