var config=<?php 

$parameters=array();
$widget=GetWidget('cluster-config');
foreach ($widget->getConfigurationParameters() as $key => $field) {
			$parameters[$key]=$widget->getParameter($key);
		}


echo json_encode($parameters);

?>;
var renderers={};
var resolveMapitem=function(app, id){
    
    return app.getLayerManager().filterMapitemById(id);
    
}

application.setClusterRendererResolver(function(marker, clusterer){
    
  var type=getType(marker);
   
   if(!renderers[type]){
       renderers[type]=clusterer.addRenderer();
   }
   return renderers[type];
    
});


var getType=function(marker){
     var type=resolveMapitem(application, marker._markerid).getName().split('- ').pop().toLowerCase().replace(' ','-').replace('/','');
   
   
   if(typeof config['cluster-'+type]=="undefined"){
       
       var oldNaming=type.split('-report').shift().split(' report').shift()
       if(typeof config['cluster-'+oldNaming]!="undefined"){
            type=oldNaming;
       }else{
            type="other";
       }
       
   }
   
   return type;
}


if(window.Cluster){
Cluster.Symbol=ClusterSymbol;
ClusterSymbol.IconScale=function(sum){
   return 20+(5*Math.log(sum)/Math.log(2));
};
ClusterSymbol.IconStyle=function(name){
   //expect to be bound to ClusterSymbol object

    var color="rgb(0, 160, 80)";
    var cluster=this.cluster_;
    if(cluster&&cluster.markers_&&cluster.markers_.length){
        var type='cluster-'+getType(cluster.markers_[0]);
        if(config[type]){
            color=config[type]
        }
    }

      return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor:color,
			fillOpacity:0.7,
			strokeWeight:1.5,
			strokeColor:color,
			labelOrigin:new google.maps.Point(0, 0)
      };




};
}else{
    setTimeout(start,100);
}