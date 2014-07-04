-- phpMyAdmin SQL Dump
-- version 4.2.3
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 04 2014 г., 22:41
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
-- Структура таблицы `vk_app_all_visits`
--

CREATE TABLE IF NOT EXISTS `vk_app_all_visits` (
`id` int(11) NOT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `id_app` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `id_vk` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `first_visit` datetime NOT NULL,
  `visits` int(11) NOT NULL DEFAULT '1',
  `social` enum('vk','ok') DEFAULT 'vk'
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vk_app_all_visits`
--
ALTER TABLE `vk_app_all_visits`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `hash` (`hash`), ADD KEY `date` (`date`,`visits`), ADD KEY `first_visit` (`first_visit`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vk_app_all_visits`
--
ALTER TABLE `vk_app_all_visits`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
