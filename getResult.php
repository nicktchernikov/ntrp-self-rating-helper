<?php 
    // Import MongoDB drivers, etc
    require('vendor/autoload.php');

    // Initiate connection on Localhost with MongoDB service
    $client = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $db = $client->precisiontennis;

    // Get GET query param
    $resultId = $_GET['resultId'] ?? null;

    // If no GET param, return an error in JSON format
    if (!$resultId) {
        echo json_encode(['error' => 'true']);
        exit;
    }

    // Initialize data array 
    $data = [];

    // Get document
    $docQuery = array('resultId' => $resultId);
    
    // Format for JSON encoding
    foreach ($db->userResults->find($docQuery) as $doc) {
        $data = [
            'ntrp' => $doc->ntrp,
            'answers' => $doc->answers,
            'name' => $doc->name,
            'date' => $doc->date
        ];
    }

    // Print out JSON
    print json_encode($data);
?>