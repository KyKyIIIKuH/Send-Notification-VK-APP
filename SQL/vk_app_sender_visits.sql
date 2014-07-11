-- phpMyAdmin SQL Dump
-- version 4.2.3
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 11 2014 г., 11:51
-- Версия сервера: 5.5.35-0+wheezy1
-- Версия PHP: 5.4.4-14+deb7u8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `vk_app`
--

-- --------------------------------------------------------

--
-- Структура таблицы `vk_app_sender_visits`
--

CREATE TABLE IF NOT EXISTS `vk_app_sender_visits` (
`id` int(11) NOT NULL,
  `hash` text,
  `datetime_vip_start` datetime NOT NULL,
  `bonus` int(11) NOT NULL DEFAULT '0',
  `limit_app` int(11) NOT NULL DEFAULT '3',
  `title_app` text,
  `list_app` text,
  `list_secret_key` text,
  `iframe_url` text,
  `remote_control` text,
  `name` varchar(64) DEFAULT NULL,
  `uid` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `country` varchar(3) DEFAULT NULL,
  `ip` char(18) DEFAULT NULL,
  `utc` int(11) DEFAULT NULL,
  `visits` int(11) NOT NULL DEFAULT '1',
  `social` enum('vk','ok','facebook') NOT NULL DEFAULT 'vk',
  `guider` enum('1','0') NOT NULL DEFAULT '0',
  `banned` enum('1','0') NOT NULL DEFAULT '0',
  `status` enum('1','0') NOT NULL DEFAULT '1'
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vk_app_sender_visits`
--
ALTER TABLE `vk_app_sender_visits`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `id_vk` (`uid`), ADD KEY `date` (`date`,`visits`), ADD KEY `bonus` (`bonus`), ADD KEY `country` (`country`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vk_app_sender_visits`
--
ALTER TABLE `vk_app_sender_visits`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
