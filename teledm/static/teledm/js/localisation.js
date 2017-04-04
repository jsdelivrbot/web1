function popup(mylink, windowname) { 
    if (! window.focus)return true;
    var href;
    if (typeof(mylink) == 'string') href=mylink;
    else href=mylink.href; 
    page = window.open(href, windowname, 'width=900,height=680,scrollbars=yes'); 
    return false; 
}