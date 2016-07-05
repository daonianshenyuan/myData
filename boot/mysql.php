<?php
class MySQL {
	private static $db_config = array(
	"hostname" => "localhost", //服务器地址
    "username" => "root", //数据库用户名
	"password" => "", //数据库密码
	"database" => "fortools", //数据库名称
	"charset"  => "utf8",//数据库编码
	"pconnect" => 1,	//开启持久连接
	"log" 	   => 0,	//开启日志
	"logfilepath" =>'./'//开启日志
	);

	private $link_id;
	private $handle;
	private $is_log;
	private $time;

	//构造函数
	public function __construct() {
		$this->time = $this->microtime_float();
		$this->connect(self::$db_config["hostname"], 
					   self::$db_config["username"], 
					   self::$db_config["password"], 
					   self::$db_config["database"], 
					   self::$db_config["pconnect"]);
		$this->is_log = self::$db_config["log"];
		if($this->is_log){
			$handle = fopen(self::$db_config["logfilepath"]."dblog.txt", "a+");
			$this->handle=$handle;
		}
	}
	
	//数据库连接
	public function connect($dbhost, $dbuser, $dbpw, $dbname, $pconnect = 0,$charset='utf8') {
		if( $pconnect==0 ) {
			$this->link_id = @mysql_connect($dbhost, $dbuser, $dbpw, true);
			if(!$this->link_id){
				$this->halt("数据库连接失败");
			}
		} else {
			$this->link_id = @mysql_pconnect($dbhost, $dbuser, $dbpw);
			if(!$this->link_id){
				$this->halt("数据库持久连接失败");
			}
		}
		if(!@mysql_select_db($dbname,$this->link_id)) {
			$this->halt('数据库选择失败');
		}
		@mysql_query("set names ".$charset);
	}
	
	//--------------------事务----------------
	//开启事务
	public function beginTransaction(){
		mysql_query("START TRANSACTION");
		return true;
	}	
	//提交事务
	public function commitTransaction(){
		mysql_query("COMMIT");
		return true;
	}
	//回滚事务
	public function rollbackTransaction(){
		mysql_query("ROLLBACK");
		return true;
	}
	/**
	 * 在事务中执行一个方法
	 * 例子: traExe_ObjFunc("test", array("name"));
	 * @param String $string_funcName //方法名
	 * @param Array $array_Params //方法参数
	 */
	public function traExe_Func($string_funcName, $array_Params){
		try{
			$this->beginTransaction();
		 	if($array_Params){
		 		$r = call_user_func_array($string_funcName, $array_Params);
		 	}else{
		 		$r = call_user_func($string_funcName);
		 	}
		 	$this->commitTransaction();
		 	return $r;
		}catch(Exception $e){
	 	    $this->halt("事务执行错误:".$e->getMessage());
	 	    $this->rollbackTransaction();
	 	    return false;
	  	}
	}
	
	/**
	 * 在事务中执行一个对象方法
	 * 例子: traExe_ObjFunc(new AAA(), "test", array("name"));
	 * @param Object $object_obj //对象
	 * @param String $string_funcName //方法名
	 * @param Array $array_Params //方法参数
	 */
	public function traExe_ObjFunc($object_obj, $string_funcName, $array_Params){
		try{
			$this->beginTransaction();
			if($object_obj){
		 		if($array_Params){
		 			$r = call_user_func_array(array($object_obj, $string_funcName), $array_Params);
		 		}else{
		 			$r =  call_user_func(array($object_obj, $string_funcName));
		 		}
		 		$this->commitTransaction();
		 		return $r;
		 	}else{
		 		return false;
		 	}
		}catch(Exception $e){
	 	    $this->halt("事务执行错误:".$e->getMessage());
	 	    $this->rollbackTransaction();
	 	    return false;
	  	}
	}
	//--------------------事务----------------

	//查询 
	public function query($sql) {
		$this->write_log("查询 ".$sql);
		$query = mysql_query($sql,$this->link_id);
		if(!$query){
			$error = 'SQL执行错误[sql: ' . $sql.'],异常原因:'.mysql_error($this->link_id);
			$this->halt($error);
			throw new Exception($error);
		}
		return $query;
	}
	
