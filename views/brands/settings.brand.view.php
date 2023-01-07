<div id="settings-brand" class="settings-brand setting">
    <div class="customer-form">
        <div class="form-header">
            <label class="label-title" for="select-brand">Thương hiệu</label>
            <div id="select-brand" class="select-brand select-box">
                <input type="checkbox" class="options-view-button" title="Chọn thương hiệu">
                <div class="select-button" class="brd">
                    <div class="selected-value">
                        <span>Chọn thương hiệu</span>
                    </div>
                    <div class="chevrons">
                        <i class="fas fa-chevron-up"></i>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div class="options">
                </div>
            </div>
        </div>
        <div class="form-content">
            <form id="settings-brand__form" data-id method="post">
                <input id="csrf" class="input-csrf" type="text" hidden>

                <div class="input-group">
                    <label class="label-title" for="name">Ảnh bìa</label>
                    <div class="banner-image">
                        <label for="input-brand-banner">
                            <input id="input-brand-banner" class="input-banner" data-target="brand-banner" type="file" name="banner" hidden>
                            <div id="review-brand-banner-image" class="review-banner-image review-image" data-target="input-brand-banner">
                                <img id="brand-banner" src="" alt="" data-self="1" title="Cập nhật ảnh bìa mới">
                            </div>
                        </label>
                    </div>
                    <label class="label-error" data-name="banner" for="input-brand-banner"></label>
                    <label class="label-info" for="input-brand-banner"></label>
                </div>

                <div class="input-group">
                    <label class="label-title" for="name">Ảnh đại diện</label>
                    <div class="avatar-image">
                        <label for="input-brand-avatar">
                            <input id="input-brand-avatar" class="input-avatar" data-target="brand-avatar" type="file" name="avatar" hidden>
                            <div id="review-brand-avatar-image" class="review-avatar-image review-image" data-target="input-brand-avatar">
                                <img id="brand-avatar" src="" alt="" data-self="1" title="Cập nhật ảnh đại diện mới">
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
                    <label class="label-title" for="greeting">Lời chào khách hàng</label>
                    <textarea type="text" value="" name="greeting" placeholder="" id="greeting"></textarea>
                    <label class="label-error" data-name="greeting" for="greeting"></label>
                    <label class="label-info" for="greeting"></label>
                </div>

                <div class="input-group is_require_mail__input-group">
                    <label class="label-title" for="is_require_mail" title="Bắt buộc khách hàng cung cấp địa chỉ mail trước khi trò chuyện">Yêu cầu địa chỉ mail khách hàng</label>
                    <input class="toggle" type="checkbox" id="is_require_mail" name="is_require_mail">
                    <label class="label-error" data-name="is_require_mail" for="is_require_mail"></label>
                    <label class="label-info" for="is_require_mail"></label>
                </div>

                <div class="input-group is_require_phone__input-group">
                    <label class="label-title" for="is_require_phone" title="Bắt buộc khách hàng cung cấp số điện thoại trước khi trò chuyện">Yêu cầu số điện thoại khách hàng</label>
                    <input class="toggle" type="checkbox" id="is_require_phone" name="is_require_phone">
                    <label class="label-error" data-name="is_require_phone" for="is_require_phone"></label>
                    <label class="label-info" for="is_require_phone"></label>
                </div>

                <div class="input-group">
                    <label class="label-title" for="domain">Tên miền trang web</label>
                    <input type="text" value="" placeholder="Tên miền trang web" name="domain" id="domain">
                    <label class="label-error" data-name="domain" for="domain"></label>
                    <label class="label-info" for="domain"></label>
                </div>
                <div class="input-group token__input-group">
                    <label class="label-title" for="token">Mã nhúng</label>
                    <div id="token__input-group" class="action__input-group">
                        <input type="text" value="" placeholder="Mã nhúng" name="token" id="token" disabled>
                        <button id="clipboard-btn__token" class="clipboard-btn" data-target="token" type="button" title="Sao chép mã">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                    </div>
                    <label class="label-error" data-name="token" for="token"></label>
                    <label class="label-info" for="token"></label>
                </div>

                <div class="input-group review-chat__input-group">
                    <label class="label-title">Cá nhân hóa hộp CHAT</label>
                    <?php
                    include_once "views/chats/layout.review.chat.view.php";
                    ?>
                </div>

                <div class="input-group password__input-group">
                    <label class="label-title">Mật khẩu hiện tại *</label>
                    <input type="password" value="" placeholder="Mật khẩu hiện tại" name="password" id="password">
                    <label class="label-error" data-name="password" for="password"></label>
                    <label class="label-info">Xác nhận mật khẩu trước khi
                        cập nhật hoặc xóa.</label>
                </div>

                <div class="input-group submit-input">
                    <button class="btn btn-submit" type="submit">Cập nhật</button>
                </div>
                <div class="input-group">
                    <button id="btn__delete-brand" type="button" data-id="" class="btn btn-danger">Xóa</button>
                </div>
            </form>
        </div>
        <div class="form-bottom">

        </div>
    </div>
</div>