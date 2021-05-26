if(Core::Client()->isAdmin()||Core::Client()->getUserId()===$feature['uid']){
   return true;
}
return time()-strtotime($feature['creationDate'])>2*24*3600;