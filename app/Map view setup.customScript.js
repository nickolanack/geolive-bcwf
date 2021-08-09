application.setDefaultView(function(item){
    
    if(item.getType()=="polygon"){
        return "polygonView";
    }
    return "default";
})