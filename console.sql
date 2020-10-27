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






