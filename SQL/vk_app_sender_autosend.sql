-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 26 2015 г., 12:01
-- Версия сервера: 5.5.44-0+deb7u1
-- Версия PHP: 5.4.41-0+deb7u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `vk_app`
--

-- --------------------------------------------------------

--
-- Структура таблицы `vk_app_sender_autosend`
--

CREATE TABLE IF NOT EXISTS `vk_app_sender_autosend` (
  `id` int(11) NOT NULL,
  `line` bigint(11) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `id_app` int(11) NOT NULL,
  `uid` bigint(12) NOT NULL,
  `message` text NOT NULL,
  `useruids` text,
  `secret_key_app` varchar(255) DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `datetime_start` datetime NOT NULL,
  `progress` int(11) NOT NULL DEFAULT '0',
  `category` enum('1','0') DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COMMENT='Автоматическая отправка уведомлений';

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `vk_app_sender_autosend`
--
ALTER TABLE `vk_app_sender_autosend`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `id_app` (`id_app`,`uid`,`datetime`,`status`),
  ADD KEY `line` (`line`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `vk_app_sender_autosend`
--
ALTER TABLE `vk_app_sender_autosend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
