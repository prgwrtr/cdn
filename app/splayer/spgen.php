<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <?php include "hreftim36.php" ?>
  <?php include "appinfo.php" ?>
  <title><?php echo $AppGV['title']; ?></title>
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<!--
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/prgwrtr/cdn@1.28/app/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/prgwrtr/cdn@1.28/app/splayer/css/spgen.css">
<script src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn/app/js/jquery-1.12.4.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn/app/js/bootstrap.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn/app/js/vue-2.6.12.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.1.28/app/js/common1.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.1.28/app/splayer/js/spgen.min.js"></script>
-->
<link rel="stylesheet" href="../css/bootstrap.min.css">
<link rel="stylesheet" href="./css/spgen.css?v=<?php echo $AppGV['version'];?>">
<script src="../js/jquery-1.12.4.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/vue-2.6.12.min.js"></script>
<script src="../js/common1.js?v=<?php echo $AppGV['version'];?>"></script>
<script src="./js/spgen.js?v=<?php echo $AppGV['version'];?>"></script>

<script>
// declare a JavaScript variable global app settings
//var AppGV = JSON.parse(<?php echo getJsonForJavaScript($AppGV); ?>);
var AppGV = <?php echo json_encode($AppGV, JSON_UNESCAPED_UNICODE);?>;
</script>
</head>
<body>


<?php include "navbar.php" ?>

<div class="container">
  <div class="row">
    <div class="col-sm-6">

      <div id="designer">
        <?php include "designer.php"; ?>
      </div>

    </div>
    <div class="col-sm-6">

      <div id="previewer">
        <?php include "previewer.php"; ?>
      </div>

      <div id="code-writer">
        <?php include "code-writer.php"; ?>
      </div>

    </div>
  </div>
</div>

</body>
</html>
