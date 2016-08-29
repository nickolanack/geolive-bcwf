
var clientid=<?php echo Core::Client()->getUserId();?>;

if(clientid>0){

	AjaxControlQuery.Subscribe({
                channel: 'user.' + clientid,
                'event': 'notification'
            }, function(result) {

                if(result.text){
                      NotificationBubble.Make('', result.text);
                }
            });


}
