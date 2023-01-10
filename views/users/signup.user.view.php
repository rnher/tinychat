<?php

use APP\App;
?>
<div id="signup-user" class="signup-user">
    <div class="customer-form">
        <div class="form-header">
            <img class="logo" src="<?= CONF_APP["logo"]  ?>" alt="<?= CONF_APP["name"] ?>">
            <!-- <label class="label-error text-center" data-name="is"></label> -->
        </div>
        <div class="form-content">
            <form id="signup-user__form" method="post">
                <div class="input-group">
                    <input type="text" value="" name="username" placeholder="Tên đăng nhập *" id="username" autofocus>
                    <label class="label-error" data-name="username" for="username"></label>
                    <label class="label-info" for="username"></label>
                </div>
                <div class="input-group">
                    <input type="text" value="" name="name" placeholder="Họ tên *" id="name">
                    <label class="label-error" data-name="name" for="name"></label>
                    <label class="label-info" for="name"></label>
                </div>
                <div class="input-group">
                    <input type="text" value="" name="mail" placeholder="Địa chỉ mail *" id="mail">
                    <label class="label-error" data-name="mail" for="mail"></label>
                    <label class="label-info" for="mail"></label>
                </div>
                <div class="input-group">
                    <input type="password" value="" placeholder="Mật khẩu *" name="password" id="password">
                    <label class="label-error" data-name="password" for="password"></label>
                    <label class="label-info" for="password"></label>
                </div>
                <div class="input-group">
                    <input type="password" value="" placeholder="Xác nhận mật khẩu *" name="repassword" id="repassword">
                    <label class="label-error" data-name="repassword" for="repassword"></label>
                    <label class="label-info" for="repassword"></label>
                </div>
                <div class="input-group submit-input">
                    <button class="btn btn-submit" type="submit">Đăng ký</button>
                </div>
            </form>
        </div>
        <div class="form-bottom text-center">
            <span>Bạn đã có tài khoản ?</span>
            <a class="link action-btn" data-prevtarget="signup-user" data-target="signin-user" data-action="toggle"
                data-clear="true" href="<?= CONF_URL["signin"] ?>">
                Đăng nhập
            </a>
        </div>
    </div>
</div>