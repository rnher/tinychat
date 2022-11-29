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
        <?php
        include_once "views/users/signin.user.view.php";
        include_once "views/users/signup.user.view.php";
        ?>
    </div>

    <!-- js  -->
    <script type="module" src="/public/js/home-main.js"></script>
</body>

</html>