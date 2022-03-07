//callback({result:7900});

(new AjaxControlQuery(CoreAjaxUrlRoot, "user_function", {
		'widget': "mobileStats"
	})).addEvent('success',function(response){
	    callback({result:7900+response.ios});
	}).cache({expire:3600}).execute(); 