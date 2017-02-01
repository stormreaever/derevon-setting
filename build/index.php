<!DOCTYPE html>
<html>
<head>
  <?php
  
    $chapters=[
      'book',
      'overview',
      'magic',
      'people',
      'places',
      'organizations',
      'characters'
    ];
    
    if (isset($_GET['chapter'])) {
      $chapter = strtolower(htmlspecialchars($_GET['chapter']));
    } else {
      $chapter='book';
    }
    
  ?>
  
  <title><?php echo ucfirst($chapter); ?> - Derevon</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header>
    <a href="/">Derevon</a>
  </header>
  <article>
    <?php
      include('book/' . $chapter . '.html');
    ?>
  </article>
  <footer>
    <?php 
    // get numerical chapter id so we can increment and decrement
      $chapter_id = -1;
      for ($i = 0; $i < count($chapters); $i++) {
        if ($chapters[$i] == $chapter) {
          $chapter_id = $i;
        }
      }
      if ($chapter_id > 0) {
        echo ('<a class="last_chapter" href="/' . $chapters[$chapter_id - 1] . '">' . $chapters[$chapter_id - 1] . '</a>');
      } else {
        echo ('<a class="last_chapter"></a>');
      }
    ?>
    <a class="contents" href="/">Contents</a>
    <?php
    if ($chapter_id < (count($chapters) - 1)) {
      echo ('<a class="next_chapter" href="/' . $chapters[$chapter_id + 1] . '">' . $chapters[$chapter_id + 1] . '</a>');
    } else {
      echo ('<a class="next_chapter"></a>');
    }
    
    ?>
  </footer>
</body>
</html>