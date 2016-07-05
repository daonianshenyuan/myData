<?php
$now = date("Y-m-d h:i:s");
$headers = 'From: name<1968065832@qq.com>';
$body = "hi, this is a test mail.\nMy email: sender@qq.com";
$subject = "test mail";
$to = "595882735@qq.com";
if (mail($to, $subject, $body, $headers))
{
    echo 'success!';
}
else
{
    echo 'fail';
}