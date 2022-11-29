<?php

use APP\App;
?>
<div class="create-brand">
    <div class="customer-form">
        <div class="form-header">
            <img class="logo" src="<?= CONF_HOST . "/public/images/app/logo.svg" ?>" alt="<?= App::Singleton()->getConfig()["name"] ?>">
            <label class="label-error text-center" data-name="is"></label>
        </div>
        <div class="form-content">
            <form id="create-brand__form" method="post">
                <div class="input-group">
                    <input autofocus type="text" value="" name="name" placeholder="Tên thương hiệu" id="name">
                    <label class="label-error" data-name="name" for="name"></label>
                    <label class="label-info" data-name="name" for="name"></label>
                </div>
                <div class="input-group">
                    <input type="text" value="" placeholder="Mô tả thương hiệu" name="description" id="description">
                    <label class="label-error" data-name="description" for="description"></label>
                    <label class="label-info" data-name="description" for="description"></label>
                </div>
                <div class="input-group submit-input">
                    <button class="btn btn-submit" type="submit">Tạo</button>
                </div>
            </form>
        </div>
        <div class="form-bottom text-center">
            <a class="link action-btn" href="<?= CONF_URL["signout"] ?>" data-target="<?= CONF_URL["signout"] ?>" data-action="link" title="Đăng xuất">
                Đăng xuất
            </a>
        </div>
    </div>
</div>