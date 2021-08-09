 
 
 
 if($feature['type']=='marker'){
     
    /**
     * Note: using type check since this map only display marker and polygon layers but there are no 
     * layers containing both. We are returning a closure here, which gets detected and applied to the 
     * layer on first execution
     */
     
    $iconset= GetWidget('mobile-app-markers')->getIconsetData()->iconset;
    
    return function($feature)use($iconset){
    
        foreach($iconset as $icon){
            if(strpos($feature['name'], $icon->name)!==false){
                $feature['icon']=$icon->url.'?thumb=48x48';
                return $feature;
            }
        }
        
        return $feature;
    };
     
 }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 if($feature['type']!='polygon'){
    return $feature;
 }
 
 GetPlugin('Attributes');
 
 $attributes=(new attributes\Record('regionAttributes'))->getValues($feature['id'], 'polygon');
 
 $regions=array('1', '2', '3', '4', '5','6', '7a', '7b', '8');
     
 $colors= ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4'];
     
    // error_log(json_encode($attributes));
   
 foreach($regions as $i=>$region){
    $hex=$colors[$i];
    $hex=ltrim($hex,'#');
    $color=$hex{4}.$hex{5}.$hex{2}.$hex{3}.$hex{0}.$hex{1};
      //error_log('"'.($attributes['mu']."").'"=="'.$region.'" '.json_encode($attributes['mu']===$region));
     if($attributes['mu']==$region){
         
         $feature['polyStyle']=array("color"=>'#50'.$color);
         $feature['lineStyle']=array("color"=>'#FF'.$color, "width"=>2);
         $copy=$feature;
         unset($copy['coordinates']);
          unset($copy['bounds']);
        //error_log(json_encode($copy));
          //\GetLogger('custom-render')->info('Render Feature', $copy);
 
     }
 }
 
return $feature;