	//获取一条记录（MYSQL_ASSOC，MYSQL_NUM，MYSQL_BOTH）				
	public function get_one($sql,$result_type = MYSQL_ASSOC) {
		$query = $this->query($sql);
		$rt =mysql_fetch_array($query,$result_type);
		$this->write_log("获取一条记录 ".$sql);
		return $rt;
	}

	//获取全部记录
	public function get_all($sql,$result_type = MYSQL_ASSOC) {
		$query = $this->query($sql);
		$i = 0;
		$rt = array();
		while($row =mysql_fetch_array($query,$result_type)) {
			$rt[$i]=$row;
			$i++;
		}
		$this->write_log("获取全部记录 ".$sql);
		return $rt;
	}
	
	/**
	 * $dataArray=array(
     * '字段1'=>'值1',
     * '字段2'=>'值2'
     * );   
	 */
	//插入
	public function insert($table,$dataArray) {
		$field = "";
		$value = "";
		if( !is_array($dataArray) || count($dataArray)<=0) {
			$this->halt('没有要插入的数据');
			return false;
		}
		while(list($key,$val)=each($dataArray)) {
			if(isset($val)&&(is_numeric($val)||$val!='')){
				$field .="$key,";
				$value .="'$val',";
			}
		}
		$field = substr( $field,0,-1);
		$value = substr( $value,0,-1);
		$sql = "insert into $table($field) values($value)";
		$this->write_log("插入 ".$sql);
		$this->query($sql);
		return true;
	}

	//更新
	public function update( $table,$dataArray,$condition="") {
		if( !is_array($dataArray) || count($dataArray)<=0) {
			$this->halt('没有要更新的数据');
			return false;
		}
		$value = "";
		while( list($key,$val) = each($dataArray)){
			if(isset($val)){
				$value .= "$key = '$val',";
			}
		}
		$value = substr( $value,0,-1);
		$sql = "update $table set $value where 1=1";
		if($condition){
			$sql .= " and $condition";
		}
		$this->write_log("更新 ".$sql);
		$this->query($sql);
		return true;
	}

	//删除
	public function delete( $table,$condition="") {
		if( empty($condition) ) {
			$this->halt('没有设置删除的条件');
			return false;
		}
		$sql = "delete from $table where 1=1 and $condition";
		$this->write_log("删除 ".$sql);
		$this->query($sql);
		return true;
	}

	//返回结果集
	public function fetch_array($query, $result_type = MYSQL_ASSOC){
		$this->write_log("返回结果集");
		return mysql_fetch_array($query, $result_type);
	}

	//获取记录条数
	public function num_rows($results) {
		if(!is_bool($results)) {
			$num = mysql_num_rows($results);
			$this->write_log("获取的记录条数为".$num);
			return $num;
		} else {
			return 0;
		}
	}

	//释放结果集
	public function free_result() {
		$void = func_get_args();
		foreach($void as $query) {
			if(is_resource($query) && get_resource_type($query) === 'mysql result') {
				return mysql_free_result($query);
			}
		}
		$this->write_log("释放结果集");
	}

	//获取最后插入的id
	public function insert_id() {
		$id = mysql_insert_id($this->link_id);
		$this->write_log("最后插入的id为".$id);
		return $id;
	}

	//关闭数据库连接
	protected function close() {
		$this->write_log("已关闭数据库连接");
		return @mysql_close($this->link_id);
	}

	//错误提示
	private function halt($msg='') {
		$msg .= "\r\n".mysql_error();
		$this->write_log($msg);
//		die($msg);
	}

	//析构函数
	public function __destruct() {
		$this->free_result();
		$use_time = ($this-> microtime_float())-($this->time);
		$this->write_log("完成整个查询任务,所用时间为".$use_time);
		if($this->is_log){
			fclose($this->handle);
		}
	}
	
	//写入日志文件
	public function write_log($msg=''){
		if($this->is_log){
			$text = date("Y-m-d H:i:s")." ".$msg."\r\n";
			fwrite($this->handle,$text);
		}
	}
	
	//获取毫秒数
	public function microtime_float() {
		list($usec, $sec) = explode(" ", microtime());
		return ((float)$usec + (float)$sec);
	}
}
?>