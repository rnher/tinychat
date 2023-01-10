<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="manifest" href="<?= $head_html["manifest"] ?>">
    <link rel="icon" type="image/x-icon" href="<?= $head_html["icon"] ?>">
    <title><?= $head_html["title"]  ?></title>
    <meta name="description" content="<?= $head_html["description"]  ?>">
    <meta name="keywords" content="<?= $head_html["keywords"] ?>">

    <!-- css -->
    <link rel="stylesheet" href="/public/css/main.css">
</head>

<body>
    <div id="tiny-chat">
        <div class="main-bg__area">
            <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

        <div class="home-container">
            <div class="home-container__left">
                <?php
                include_once "includes/home.banner.view.php";
                ?>
            </div>
            <div class="home-container__right">
                <?php
                include_once "views/users/signin.user.view.php";
                include_once "views/users/signup.user.view.php";
                ?>
            </div>
        </div>
    </div>

    <!-- js  -->
    <script type="module" src="/public/js/home-main.js"></script>
</body>

</html>