if(window.Cluster){
Cluster.Symbol=ClusterSymbol;
ClusterSymbol.IconScale=function(sum){
   return 20+(5*Math.log(sum)/Math.log(2));
};
ClusterSymbol.IconStyle=function(name){
   //expect to be bound to ClusterSymbol object

      return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor:"rgb(0, 160, 80)",
			fillOpacity:0.7,
			strokeWeight:1.5,
			strokeColor:"rgb(0, 128, 128)",
			labelOrigin:google.maps.Point(0, 0)
      };




};
}else{
    setTimeout(start,100);
}