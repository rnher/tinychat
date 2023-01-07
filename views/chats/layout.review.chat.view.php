<div class="layout-review-chat">
    <div class="picker-edit-layout-review-chat">
        <div class="picker-edit edit edit-brand-name-color" title="Click vào để chỉnh sửa"
            data-target="edit-brand-name-color" data-title="Tên thương hiệu" data-color="" data-selectcolor="">
            Tên thương hiệu
        </div>
        <!-- <div class="picker-edit edit edit-brand-text-color" title="Click vào để chỉnh sửa" data-target="edit-brand-text-color"
            data-title="Văn bản thương hiệu" data-color="" data-selectcolor="">
            Văn bản thương hiệu
        </div> -->

        <div class="picker-edit edit edit-brand-content" title="Click vào để chỉnh sửa" data-target="edit-brand-content"
            data-title="Khung CHAT thương hiệu" data-color="" data-selectcolor="" data-bg="" data-selectbg="">
            Khung CHAT thương hiệu
        </div>

        <div class="picker-edit edit edit-customer-content" title="Click vào để chỉnh sửa"
            data-target="edit-customer-content" data-title="Khung CHAT khách hàng" data-color="" data-selectcolor=""
            data-bg="" data-selectbg="">
            Khung CHAT khách hàng
        </div>

        <div class="picker-edit edit edit-main" title="Click vào để chỉnh sửa" data-target="edit-main"
            data-title="Màu chính" data-color="" data-selectcolor="" data-bg="" data-selectbg="" data-text=""
            data-selecttext="" data-icon="" data-selecticon="">
            Màu chính
        </div>
        <div class="picker-edit edit edit-chat-bg" title="Click vào để chỉnh sửa" data-target="edit-chat-bg"
            data-title="Nền CHAT" data-bg="" data-selectbg="">
            Nền CHAT
        </div>

    </div>

    <div id="client-tiny-chat">
        <!-- main -->
        <div class="chat-bubble action-btn main_bg">
            <span class="main_icon main_color">
                <i class="fa-solid fa-message"></i>
            </span>
            <span class="main_text main_color">Chat</span>
            <div class="status-badge badge-danger badge-new-msg">1</div>
        </div>
        <div class="chat-box">
            <!-- main_bg -->
            <div class="chat-box__head main_bg">
                <div class="chatinfo chatinfo-avatar">
                    <div class="info-user">
                        <div class="user-avatar" title="Thương hiệu">
                            <img class="edit-avatar-brand" src="<?= CONF_HOST . CONF_APP["defaults"]["brand_avatar"] ?>"
                                alt="Thương hiệu">
                            <div class="user-online" title="Đang hoạt động">
                            </div>
                        </div>
                        <div class="info-content">
                            <!-- brand_name_color -->
                            <div class="user-name brand_name_color" title="Thương hiệu">
                                Thương hiệu
                            </div>
                            <!-- brand_text_color -->
                            <div class="user-text brand_text_color" title="Thông tin liên hệ">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="client-chat-box__content">
                <!-- chat_bg -->
                <div class="client-chat-box__view chat_bg">
                    <div class="message clearfix message-avatar message-left">
                        <div class="message-user">
                            <div class="user-avatar clearfix">
                                <img class="edit-avatar-brand" title="Thương hiệu"
                                    src="<?= CONF_HOST . CONF_APP["defaults"]["brand_avatar"] ?>" alt="Thương hiệu">
                            </div>
                        </div>
                        <!-- brand_chat -->
                        <div class="message-content brand_chat_bg">
                            <div class="content-msg brand_chat_color">
                                Chào bạn.
                            </div>
                        </div>
                    </div>
                    <div class="message clearfix message-avatar message-right">
                        <!-- client_chat -->
                        <div class="message-content client_chat_bg">
                            <div class="content-msg client_chat_color">
                                Xin chào. Mình cần tư vấn về sản phẩm !
                            </div>
                            <div class="content-info">
                                <div class="content-time client_chat_color">1 giờ trước</div>
                                <div class="content-isseen tooltip edit-content-isseen-customer">
                                    <i class="fa-solid fa-check-double client_chat_color"></i>
                                    <span class="tooltipisseen client_chat_color">Đã xem</span>
                                </div>
                            </div>
                        </div>
                        <div class="message-user">
                            <div class="user-avatar clearfix ">
                                <img title="Người dùng"
                                    src="<?= CONF_HOST . CONF_APP["defaults"]["customer_avatar_1"] ?>" alt="Người dùng">
                            </div>
                        </div>
                    </div>
                    <div class="message clearfix message-avatar message-left">
                        <div class="message-user">
                            <div class="user-avatar clearfix">
                                <img class="edit-avatar-brand" title="Thương hiệu"
                                    src="<?= CONF_HOST . CONF_APP["defaults"]["brand_avatar"] ?>" alt="Thương hiệu">
                            </div>
                        </div>
                        <!-- brand_chat -->
                        <div class="message-content brand_chat_bg">
                            <div class="content-msg brand_chat_color">
                                Được chứ, bạn hãy cung cấp thông tin chi tiết cho mình để tiện kiểm tra sản phẩm nhé.
                            </div>
                        </div>
                    </div>
                </div>
                <!-- main -->
                <div class="chat-box__move-down main_bg main_color" title="Tới tin nhắn mới nhất">
                    <i class="fa-solid fa-angles-down"></i>
                </div>
                <div class="chat-box__input">
                    <div class="chat-box__bar">
                        <button disabled class="item-bar" title="Cảm xúc">
                            <i class="fa-regular fa-face-smile"></i>
                        </button>
                        <button disabled class="item-bar" title="Hình ảnh đính kèm">
                            <i class="fa-regular fa-image"></i>
                        </button>
                        <div class="view-count-message" title="Giới hạn ký tự">
                            <span class="current-count-message" data-value="0">0</span>
                            <span>
                                /
                            </span>
                            <span class="max-count-message" data-value="225">
                                225
                            </span>
                        </div>
                    </div>
                    <textarea disabled class="message-textarea edit-message-textarea" value="" type="text"
                        placeholder="Nhập nội dung tin nhắn">
                    </textarea>
                </div>
            </div>
        </div>
    </div>
</div>