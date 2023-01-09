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
            <div class="menu-item setting-item__btn active" data-action="show" data-prevtarget="setting"
                data-target="settings-user">
                <div class="item-icon">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="item-content">
                    Người dùng
                </div>
            </div>
            <div id="setting-item__btn-brand" class="menu-item setting-item__btn" data-action="show"
                data-prevtarget="setting" data-target="settings-brand">
                <div class="item-icon">
                    <i class="fa-solid fa-store"></i>
                </div>
                <div class="item-content">
                    Thương hiệu
                    <button id="btn__add-brand" class="btn__add" title="Thêm thương hiệu">
                        <i class="fa-solid fa-square-plus"></i>
                    </button>
                </div>
            </div>
            <div class="menu-item setting-item__btn" data-action="show" data-prevtarget="setting"
                data-target="settings-member">
                <div class="item-icon">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div class="item-content">
                    Thành viên
                    <button id="btn__add-member" class="btn__add" title="Thêm thành viên viên">
                        <i class="fa-solid fa-square-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="settings-detail">
            <?php
            include_once "views/users/settings.user.view.php";
            include_once "views/brands/settings.brand.view.php";
            include_once "views/members/settings.member.view.php";
            ?>
        </div>
    </div>
    <div class="settings-bottom">
    </div>
</div>