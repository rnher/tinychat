<?php

use APP\App;
?>
<div id="signin-user" class="signin-user">
    <div class="customer-form">
        <div class="form-header">
            <img class="logo" src="<?= CONF_APP["logo"]  ?>" alt="<?= CONF_APP["name"] ?>">
            <!-- <label class="label-error text-center" data-name="is"></label> -->
        </div>
        <div class="form-content">
            <form id="signin-user__form" method="post">
                <div class="input-group">
                    <input autofocus type="text" value="<?= App::Singleton()->Cookie("username") ?>" name="username"
                        placeholder="Tên đăng nhập" id="username">
                    <label class="label-error" data-name="username" for="username"></label>
                </div>
                <div class="input-group">
                    <input type="password" value="<?= App::Singleton()->Cookie("password") ?>" placeholder="Mật khẩu"
                        name="password" id="password">
                    <label class="label-error" data-name="password" for="password"></label>
                </div>
                <div class="input-group inline-input-group text-center">
                    <input class="inline-input" id="remember" type="checkbox" name="remember"
                        <?= App::Singleton()->Cookie("remember") ?  "checked" : "" ?>>
                    <label class="inline-input" for="remember">Ghi nhớ tài khoản</label>
                </div>
                <div class="input-group submit-input">
                    <button class="btn btn-submit" type="submit">Đăng nhập</button>
                </div>
            </form>
        </div>
        <div class="form-bottom text-center">
            <a class="link action-btn" data-prevtarget="signin-user" data-target="signup-user" data-action="toggle"
                href="<?= CONF_URL["signup"] ?>">
                Đăng ký
            </a>
            <span class="presentation">-</span>
            <a class="link" href="<?= CONF_URL["home"] ?>">
                Quay lại trang chủ
            </a>
        </div>
    </div>
</div>