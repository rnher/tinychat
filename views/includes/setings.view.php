<div id="settings" class="settings" data-target="">
    <div class="settings-head">
        <div class="head-title">
            Cài đặt
        </div>
        <div class="head-action">
            <button id="settings-close__btn" class="btn-icon" data-target="settings" data-action="toggle" title="Đóng">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>
    <div class="settings-content">
        <div class="settings-menu">
            <div class="menu-item setting-item__btn active" data-action="show" data-prevtarget="setting" data-target="settings-user">
                <div class="item-icon">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="item-content">
                    Người dùng
                </div>
            </div>
            <div class="menu-item setting-item__btn" data-action="show" data-prevtarget="setting" data-target="settings-brand">
                <div class="item-icon">
                    <i class="fa-solid fa-shop"></i>
                </div>
                <div class="item-content">
                    Thương hiệu
                </div>
            </div>
        </div>
        <div class="settings-detail">
            <?php
            include_once "views/users/settings.user.view.php";
            include_once "views/brands/settings.brand.view.php";
            ?>
        </div>
    </div>
    <div class="settings-bottom">
    </div>
</div>