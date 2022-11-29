// libraries
import "/public/js/libraries/jquery-3.6.1.js";

// services
import "/public/js/services/chat.js";

// jquery
import "/public/js/jquery/ajax.js";
import "/public/js/jquery/brand.js";
import "/public/js/jquery/chat.js";
import "/public/js/jquery/create.js";
import "/public/js/jquery/user.js";
import "/public/js/jquery/util.js";

function init() {
    // Auth
    $("#signup-user").signup();
    $("#signin-user").signin();

    // Common
    $("#tiny-chat").onClickAction({ selector: ".action-btn" });
}

init();