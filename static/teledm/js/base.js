$('#left li a').click(function(e) {
    console.log('ok');
    $('#left li.active').removeClass('active');
    var $this = $(this);
    if (!$this.hasClass('active')) {
        $this.addClass('active');
    }
    e.preventDefault();
});