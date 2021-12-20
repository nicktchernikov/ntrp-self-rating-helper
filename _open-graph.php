<?php
  // Import MongoDB drivers, etc
  require('vendor/autoload.php');

  function getNameAndDate() {
        $client = new MongoDB\Client('mongodb://127.0.0.1:27017');
        $db = $client->precisiontennis;
        $resultId = explode('/', $_SERVER['REQUEST_URI'])[2];
        if ($resultId) { 
          $docQuery = array('resultId' => $resultId);
          $data = [];
          foreach ($db->userResults->find($docQuery) as $doc) {
              $data = [
                  'ntrp' => $doc->ntrp,
                  'name' => $doc->name,
                  'date' => $doc->date
              ];
          }
          return $data;
        }
        return array();
  }

  function renderOpenGraphTags($name, $date) {
    $tags = [
      [
        'property' => 'og:title',
        'content' =>  $name . '\'s Self-Rated NTRP Tennis Level ['.$date.']'
      ],

      [
        'property' => 'og:description',
        'content' => 'Check out ' . $name . '\'s self-rated NTRP tennis level  on ' . $date . '.'
      ],
      [
        'property' => 'og:image',
        'content' => 'https://app.precisiontennis.ca/img/precision_tennis_logo.jpg'
        // 'content' => 'https://precisiontennis.ca/assets/img/precision_tennis_logo_smaller_cropped.jpg'
      ]
    ];

    foreach($tags as $tag) {
      print '<meta property="'.$tag['property'].'" content="'.$tag['content'].'" />';
    }

  }

  $data = getNameAndDate();

  $name = $data['name'];
  $date = $data['date'];
  $ntrp = $data['ntrp'];

  renderOpenGraphTags($name, $date);

?>