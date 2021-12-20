<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title> NTRP Tennis Self-Rating Helper | What Is My Tennis Level? </title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="/self-rating-helper/css/styles.css">

        <link href="https://app.precisiontennis.ca/img/favicon.jpg" rel="shortcut icon" type="image/x-icon">
        
        <?php 
          if (strpos($_SERVER['REQUEST_URI'], 'my-ntrp-rating') !== FALSE): 
            include('_open-graph.php'); 
          else: 
        ?>
        <meta property='og:image' content='https://app.precisiontennis.ca/img/precision_tennis_logo.jpg' />
        <meta property='og:title' content='Tennis Self-Rating Helper | What Is My Tennis Level?' />
        <meta property='og:description' content='Simple tool to help you get your self-rated NTRP tennis level.' />
        <?php endif; ?>
      </head>
    <body>
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        
        <div id="root"></div>

        <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>