<?php
include_once "mysql.php";
include_once "phpmailer/class.phpmailer.php";
$mysql=new MySQL();

if($_GET['type']=='login'){
    $username=$_GET['username'];
    $password=$_GET['password'];
    $sql="select * from users where username='".$username."'";
    $data=$mysql->get_one($sql);
    if(!empty($data)){
        if($data['password']==$password){
            $user['id']=$data['id'];
            $user['username']=$data['username'];
            $user['state']=$data['status'];
            $user['isLog']=1;
            echo json_encode($user);
        }else{
            $user['isLog']=0;
            echo json_encode($user);
        }
    }else{
        $user['isLog']=2;
        echo json_encode($user);
    }
}elseif($_GET['type']=='register'){
    $username=$_GET['username'];
    $password=$_GET['password'];
    $data=array(
        'username'=>$username,
        'password'=>$password,
        'createtime'=>date('Y-m_d H:i:s'),
    );
    if($mysql->insert('users',$data)){
        echo 1;
    }else{
        echo 0;
    }
}elseif($_GET['type']=='apply'){
    if(empty($_GET['aid'])){
        $data=array(
            'userid'=>$_GET['userid'],
            'proposer'=>$_GET['proposer'],
            'tel'=>$_GET['tel'],
            'module'=>$_GET['module'],
            'versions'=>$_GET['versions'],
            'mac'=>$_GET['mac'],
            'address'=>$_GET['address'],
            'endtime'=>$_GET['endtime'],
            'createtime'=>date('Y-m_d H:i:s'),
        );
        if($mysql->insert('apply',$data)){
            try{
                $mail = new PHPMailer(true);
                $mail->IsSMTP();
                $mail->CharSet='UTF-8'; //设置邮件的字符编码，这很重要，不然中文乱码
                $mail->SMTPAuth   = true;                  //开启认证
                $mail->Port       = 25;
                $mail->Host       = "";
                $mail->Username   = "18782939469";
                $mail->Password   = "daonian12";
                //$mail->IsSendmail(); //如果没有sendmail组件就注释掉，否则出现“Could  not execute: /var/qmail/bin/sendmail ”的错误提示
                $mail->AddReplyTo("hey@chinawiserv.com","mckee");//回复地址
                $mail->From       = "18782939469@163.com";
                $mail->FromName   = "wode";
                $to = "hey@chinawiserv.com";
                $mail->AddAddress($to);
                $mail->Subject  = "有新的用户申请了licence";
                $str="";
                $str.="<h1>有新的用户申请了licence</h1>";
                $str.="<table>";
                $str.="<tr>";
                $str.="<td>申请人：</td>";
                $str.="<td>".$data['proposer']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>电话：</td>";
                $str.="<td>".$data['tel']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>工具类型：</td>";
                $str.="<td>".$data['module']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>版本：</td>";
                $str.="<td>".$data['versions']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>MAC：</td>";
                $str.="<td>".$data['mac']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>项目名称：</td>";
                $str.="<td>".$data['address']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>到期时间：</td>";
                $str.="<td>".$data['endtime']."</td>";
                $str.="</tr>";
                $str.="<tr>";
                $str.="<td>申请时间：</td>";
                $str.="<td>".$data['createtime']."</td>";
                $str.="</tr>";
                $mail->Body =$str;
                $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; //当邮件不支持html时备用显示，可以省略
                $mail->WordWrap   = 80; // 设置每行字符串的长度
                //$mail->AddAttachment("f:/test.png");  //可以添加附件
                $mail->IsHTML(true);
                $mail->Send();
                echo 1;
            }catch (phpmailerException $e){
                //echo "邮件发送失败：".$e->errorMessage();
                echo 1;
            };
        }else{
            echo 0;
        }
    }else{
        $sql="select * from apply where id=".$_GET['aid'];
        $data= $mysql->get_one($sql);
        echo json_encode($data);
    }

}elseif($_GET['type']=='users'){
    $sql="select * from users";
    $data=$mysql->get_all($sql);
    echo json_encode($data);
}elseif($_GET['type']=='list'){
  if(empty($_GET['uid'])){
      $sql="select * from apply";
      $data=$mysql->get_all($sql);
     echo json_encode($data);
  }else{
      $sql="select * from apply where userid=".$_GET['uid'];
      $data=$mysql->get_all($sql);
      echo json_encode($data);
  }
}elseif($_GET['type']=='tools'){
    if(empty($_GET['s'])&&empty($_GET['d'])){
        $sql="select * from tools";
        $data=$mysql->get_all($sql);
        echo json_encode($data);
    }elseif($_GET['s']==1){
       $data=array(
           'name'=>$_GET['name']
       );
        if($mysql->insert('tools',$data)){
            echo 1;
        }
    }elseif($_GET['d']==1){
      if($mysql->delete('tools','id='.$_GET['id'])){
         echo 1;
      }
    }
}elseif($_GET['type']=='check'){
    if(!empty($_GET['aid'])){
        $sql="select * from checkapply where applyid=".$_GET['aid'];
        $data=$mysql->get_one($sql);
        echo json_encode($data);
    }else{
        $data=array(//get data
            'applyid'=>$_GET['applyid'],
            'proposer'=>$_GET['proposer'],
            'tel'=>$_GET['tel'],
            'module'=>$_GET['module'],
            'versions'=>$_GET['versions'],
            'mac'=>$_GET['mac'],
            'address'=>$_GET['address'],
            'endtime'=>$_GET['endtime'],
            'checktime'=>date('Y-m_d H:i:s'),
        );
        if(empty($_GET['cid'])){
            if($mysql->insert('checkapply',$data)){//add check
                $data_apply=array(
                    'state'=>1,
                    'checker'=>$_GET['checker'],
                    'checktime'=>date('Y-m_d H:i:s')
                );
                $mysql->update('apply',$data_apply,'id='.$_GET['applyid']);
                echo 1;
            }else{
                echo 0;
            }
        }else{//update check
            if($mysql->update('checkapply',$data,'id='.$_GET['cid'])){
                $data_apply=array(
                    'checker'=>$_GET['checker'],
                    'checktime'=>date('Y-m_d H:i:s')
                );
                $mysql->update('apply',$data_apply,'id='.$_GET['applyid']);
                echo 1;
            }else{
                echo 0;
            }
        }
    }

}




