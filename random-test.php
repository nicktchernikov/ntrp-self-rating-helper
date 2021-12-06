<?php

    // https://github.com/delight-im/PHP-Random

    require('vendor/autoload.php');

    use \Delight\Random\Random as Random;

    echo Random::alphaHumanString(7);
    // echo Random::intBetween(1, 100);
    
?>