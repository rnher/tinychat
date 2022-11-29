<?php

use APP\App;
?>
<div id="signup-user" class="signup-user">
    <div class="customer-form">
        <div class="form-header">
            <img class="logo" src="/public/images/app/logo.svg" alt="<?= App::Singleton()->getConfig()["name"] ?>">
            <label class="label-error text-center" data-name="is"></label>
        </div>
        <div class="form-content">
            <form id="signup-user__form" method="post">
                <div class="input-group">
                    <input type="text" value="" name="username" placeholder="Tên đăng nhập" id="username" autofocus>
                    <label class="label-error" data-name="username" for="username"></label>
                    <label class="label-info" for="username"></label>
                </div>
                <div class="input-group">
                    <input type="text" value="" name="name" placeholder="Họ tên" id="name">
                    <label class="label-error" data-name="name" for="name"></label>
                    <label class="label-info" for="name"></label>
                </div>
                <div class="input-group">
                    <input type="password" value="" placeholder="Mật khẩu" name="password" id="password">
                    <label class="label-error" data-name="password" for="password"></label>
                    <label class="label-info" for="password"></label>
                </div>
                <div class="input-group">
                    <input type="password" value="" placeholder="Xác nhận mật khẩu" name="repassword" id="repassword">
                    <label class="label-error" data-name="repassword" for="repassword"></label>
                    <label class="label-info" for="repassword"></label>
                </div>
                <div class="input-group submit-input">
                    <button class="btn btn-submit" type="submit">Đăng ký</button>
                </div>
            </form>
        </div>
        <div class="form-bottom text-center">
            <a class="link action-btn" data-prevtarget="signup-user" data-target="signin-user" data-action="toggle" href="<?= CONF_URL["signin"] ?>">
                Đăng nhập
            </a>
            <span class="presentation">-</span>
            <a class="link" href="<?= CONF_URL["home"] ?>">
                Quay lại trang chủ
            </a>
        </div>
    </div>
</div>