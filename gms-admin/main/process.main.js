$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('url')) {
        loadContent();
    }
    $(".nav-link").click(function (e) {
        e.preventDefault();
        if (searchParams.has('url')) {
            searchParams.set('url', $(this).attr('id'));
            loadContent();
        }
    });

    function loadContent() {
        $(".nav-link").removeClass('active');
        $("#" + searchParams.get('url')).addClass('active');
        $("#content").load("../" + searchParams.get('url'));
    }
});
