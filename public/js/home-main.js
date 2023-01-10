import "/public/js/jquery/user.js";
import "/public/js/jquery/util.js";
import "/public/js/libraries/owl.carousel.js";

function start() {
    let tiny_chat = $("#tiny-chat");

    let home_banner = tiny_chat.find(".home-banner .owl-carousel");
    home_banner.owlCarousel({
        items: 1,
        autoplay: true,
        autoplayTimeout: 5000,
        loop: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });

    // Auth
    tiny_chat.find("#signup-user").signup();
    tiny_chat.find("#signin-user").signin();

    // Common
    tiny_chat.onClickAction({ selector: ".action-btn" });
}

start();