return new Element('button', {"class":"button-expand-left", events:{click:function(){
    var target=this.parentNode.parentNode.parentNode.parentNode.parentNode;
    if(target.hasClass('minimized')){
        target.removeClass('minimized');
        return;
    }
    target.addClass('minimized');
    
}}});