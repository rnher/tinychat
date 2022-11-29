<div id="settings-user" class="settings-user setting">
    <div class="customer-form">
        <div class="form-header">

        </div>
        <div class="form-content">
            <form id="settings-user__form" method="post">
                <div class="input-group">
                    <div class="avatar-image">
                        <label for="input-user-avatar">
                            <input id="input-user-avatar" class="input-avatar" data-target="user-avatar" type="file" name="avatar" hidden>
                            <div  id="review-user-image" class="review-image" data-target="input-user-avatar">
                                <img id="user-avatar" data-self="1" src="<?= $user["avatar"]  ?>" alt="<?= $user["name"] ?>" title="Cập nhật ảnh mới">
                            </div>
                        </label>
                    </div>
                    <label class="label-error" data-name="avatar" for="input-user-avatar"></label>
                    <label class="label-info" for="input-user-avatar"></label>
                </div>

                <div class="input-group">
                    <label class="label-title" for="username">Tên đăng nhập</label>
                    <input type="text" value="" name="username" placeholder="Tên đăng nhập" id="username" disabled>
                    <label class="label-error" data-name="username" for="username"></label>
                    <label class="label-info" for="username">Không thể thay đổi.</label>
                </div>
                <div class="input-group">
                    <label class="label-title" for="name">Họ tên</label>
                    <input type="text" value="" name="name" placeholder="Họ tên" id="name" autofocus>
                    <label class="label-error" data-name="name" for="name"></label>
                    <label class="label-info" for="name"></label>
                </div>
                <div class="input-group">
                    <label class="label-title" for="newpassword">Đổi mật khẩu mới</label>
                    <input type="password" value="" placeholder="Mật khẩu mới" name="newpassword" id="newpassword">
                    <label class="label-error" data-name="newpassword" for="newpassword"></label>
                    <label class="label-info" for="newpassword"></label>
                </div>
                <div class="input-group">
                    <label class="label-title" for="repassword">Xác nhận mật khẩu mới</label>
                    <input type="password" value="" placeholder="Xác thực mật khẩu mới" name="repassword" id="repassword">
                    <label class="label-error" data-name="repassword" for="repassword"></label>
                    <label class="label-info" for="repassword"></label>
                </div>
                <div class="input-group">
                    <label class="label-title" for="password">Mật khẩu hiện tại</label>
                    <input type="password" value="" placeholder="Mật khẩu hiện tại" name="password" id="password">
                    <label class="label-error" data-name="password" for="password"></label>
                    <label class="label-info" for="password">Xác nhận mật khẩu trước khi lưu.</label>
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