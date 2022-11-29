(function ($) {
    $.fn.loadingLayout = function (options) {
        let _this = this;

        let defaults = {
            isShow: true,
            type: "water"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            if (settings.isShow) {
                switch (settings.type) {
                    case "water": {
                        $(_this).append(`<div class="loadding-` + settings.type + ` loadding"></div>`);
                        let target = $("#" + settings.target).hide();
                    }
                        break;
                    default:
                        break;
                }
            } else {
                $(_this).find(".loadding").remove();
                let target = $("#" + settings.target).show();
            }
        };

        return _this.init();
    };
})(jQuery);

