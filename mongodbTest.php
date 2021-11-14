<?php
    // Import MongoDB drivers, etc
    require('vendor/autoload.php');

    // Initiate connection on Localhost with MongoDB service
    $client = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $db = $client->precisiontennis;

    $collections = $db->listCollections();
    foreach ($collections as $collection) {
        echo $collection->getName();
    }
?>