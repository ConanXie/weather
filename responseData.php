<?php
    header("Content-type:text/plain; charset='utf-8'");
    $city = str_replace('|', '', $_POST['city']);
    $local = '北京';
    if ($city == '') {
        $city = $local;
    }
    if (file_exists(iconv("utf-8", "GBK", "json/".$city.".json"))) {
        $file_handle = fopen(iconv("utf-8", "GBK", "json/".$city.".json"), "r");
        while (!feof($file_handle)) {
            $data = fgets($file_handle);
        }
        sleep(3);
        echo $data;
    } else {
        echo '{"error":-3, "status":"No result  available"}';
    }
    fclose($file_handle);
?>