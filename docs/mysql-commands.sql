create database if not exists cine_UTN;

create user if not exists root@'%' identified by 'root';
grant all on cine_UTN.* to root@'%';
