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
import "/public/js/jquery/image.js";
import "/public/js/jquery/layout.js";

function init() {
    // Init socket
    Chat.getInstance(function (chat) {

        // Profile
        $("#tiny-chat").initLoadBrand();
        $("#tiny-chat").initProfile();

        $("#settings-user__form").submitProfileUser();
        $("#settings-brand__form").submitProfileBrand();
        $("#settings-close__btn").onCloseSettings();
        $(".setting-item__btn").onClickSettingDetail();

        // Chat
        $(".chat-info__content").onScrollExtraChatInfos();
        $("#tiny-chat").onClickChatinfoDetail({ selector: ".chatinfo" });

        $("#message-textarea").submitSendMessage();
        $("#create-brand__form").submitCreateBrand();

        // Common
        $("#tiny-chat").onClickAction({ selector: ".action-btn" });
        // $("#tiny-chat .clipboard").onClickClipboard();
    });
};

init();