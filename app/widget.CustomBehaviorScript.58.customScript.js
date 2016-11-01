if(window.Cluster){
Cluster.Symbol=ClusterSymbol;
ClusterSymbol.IconScale=function(sum){
   return 20+(5*Math.log(sum)/Math.log(2));
};
ClusterSymbol.IconStyle=function(name){
   //expect to be bound to ClusterSymbol object
   if(name=="hover"){

      return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor:"rgb(130, 51, 130)",
			fillOpacity:0.7,
			strokeWeight:1.5,
			strokeColor:"rgb(130, 51, 130)",
			labelOrigin:google.maps.Point(0, 0)
      };


   }else{
   

      return {
		path: google.maps.SymbolPath.CIRCLE,
		fillColor:"#0A79B1",
		fillOpacity:0.4,
		strokeWeight:1.5,
		strokeColor:"#0A79B1",
		labelOrigin:google.maps.Point(0, 0)

	};

   }

};
}else{
    setTimeout(start,100);
}