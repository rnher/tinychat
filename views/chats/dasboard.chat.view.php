<?php

use APP\SERVICES\Auth;

$user = Auth::User();
?>
<div id="tiny-chat" class="tiny-chat">
    <div class="chat-menu">
        <div class="chat-menu__item user-avatar" title="<?= $user["name"] ?>">
            <img src="<?= $user["avatar"] ?>" alt="<?= $user["name"] ?>">
        </div>

        <div class="chat-menu__item action-btn" data-target="settings" data-action="toggle" title="Cài đặt">
            <i class="fa-solid fa-gear"></i>
        </div>

        <div class="chat-menu__item action-btn" data-target="<?= CONF_URL["signout"] ?>" data-action="link" title="Đăng xuất">
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>
    </div>
    <div class="chat-info">
        <div class="chat-info__menu">
            <div class="input-group input-group_search">
                <div class="input-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input class="search-input" type="text" placeholder="Tìm cuộc trò chuyện" title="Tìm theo tên">
            </div>
        </div>
        <div class="chat-info__content" data-next=" ">
            <!-- Dữ liệu chatinfo load ở đây -->
        </div>
    </div>
    <div class="chat-view">
        <div class="chat-box">
            <div class="chat-box__head">
                <!-- chatinfo -->
            </div>
            <div class="chat-box__content">
                <!-- Dữ liệu messages load ở đây -->
                <div id="chat-box__move-down" class="chat-box__move-down">
                    <i class="fa-solid fa-angles-down"></i>
                </div>
                <div class="chat-box__input">
                    <textarea id="message-textarea" class="message-textarea" type="text" placeholder="Gửi tin nhắn" data-chatinfo autofocus></textarea>
                </div>
            </div>

        </div>
    </div>
</div>