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
-- Структура таблицы `vk_app_sender_list`
--

CREATE TABLE IF NOT EXISTS `vk_app_sender_list` (
`id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `app_id` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('1','0') NOT NULL DEFAULT '1',
  `progress` int(11) NOT NULL DEFAULT '0',
  `status` enum('1','0') NOT NULL DEFAULT '0'
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vk_app_sender_list`
--
ALTER TABLE `vk_app_sender_list`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `hash` (`hash`), ADD KEY `progress` (`progress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vk_app_sender_list`
--
ALTER TABLE `vk_app_sender_list`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
