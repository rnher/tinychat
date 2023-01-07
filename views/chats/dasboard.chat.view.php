<?php

use APP\LIBRARIES\Auth;
use MODELS\User;

$user = User::DetailInfo(Auth::User());
?>
<div id="tiny-chat" class="tiny-chat">
    <div class="navigation-bar">
        <div class="logo">
            <a href="<?= CONF_APP["main_host"]  ?>" target="_blank">
                <img class="logo" src="<?= CONF_APP["logo"]  ?>" alt="<?= CONF_APP["name"] ?>">
            </a>
        </div>
        <div class="news-ticker">
            Chào mừng bạn đến với ứng dụng chat của I-WEB. Đây là nơi đặt thông báo của I-WEB dành cho khách hàng
        </div>
        <div class="
        navigation-bar-item 
        brand-navigation-bar__item 
        brand-navigation-bar__item-notifications" data-target="nav-bar__notifications" title="Thông báo">
            <i class="fa-solid fa-bell"></i>
            <div class="badge-danger"></div>

            <div class="notifications">
                <!-- Thông báo đẩy ở đây  -->
            </div>
        </div>

        <div class="divid"></div>

        <div title="Người dùng" class="
            chat-menu__item-main 
            chat-menu__item user-avatar 
            navigation-bar-item 
            brand-navigation-bar__item 
            brand-navigation-bar__item-user" data-target="nav-bar__user">
            <img src="<?= $user["avatar"] ?>" alt="<?= $user["name"] ?>">
        </div>

        <?= $user["role"] == User::Role("admin") ? ('<div class="divid"></div>
                <div class="
                navigation-bar-item 
                brand-navigation-bar__item
                " data-target="nav-bar__manager" title="Quản lý">
                    <i class="fa-solid fa-globe"></i> Quản lý
                </div>') : "";
        ?>

        <div class="divid"></div>

        <div id="navigation-bar-item__settings" class="
        chat-menu__item 
        action-btn
        navigation-bar-item 
        " data-target="settings" data-action="toggle" title="Cài đặt">
            <i class="fa-solid fa-gear"></i> Cài đặt
        </div>

        <div class="divid"></div>

        <div class="
        chat-menu__item 
        action-btn
        navigation-bar-item 
        " data-target="<?= CONF_URL["signout"] ?>" data-action="link" title="Đăng xuất">
            <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
        </div>
    </div>
    <div class="sub-navigation-bar navigation-bar">

        <a href="<?= CONF_APP["main_host"]  ?>" target="_blank">
            <div class="navigation-bar-item navigation-bar-item__disable" data-target="nav-bar__home" title="Trang chủ">
                <i class="fa-solid fa-house"></i>
            </div>
        </a>

        <div class="divid"></div>

        <div class="navigation-bar-item brand-navigation-bar__item" data-target="nav-bar__chat" title="Chat">
            <i class="fa-solid fa-comments"></i> Chat
        </div>

        <div class="divid"></div>

        <div class="navigation-bar-item brand-navigation-bar__item" data-target="nav-bar__analyses" title="Thống kế">
            <i class="fa-solid fa-chart-simple"></i> Thống kê
        </div>

        <!-- <div class="divid"></div>

        <div class="navigation-bar-item brand-navigation-bar__item" data-target="nav-bar__token" title="Mã nhúng">
            <i class="fa-solid fa-code"></i> Mã nhúng

            <div class="token">
            </div>
        </div> -->

        <div class="divid"></div>

        <div class="navigation-bar-item brand-navigation-bar__item" data-target="nav-bar__settings" title="Cài đặt">
            <i class="fa-solid fa-screwdriver-wrench"></i> Cài đặt
        </div>

        <div class="divid"></div>

        <div class="navigation-bar-item brand-navigation-bar__item" data-target="nav-bar__upgrade" title="Nâng cấp">
            <i class="fa-solid fa-angles-up"></i> Nâng cấp
        </div>


        <div class="divid"></div>

        <div class="navigation-bar-item brand-navigation-bar__item" data-target="nav-bar__support" title="Hỗ trợ">
            <i class="fa-solid fa-headset"></i> Hỗ trợ
        </div>
    </div>
    <div class="chat-container">
        <div class="chat-menu">
            <button id="chat-menu__btn" class="chat-menu__btn btn">
                <i class="fa-solid fa-angles-right"></i>
            </button>
            <div class="chat-menu__list-brand">
                <!-- Dữ liệu brand load ở đây -->
            </div>
        </div>

        <div class="chat-info">
            <div class="chat-info__menu">
                <div class="input-group input-group_search">
                    <div class="input-icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input id="search-chatinfo" class="search-input" type="text" placeholder="Tìm cuộc trò chuyện">
                </div>
            </div>
            <div class="chat-info__content">
                <!-- Dữ liệu chatinfo load ở đây -->
            </div>
        </div>
        <div class="chat-view">
            <div class="chat-box">
                <div class="chat-box__content">
                    <!-- Dữ liệu messages load ở đây -->
                    <div id="chat-box__move-down" class="chat-box__move-down" title="Tới tin nhắn mới nhất">
                        <i class="fa-solid fa-angles-down"></i>
                    </div>
                    <div class="chat-box__input">
                        <div class="chat-box__bar">
                            <button id="item-bar__emoji" class="item-bar" title="Cảm xúc">
                                <i class="fa-regular fa-face-smile"></i>
                            </button>
                            <!-- TODO: -->
                            <!-- <button class="item-bar" title="Tập tin đính kèm">
                            <i class="fa-solid fa-paperclip"></i>
                        </button> -->
                            <button id="item-bar__image" data-target="item-bar__input-image" class="item-bar" title="Hình ảnh đính kèm">
                                <i class="fa-regular fa-image"></i>
                            </button>
                            <input id="item-bar__input-image" type="file" hidden multiple>
                            <div class="view-count-message" title="Giới hạn ký tự">
                                <span class="current-count-message" data-value="0">
                                    0
                                </span>
                                <span>
                                    /
                                </span>
                                <span class="max-count-message" data-value="225">
                                    225
                                </span>
                            </div>
                        </div>
                        <form id="send-message__form" method="post">
                            <textarea id="message-textarea" class="message-textarea" type="text" placeholder="Nhập nội dung tin nhắn" data-chatinfo data-brand autofocus></textarea>
                            <button class="btn btn-submit" type="submit">Gửi</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>