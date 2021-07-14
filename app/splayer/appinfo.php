<?php
$AppGV = array(
  "title" => "多媒体代码生成器",
  "version" => "0.0.1",
  "glyphicon" => "glyphicon-film",
  "servers" => array(
    "cdn" => "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/splayer",
    "xljt" => "http://baidu.xljt.cloud/extra/app/splayer",
    "bhffer" => "https://app.bhffer.com/splayer",
    "local" => ".",
  ),
);

function getJsonForJavaScript($obj)
{
    $json = json_encode($obj, JSON_UNESCAPED_UNICODE);
    $json = str_replace('"', '\\"', $json);
    $jsStr = '"' . $json . '"';
    return $jsStr;
}
?>
