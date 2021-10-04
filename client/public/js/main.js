$(document).ready(function () {
    $(".chat-icon").click(function () {
        $(this).addClass("open");
        $(".chat-window").addClass("opened");
        $('body').append('<div class="black-overlay"></div>');
    });
    $(".close-btn").click(function () {
        $(".chat-window").removeClass("opened");
        $(".chat-icon").removeClass("open");
        $(".black-overlay").remove();
    });
})
