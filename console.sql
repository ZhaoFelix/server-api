# 创建管理员表
create table if not exists `t_admin_list`(
	`admin_id` int unique auto_increment,
    `admin_name` varchar(20) comment '登录名',
     `admin_pwd` varchar(100) comment '密码',
     `admin_type` int comment  '管理员角色',
     `admin_last_time` datetime comment '上一次登录时间',
    `admin_created_time` datetime comment '创建时间',
    `admin_is_deleted` int default 0 comment '是否被删除'
);

# 角色类型表
create  table  if not exists `t_admin_type`(
    `admin_type_id` int unique  auto_increment,
    `admin_type_name` varchar(50) comment '角色名',
    `admin_type_created_time` datetime comment  '创建时间',
    `admin_type_is_deleted` int default 0 comment '是否有效'
);

select  * from t_admin_type where admin_type_is_deleted = 0 order by admin_type_created_time;

insert into `t_admin_type` (`admin_type_name`, `admin_type_created_time`)  values ('管理员',NOW());


show variables  like  'char%';

# 查看数据库的基本信息
show create  database ningjin_trash;

# 修改数据库的编码格式
alter  database  ningjin_trash character set utf8mb4;

# 查看表的编码格式
show create  table  t_admin_type;

alter  table  t_admin_type character set utf8mb4;

show status;

# 查看字段信息
SHOW FULL COLUMNS from t_admin_list;

# 查看数据库状态
SHOW STATUS;

SELECT * FROM t_admin_list;

-- 添加用户登录名字段
ALTER TABLE t_admin_list ADD admin_login_name VARCHAR(50) COMMENT "用户登录名";

ALTER TABLE t_admin_list ADD admin_token VARCHAR(100) COMMENT "用户token";

DELETE  from  t_admin_list;

SELECT * from t_admin_type;

-- 创建用户信息列表
create table if not exists `t_user_list` (
	`user_id` int unique auto_increment,
    `wechat_open_id` varchar(200) comment '微信openID',
    `wechat_nickname` varchar(50) comment '微信昵称',
    `wechat_avatar` varchar(200) comment '微信头像',
    `wechat_age` int comment '微信昵称',
    `wechat_region` varchar(50) comment  '微信地区',
    `wechat_phone` varchar(50) comment '微信手机号',
    `wechat_created_time` datetime comment '创建时间',
    `wechat_last_time` datetime comment '上一次登录的时间',
    `wechat_is_deleted` int default 0 
)

-- 创建用户信息登记表
CREATE table if not EXISTS `t_user_info_list` (
	`info_id` int UNIQUE auto_increment,
	`wechat_if` int COMMENT '微信ID',
	`info_address` VARCHAR(100) COMMENT '地址',
	`created_time` datetime COMMENT '登记时间',
	`info_is_deleted` int DEFAULT 0  
)

-- 创建车辆信息表
CREATE TABLE if not EXISTS `t_driver_list` (
		`driver_id` INT unique auto_increment,
		`driver_name` VARCHAR(30) COMMENT '司机姓名',
		`driver_phone` VARCHAR(20) COMMENT '司机手机号',
		`car_num` VARCHAR(20) COMMENT '车牌号',
		`car_type` INT COMMENT '车辆类型',
		`car_load_weight` VARCHAR(10) COMMENT '车辆载重',
		`driver_license` VARCHAR(200) COMMENT '渣土运输证',
		`created_time` datetime COMMENT '创建时间',
		`last_login_time` datetime COMMENT '上一次登录时间',
		`driver_id_deleted` INT DEFAULT 0 
)

CREATE TABLE if not EXISTS `t_car_type`(
	`type_id` int UNIQUE auto_increment,
	`type_name` VARCHAR(50) COMMENT '车辆类型',
	`car_price` VARCHAR(10) COMMENT '车辆价格',
	`type_created_time`  datetime COMMENT '创建时间',
	`tyep_is_deleted` int DEFAULT 0
)

create table if not exists `t_order_list` (
	`order_id` int unique auto_increment,
    `driver_id` int comment '司机ID',
    `user_id` int comment '用户ID',
    `order_price` int comment '订单金额',
    `order_final_price` INT COMMENT '订单实付金额',
    `order_status` int default 0 comment '订单状态',
    `order_pay_time` datetime comment '订单支付时间',
    `order_created_time` datetime comment '订单创建时间',
    `order_is_deleted`  int default 0 
);



