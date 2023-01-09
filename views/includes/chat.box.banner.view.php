<div class="banner chat-box__banner">
    <div class="app_greeting ">
        Chào mừng bạn đến với <span><?= CONF_APP["name"]  ?></span>
    </div>
    <div class="owl-carousel owl-theme chat-box__banner">
        <div class="item">
            <img src="<?= CONF_APP["introduce_images"][0]["dir"]  ?>" alt="<?= CONF_APP["introduce_images"][0]["name"] ?>">
            <h4>
                <?= CONF_APP["introduce_images"][0]["title"]  ?>
            </h4>
            <span>
                <?= CONF_APP["introduce_images"][0]["content"]  ?>
            </span>
        </div>
        <div class="item">
            <img src="<?= CONF_APP["introduce_images"][1]["dir"] ?>" alt="<?= CONF_APP["introduce_images"][1]["name"] ?>">
            <h4>
                <?= CONF_APP["introduce_images"][1]["title"]  ?>
            </h4>
            <span>
                <?= CONF_APP["introduce_images"][1]["content"]  ?>
            </span>
        </div>
        <div class="item">
            <img src="<?= CONF_APP["introduce_images"][2]["dir"]  ?>" alt="<?= CONF_APP["introduce_images"][2]["name"] ?>">
            <h4>
                <?= CONF_APP["introduce_images"][2]["title"]  ?>
            </h4>
            <span>
                <?= CONF_APP["introduce_images"][2]["content"]  ?>
            </span>
        </div>
        <div class="item">
            <img src="<?= CONF_APP["introduce_images"][3]["dir"]  ?>" alt="<?= CONF_APP["introduce_images"][3]["name"] ?>">
            <h4>
                <?= CONF_APP["introduce_images"][3]["title"]  ?>
            </h4>
            <span>
                <?= CONF_APP["introduce_images"][3]["content"]  ?>
            </span>
        </div>
    </div>
</div>