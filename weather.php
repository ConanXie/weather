<?php
    header("Content-type:text/plain; charset='utf-8'");
    function getIP()
    {
        global $ip;
        if (getenv("HTTP_CLIENT_IP")) {
            $ip = getenv("HTTP_CLIENT_IP");
        }else if (getenv("HTTP_X_FORWARDED_FOR")) {
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        } else if (getenv("REMOTE_ADDR")) {
            $ip = getenv("REMOTE_ADDR");
        } else {
            $ip = "Unknow";
        }
        return $ip;
    }
    getIP();
    if ($ip == '127.0.0.1' || $ip == '::1') {
        $ip = '';
    }
    $positionJSON = file_get_contents('http://api.map.baidu.com/location/ip?ip='.$ip.'&ak=v4Wf3i6LQtNU0CvL3fScxzIx&coor=bd09ll');
    $positionData = json_decode($positionJSON);
    $city = $_POST['city'];
    if ($city == '') {
        $city = $positionData->content->address_detail->city;
    }
    echo file_get_contents('http://api.map.baidu.com/telematics/v3/weather?location='.$city.'&output=json&ak=v4Wf3i6LQtNU0CvL3fScxzIx');
?>