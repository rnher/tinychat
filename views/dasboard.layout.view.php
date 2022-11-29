<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="#">

    <title><?= isset($head_html) ?  $head_html["title"] : "Tiny Chat" ?></title>
    <meta name="description" content="<?= isset($head_html) ?  $head_html["description"] : "" ?>">

    <!-- css -->
    <link rel="stylesheet" href="/public/css/main.css">
</head>

<body>

    <div id="tiny-chat">
        <div class="bg-layout"></div>
        <!-- <div class="container"> -->
        <?php
        if (isset($brand)) {
            include_once "views/chats/dasboard.chat.view.php";
            include_once "views/includes/setings.view.php";
        } else {
            include_once "views/brands/create.brand.view.php";
        }
        ?>
        <!-- </div> -->
    </div>

    <!-- js  -->
    <script type="module" src="/public/js/dasboard-main.js"></script>
</body>

</html>