import "/public/js/libraries/jquery-3.6.1.js";
import { getDate } from "/public/js/util.js";

(function ($) {
    $.fn.tableManager = function (options) {
        let _this = this;

        let defaults = {
            className: "",
            data: {
                th: [
                    {
                        value: "user",
                        name: "Người dùng"
                    },
                    {
                        value: "status",
                        name: "Trạng thái"
                    },
                    {
                        value: "service_code",
                        name: "Mã dịch vụ"
                    },
                    {
                        value: "domain",
                        name: "Tên miền"
                    },
                    {
                        value: "expire",
                        name: "Ngày hết hạn"
                    },
                    {
                        value: "create_date",
                        name: "Ngày tạo"
                    },
                    {
                        value: "action",
                        name: "Thao tác"
                    }
                ],
                tds: null
                // [
                //     {
                //         data: `data-userid=${data.user_id} data-memberid=${data.member_id}`,
                //         content: ""
                //     },
                //     {
                //         data: `data-brandstatus=${data.brand_status} data-brandid=${data.brand_id}`,
                //         content: ""
                //     },
                //     {
                //         data: `data-value=${data.brand_token} data-brandid=${data.brand_id}`,
                //         content: ""
                //     },
                //     {
                //         data: `data-value=${data.brand_domain} data-brandid=${data.brand_id}`,
                //         content: ""
                //     },
                //     {
                //         data: `data-value=${data.brand_expire} data-brandid=${data.brand_id}`,
                //         content: ""
                //     },
                //     {
                //         data: `data-value=${data.brand_create_date} data-brandid=${data.brand_id}`,
                //         content: ""
                //     },
                //     {
                //         data: ``,
                //         content: ""
                //     }
                // ]
            },
            pagination_meta: {},
            groups: [
                {
                    value: "service_code",
                    name: "Mã dịch vụ"
                }, {
                    vaule: "user_name",
                    name: "Tên người dùng"
                }, {
                    value: "active",
                    name: "Hoạt động"
                }, {
                    value: "expire",
                    name: "Ngày hết hạn"
                }, {
                    value: "create_date",
                    name: "Ngày tạo"
                },
            ]
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");

            let createPreTable = tiny_chat.createPreTable();

            //
            // Init
            let tb = createPreTable.createTable(settings.className);

            //
            // Bar 
            let table_bar = $(`<div class="table-bar"></div>`);

            // search
            let search = tiny_chat.createSearchInput({
                placeholder: "Tìm kiếm",
                className: "table-search",
            });

            // sort
            let sort = $(`<button title="Giảm dần" class="btn-icon">
                            <i class="fa-solid fa-arrow-down-wide-short"></i>
                        </button>`);
            sort.onClickSortTableManager();

            let group = $(tiny_chat.createSelectInput({
                className: "table-group",
                placeholder: "Nhóm theo",
                id: "table-group"
            }));
            for (let i = 0; i < settings.groups.length; i++) {
                let d = settings.groups[i];
                let op = $(tiny_chat.createSelectOption({
                    value: d.value,
                    name: d.name,
                }));
                group.find(".options").append(op);
            }

            let elemet = $(`<div class="select-group"></div>`);
            group.onClickSelectInout();
            elemet.append(group);
            elemet.append(sort);
            table_bar.append(search);
            table_bar.append(elemet);

            //
            // Heading
            let trh = createPreTable.createTr();
            trh.append($(`<th></th>`).append(createPreTable.checkboxInput("table-checkbox")));
            for (let i = 0; i < settings.data.th.length; i++) {
                let th = settings.data.th[i];
                trh.append(createPreTable.createTh(th));
            }
            tb.append(trh);

            //
            // Rows
            if (settings.data.tds) {
                for (let i = 0; i < settings.data.tds.length; i++) {
                    let tds = settings.data.tds[i];
                    let trd = createPreTable.createTr("table-manager__row");
                    trd.append($(`<td></td>`).append(createPreTable.checkboxInput("table-checkbox")));
                    for (let j = 0; j < tds.length; j++) {
                        let td = tds[j];
                        trd.append(createPreTable.createTd(td));
                    }

                    tb.append(trd);
                }
            }

            elemet = $(`<div class="table__wapper"></div>`);
            elemet.append(table_bar);
            let wapper = $(`<div class="table-manager__wapper"></div>`);
            wapper.append(tb);
            elemet.append(wapper);

            return elemet;
        };

        return _this.init();
    };

    $.fn.onClickGroupTableManager = function (options) {
        let _this = this;

        let defaults = {
            target: null,
            tds: null
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                let op = $(this);
                let target = $(settings.target);
                let group = op.val();
                target.data("group", group);
            });
        };

        return _this.init();
    };

    $.fn.onClickSortTableManager = function (options) {
        let _this = this;

        let defaults = {
            target: null,
            tds: null,
            value: "down"
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.sort = function (group, tds, sort) {
                let algorithm = (tds, sort, upFunc, downFunc) => {
                    for (let i = tds.length - 1; i >= 0; i--) {
                        let current_td = tds[i];

                        let temp_j = -1;
                        for (let j = 0; j < i; j++) {
                            let next_td = tds[j];

                            let sortFunc = null;
                            if (sort == "up") {
                                sortFunc = upFunc;
                            } else if (sort == "down") {
                                sortFunc = downFunc;
                            }

                            if (sortFunc && sortFunc(current_td, next_td)) {
                                temp_j = j;
                                break;
                            };
                        }

                        if (temp_j != -1) {
                            tds[i] = tds[temp_j];
                            tds[temp_j] = current_td;
                            i++;
                        }
                    }

                    return tds;
                };

                switch (group) {
                    case "service_code": {
                        return algorithm(
                            tds,
                            sort,
                            (current_td, next_td) => {
                            },
                            (current_td, next_td) => {

                            }
                        );
                    }
                        break;
                    case "user_name": {
                        return algorithm(
                            tds,
                            sort,
                            (current_td, next_td) => {

                            },
                            (current_td, next_td) => {

                            }
                        );
                    }
                        break;
                    case "active": {
                        return algorithm(
                            tds,
                            sort,
                            (current_td, next_td) => {

                            },
                            (current_td, next_td) => {

                            }
                        );
                    }
                        break;
                    case "expire": {
                        return algorithm(
                            tds,
                            sort,
                            (current_td, next_td) => {

                            },
                            (current_td, next_td) => {

                            }
                        );
                    }
                        break;
                    case "create_date": {
                        return algorithm(
                            tds,
                            sort,
                            (current_td, next_td) => {

                            },
                            (current_td, next_td) => {

                            }
                        );
                    }
                        break;
                    default:
                        break;
                }

                return tds;
            }

            _this.on("click", function (e) {
                e.preventDefault();
                settings.value = settings.value == "up" ? "down" : "up";

                let btn = $(this);
                btn.empty();
                btn.append(settings.value == "up" ? `<i class="fa-solid fa-arrow-up-wide-short"></i>` : `<i class="fa-solid fa-arrow-down-wide-short"></i>`);
                btn.prop("title", settings.value == "up" ? "Tăng dần" : "Giảm dần");

                let tds = settings.tds;
                let target = $(settings.target);
                let group = target.data("group");
                target.data("sort", settings.value);

                let re_tds = _this.sort(group, tds, settings.value);
                // target.reloadTableData({
                //     data: {
                //         tds: re_tds
                //     }
                // });
            });
        };

        return _this.init();
    };

    $.fn.onScrollExtraTableManager = function (options) {
        let _this = this;

        let defaults = {
            target: ".table-manager .table-manager__row"
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Kiểm tra đã load xong và còn dữ liệu
            let isLoadSuccess = true;

            _this.on("scroll", function (e) {
                e.preventDefault();

                let tiny_chat = $("#tiny-chat");

                let element = $(this);

                if (isLoadSuccess) {
                    _this.checkBottomScroll({
                        target: _this.find(settings.target),
                        success: () => {

                            isLoadSuccess = false;

                            // Add loading
                            let loading = $(tiny_chat.createLoader({
                                color: "success"
                            }));
                            _this.append(loading);

                            let url = _this.find(`table.table-manager`).data("next");
                            if (url) {
                                _this.loadDataTableManager({
                                    url,
                                    success: (data) => {
                                        isLoadSuccess = true;

                                        // Remove loading 
                                        loading.remove();

                                        // Scorll ngay điểm bắt đầu load dữ liệu
                                        _this.updateScrollPreBottom({
                                            target: _this.find(settings.target)
                                        });
                                    },
                                    reject: (error) => {
                                        // Remove loading 
                                        loading.remove();
                                    }
                                });
                            } else {
                                // Remove loading 
                                loading.remove();

                                _this.append($("#tiny-chat").createOutOfData());
                            }
                        },
                        reject: (error) => {
                            // TODO: không thể tải thêm
                        }
                    });
                }
            })

        };

        return _this.init();
    };

    $.fn.loadDataTableManager = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.getAjax({
                url: settings.url,
                params: settings.params,
                success: function (data) {
                    let tiny_chat = $("#tiny-chat");
                    let table_manager = _this.find(`.table-manager__wapper table.table-manager`);

                    let items = data.items;
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];

                        let trd = table_manager.fromatRowDataTableManager({
                            data: item
                        });
                        table_manager.append(trd);
                    }

                    table_manager.data("next", data.next_page_url);

                    if (typeof settings.success == "function") {
                        settings.success(data);
                    }
                },
                reject: function (error) {
                    if (typeof settings.reject == "function") {
                        settings.reject(error);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.fromatRowDataTableManager = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");
            let createPreTable = tiny_chat.createPreTable();
            let data = settings.data;

            // brand_avatar
            // : 
            // "/public/images/defaults/brand-avatar.jpg"
            // brand_create_date
            // : 
            // "2023-01-06 15:58:39"
            // brand_domain
            // : 
            // null
            // brand_expire
            // : 
            // "2023-02-06 09:58:39"
            // brand_id
            // : 
            // "3"
            // member_id
            // : 
            // "3"
            // user_avatar
            // : 
            // "/public/images/defaults/user-avatar-9.jpg"
            // user_id
            // : 
            // "3"
            // user_mail
            // : 
            // "3@gmail.com"
            // user_name
            // : 
            // "3"
            // brand_status
            // : 
            // "1"
            let not_data_label = "Chưa có dữ liệu";
            let tds = [
                {
                    data: `data-userid="${data.user_id}" data-memberid="${data.member_id}"`,
                    content: createPreTable.createUser({
                        avatar: data.user_avatar,
                        name: data.user_name,
                        mail: data.user_mail,
                    })
                },
                {
                    data: `data-brandstatus="${data.brand_status}" data-brandid="${data.brand_id}"`,
                    content: tiny_chat.createStatusBadge({
                        status: parseInt(data.brand_status, 10)
                    })
                },
                {
                    data: `data-value=""`,
                    content: ""
                },
                {
                    data: `data-value"=${data.brand_domain}" data-brandid="${data.brand_id}"`,
                    content: !!data.brand_domain ? data.brand_domain : not_data_label
                },
                {
                    data: `data-value="${data.brand_expire}" data-brandid="${data.brand_id}"`,
                    content: !!data.brand_expire ? getDate(data.brand_expire, true) : not_data_label
                },
                {
                    data: `data-value="${data.brand_create_date}" data-brandid="${data.brand_id}"`,
                    content: getDate(data.brand_create_date, true)
                },
                {
                    data: "",
                    content: ""
                }
            ];

            let trd = createPreTable.createTr("table-manager__row");
            trd.append($(`<td></td>`).append(createPreTable.checkboxInput("table-checkbox")));
            for (let j = 0; j < tds.length; j++) {
                let td = tds[j];
                trd.append(createPreTable.createTd(td, j == 0));
            }

            return trd;
        };

        return _this.init();
    }

})(jQuery);