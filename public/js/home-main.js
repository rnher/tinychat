import "/public/js/jquery/user.js";
import "/public/js/jquery/util.js";

function start() {
    let tiny_chat = $("#tiny-chat");

    // Auth
    tiny_chat.find("#signup-user").signup();
    tiny_chat.find("#signin-user").signin();

    // Common
    tiny_chat.onClickAction({ selector: ".action-btn" });
}

start();