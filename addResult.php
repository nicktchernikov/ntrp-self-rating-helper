<?php 
    // Import MongoDB drivers, etc
    require('vendor/autoload.php');

    // Initiate connection on Localhost with MongoDB service
    $client = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $db = $client->precisiontennis;

    // Retrieve $_POST data
    $answers = $_POST ?? null;

    // If no GET param, return an error in JSON format
    if (!$answers) {
        echo json_encode(['error' => 'true']);
        exit;
    }
    
    // Fake doc
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
    if (count($answers) > 1) {
        $answersCopy = $answers;
        array_shift($answersCopy);
        $ntrp = array_sum($answersCopy) / count($answersCopy);
        $ntrp = round($ntrp, 1);
    } else {
        $ntrp = $answers[0];
    }

    // Real doc
    $doc = [
        "resultId" => uniqid(),
        "ntrp" => $ntrp,
        "answers" => [
            'general' => $answers[0],
            'groundstrokes' => $answers[1], 
            'net play' => $answers[2], 
            'return of serve' => $answers[3],
            'serve' => $answers[4]
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