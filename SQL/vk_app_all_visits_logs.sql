-- phpMyAdmin SQL Dump
-- version 4.2.3
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июн 25 2014 г., 21:39
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
-- Структура таблицы `vk_app_all_visits_logs`
--

CREATE TABLE IF NOT EXISTS `vk_app_all_visits_logs` (
`id` int(11) NOT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `id_app` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `id_vk` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vk_app_all_visits_logs`
--
ALTER TABLE `vk_app_all_visits_logs`
 ADD PRIMARY KEY (`id`), ADD KEY `date` (`date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vk_app_all_visits_logs`
--
ALTER TABLE `vk_app_all_visits_logs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
