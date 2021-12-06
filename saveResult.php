<?php 
    // Import MongoDB drivers, etc
    require('vendor/autoload.php');
  
    // Rename Random class
    use \Delight\Random\Random as Random;

    // Initiate connection on Localhost with MongoDB service
    $client = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $db = $client->precisiontennis;

    // Retrieve $_POST data
    $formData = $_POST ?? null;

    // Sort post data
    $ratings = [];
    foreach($formData as $key => $value) {
        if (strpos($key, 'rating') !== false) {
            $ratings[] = $value;
        }
    }
    $name = $formData['data-name'];
    $date = $formData['data-date'];

    // If no GET param, return an error in JSON format
    if (!$ratings) {
        echo json_encode(['error' => 'true']);
        exit;
    }
    
    // Fake doc for testing
    // $doc = [
    //     "resultId" => uniqid(),
    //     "ntrp" => rand(2, 4) . '.' . rand(0, 9),
    //     "answers" => [
    //         'groundstrokes' => floatval(rand(2, 4)), 
    //         'net play' => floatval(rand(2, 4)), 
    //         'return of serve' => floatval(rand(2, 4)),
    //         'serve' => floatval(rand(2, 4))
    //     ]
    // ];

    // Caculate NTRP value
    if (count($ratings) > 1) {
        $ratingsCopy = $ratings;
        array_shift($ratingsCopy);
        $ntrp = array_sum($ratingsCopy) / count($ratingsCopy);
        $ntrp = round($ntrp, 1);
    } else {
        $ntrp = $ratings[0];
    }

    // Real doc
    $doc = [
        // "resultId" => uniqid(),
        "resultId" => Random::alphaHumanString(6),
        "name" => $name,
        "date" => $date,
        "ntrp" => $ntrp,
        "answers" => [
            'general' => $ratings[0],
            'groundstrokes' => $ratings[1], 
            'net play' => $ratings[2], 
            'return of serve' => $ratings[3],
            'serve' => $ratings[4]
        ]
    ];

    // Insert doc
    $result = $db->userResults->insertOne($doc);

    // Get inserted doc resultId
    $docQuery = array('_id' => $result->getInsertedId());
    $queryResult = $db->userResults->find($docQuery);
    foreach($queryResult as $insertedDoc) {
        $data = [
            'error' => false,
            'resultId' => $insertedDoc->resultId
        ];
        break;
    }

    // Print out JSON
    print json_encode($data);
?>