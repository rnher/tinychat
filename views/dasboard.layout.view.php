<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="manifest" href="<?= $head_html["manifest"] ?>">
    <link rel="icon" type="image/x-icon" href="<?= $head_html["icon"] ?>">
    <title><?= $head_html["title"] ?></title>
    <meta name="description" content="<?= $head_html["description"] ?>">
    <meta name="keywords" content="<?= $head_html["keywords"] ?>">

    <!-- css -->
    <link rel="stylesheet" href="/public/css/main.css">
</head>

<body>

    <div id="tiny-chat">
        <div class="blur-bg_layout"></div>
        <?php
        include_once "views/chats/dasboard.chat.view.php";
        include_once "views/includes/settings.view.php";
        ?>
    </div>

    <!-- js  -->
    <script type="module" src="/public/js/dasboard-main.js"></script>
</body>

</html>