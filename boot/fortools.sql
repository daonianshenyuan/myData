/*
Navicat MySQL Data Transfer

Source Server         : mySQL
Source Server Version : 50527
Source Host           : localhost:3306
Source Database       : fortools

Target Server Type    : MYSQL
Target Server Version : 50527
File Encoding         : 65001

Date: 2016-07-05 11:14:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `apply`
-- ----------------------------
DROP TABLE IF EXISTS `apply`;
CREATE TABLE `apply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(255) DEFAULT NULL,
  `versions` varchar(255) DEFAULT NULL,
  `mac` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `endtime` varchar(100) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  `proposer` varchar(30) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `state` tinyint(4) DEFAULT '0',
  `userid` int(11) DEFAULT NULL,
  `checker` varchar(100) DEFAULT NULL,
  `checktime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of apply
-- ----------------------------
INSERT INTO `apply` VALUES ('1', 'asd', 'asd', 'asd', 'asd', 'asd', '2016-04-26 08:44:41', 'asd', 'asd', '1', '1', 'admin', '2016-05-24 05:11:37');
INSERT INTO `apply` VALUES ('2', 'asd', 'asd', 'asd', 'asd', 'asddd', '2016-04-26 08:45:23', 'asd', 'asd', '1', '1', null, null);
INSERT INTO `apply` VALUES ('3', 'asd', 'asd', 'asd', 'asd', 'asd', '2016-04-26 08:46:38', 'asd', 'asdd', '1', '1', 'admin', '2016-05-24 05:12:49');
INSERT INTO `apply` VALUES ('4', 'asd', 'asd', 'asd', 'asd', 'asd', '2016-04-26 08:47:06', 'asd', 'asd', '1', '1', null, null);
INSERT INTO `apply` VALUES ('5', 'PTN', '我不晓得', 's8:12:23:d8', '无锡', '临时License', '2016-04-27 08:37:09', '艾伦', '18888888888', '1', '1', null, null);
INSERT INTO `apply` VALUES ('6', 'PTN', 'asd', 'asd', 'asd', '临时License', '2016-04-29 08:05:56', 'wode', '1233', '0', '2', null, null);
INSERT INTO `apply` VALUES ('7', 'OTN', 'asdaw', 'asdw', 'asdaw', '临时License', '2016-05-03 04:17:02', 'asdadq', 'asdwad', '0', '2', null, null);
INSERT INTO `apply` VALUES ('8', 'OTN', 'asdaw', 'asdw', 'asdaw', '临时License', '2016-05-03 04:17:13', 'asdadq', 'asdwad', '1', '2', 'admin', '2016-05-24 05:09:30');
INSERT INTO `apply` VALUES ('9', 'PTN', 'asd', 'asd', 'de', '临时License', '2016-05-03 04:20:38', 'asd', 'asd', '0', '2', null, null);
INSERT INTO `apply` VALUES ('10', 'PTN', 'asd', 'asd', 'de', '临时License', '2016-05-03 04:21:15', 'asd', 'asd', '0', '2', null, null);
INSERT INTO `apply` VALUES ('11', 'OTN', 'asd', 'asd', 'asd', '临时License', '2016-05-03 04:21:52', 'asd', 'asd', '0', '2', null, null);
INSERT INTO `apply` VALUES ('12', 'OTN', 'asd', 'asd', 'asd', '临时License', '2016-05-03 04:22:07', 'asd', 'asd', '0', '2', null, null);
INSERT INTO `apply` VALUES ('13', 'PTN', 'asd', 'asd', 'asd', '临时License', '2016-05-03 04:23:42', 'asd', 'asd', '0', '2', null, null);
INSERT INTO `apply` VALUES ('14', 'OTN', 'asd', 'asd', 'asd', '临时License', '2016-05-03 04:24:38', 'asd', 'asd', '0', '2', null, null);

-- ----------------------------
-- Table structure for `checkapply`
-- ----------------------------
DROP TABLE IF EXISTS `checkapply`;
CREATE TABLE `checkapply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(255) DEFAULT NULL,
  `versions` varchar(255) DEFAULT NULL,
  `mac` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `endtime` varchar(100) DEFAULT NULL,
  `checktime` datetime DEFAULT NULL,
  `proposer` varchar(30) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `applyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of checkapply
-- ----------------------------
INSERT INTO `checkapply` VALUES ('12', 'PTN', '我不晓得', 's8:12:23:d8', '无锡', '临时License', '2016-04-28 08:46:12', '艾伦ka', '18888888888', '5');
INSERT INTO `checkapply` VALUES ('13', 'OTN', '哈哈', '我的不晓得', '山东济南找蓝翔', '永久的', '2016-04-28 08:50:53', '我的', '1238888888', '4');
INSERT INTO `checkapply` VALUES ('14', 'asd', 'asd', 'asd', 'asd', 'asddd', '2016-04-28 09:03:08', 'asd哈哈', 'asd', '2');
INSERT INTO `checkapply` VALUES ('15', 'OTN', 'asdaw', 'asdw', 'asdaw', '临时License', '2016-05-24 05:09:30', 'asdadq', 'asdwad', '8');
INSERT INTO `checkapply` VALUES ('16', 'asd', 'asd', 'asd', 'asd', 'asd', '2016-05-24 05:11:37', 'asd', 'asd', '1');
INSERT INTO `checkapply` VALUES ('17', 'asd', 'asd', 'asd', 'asd', 'asd', '2016-05-24 05:12:49', 'asd', 'asdd', '3');

-- ----------------------------
-- Table structure for `tools`
-- ----------------------------
DROP TABLE IF EXISTS `tools`;
CREATE TABLE `tools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tools
-- ----------------------------
INSERT INTO `tools` VALUES ('4', 'PTN');
INSERT INTO `tools` VALUES ('5', 'OTN');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `createtime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '123456', '1', '2016-04-26 15:35:24');
INSERT INTO `users` VALUES ('2', 'asd', 'asd', '0', '2016-04-25 15:35:28');
INSERT INTO `users` VALUES ('3', 'wode', 'heyu', '0', '0000-00-00 00:00:00');
