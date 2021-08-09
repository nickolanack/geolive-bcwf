tile.addEvent('click',function(){ 
    
    var exportOptions={};
    
    var token=map.getContentFilterManager().getToken();
	if(token){
		exportOptions['filter']=token;
	}
    
    
    if(exportOptions.filter&&exportOptions.filter.indexOf('mu')===0){
        exportOptions['filter-bounds']=exportOptions.filter;
        delete exportOptions.filter;
    }
        
    
    window.open((new AjaxControlQuery(CoreAjaxUrlRoot, "get_pdf", {
        'widget': "report",
        "title":"BCWF Export",
        'variables':{
            "exportOptions":exportOptions,
        }
    })).getUrl(true), "Download");
    
});