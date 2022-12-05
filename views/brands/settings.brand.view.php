<div id="settings-brand" class="settings-brand setting">
    <div class="customer-form">
        <div class="form-header">
        </div>
        <div class="form-content">
            <form id="settings-brand__form" method="post">
                <div class="input-group">
                    <div class="avatar-image">
                        <label for="input-brand-avatar">
                            <input id="input-brand-avatar" class="input-avatar" data-target="brand-avatar" type="file" name="avatar" hidden>
                            <div id="review-brand-image" class="review-image" data-target="input-brand-avatar">
                                <img id="brand-avatar" src="<?= $brand["avatar"] ?>" alt="<?= $brand["name"] ?>" data-self="1" title="Cập nhật ảnh mới">
                            </div>
                        </label>
                    </div>
                    <label class="label-error" data-name="avatar" for="input-brand-avatar"></label>
                    <label class="label-info" for="input-brand-avatar"></label>
                </div>

                <div class="input-group">
                    <label class="label-title" for="name">Tên thương hiệu</label>
                    <input type="text" value="" name="name" placeholder="Tên thương hiệu" id="name" autofocus>
                    <label class="label-error" data-name="name" for="name"></label>
                    <label class="label-info" for="name"></label>
                </div>

                <div class="input-group">
                    <label class="label-title" for="description">Mô tả thương hiệu</label>
                    <input type="text" value="" name="description" placeholder="Mô tả thương hiệu" id="description">
                    <label class="label-error" data-name="description" for="description"></label>
                    <label class="label-info" for="description"></label>
                </div>

                <div class="input-group">
                    <label class="label-title" for="domain">Tên miền trang web</label>
                    <input type="text" value="" placeholder="Tên miền trang web" name="domain" id="domain">
                    <label class="label-error" data-name="domain" for="domain"></label>
                    <label class="label-info" for="domain"></label>
                </div>
                <div class="input-group">
                    <label class="label-title" for="token">Mã nhúng</label>
                    <input class="clipboard" type="text" value="" placeholder="Mã nhúng" name="token" id="token" disabled>
                    <label class="label-error" data-name="token" for="token"></label>
                    <label class="label-info" for="token">Mã của bạn hết hạn ngày:
                        <?= (new DateTime($brand["expired"]))->format("m-d-Y")  ?>.</label>
                </div>

                <!-- <div class="input-group token-input-group">
                    <input type="text" value="" name="token" placeholder="Mã nhúng web" id="token" disabled>
                    <button id="syn-token-btn" class="sub-btn" title="Tạo mã mới"><i class="fa-solid fa-rotate"></i></button>
                </div> -->

                <div class="input-group">
                    <label class="label-title">Mật khẩu hiện tại</label>
                    <input type="password" value="" placeholder="Mật khẩu hiện tại" name="password" id="password">
                    <label class="label-error" data-name="password" for="password"></label>
                    <label class="label-info">Xác nhận mật khẩu trước khi
                        lưu.</label>
                </div>

                <div class="input-group submit-input">
                    <label class="label-error text-center" data-name="is" for="is"></label>
                    <button class="btn btn-submit" type="submit">Cập nhật</button>
                </div>
            </form>
        </div>
        <div class="form-bottom">

        </div>
    </div>
</div>