-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 26 2015 г., 12:04
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
-- Структура таблицы `vk_app_sender_visits`
--

CREATE TABLE IF NOT EXISTS `vk_app_sender_visits` (
  `id` int(11) NOT NULL,
  `hash` text,
  `datetime_vip_start` datetime NOT NULL,
  `bonus` int(11) NOT NULL DEFAULT '0',
  `limit_app` int(11) NOT NULL DEFAULT '3',
  `title_app` longtext,
  `list_app` longtext,
  `list_secret_key` longtext,
  `iframe_url` longtext,
  `datetime_edit_app` text,
  `datetime_add_app` longtext,
  `remote_control` longtext,
  `select_app` varchar(255) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `uid` bigint(12) NOT NULL,
  `date` datetime NOT NULL,
  `country` varchar(3) DEFAULT NULL,
  `ip` char(18) DEFAULT NULL,
  `utc` varchar(255) NOT NULL DEFAULT 'Europe/Moscow',
  `visits` int(11) NOT NULL DEFAULT '1',
  `social` enum('vk','ok','facebook') NOT NULL DEFAULT 'vk',
  `guider` enum('1','0') NOT NULL DEFAULT '0',
  `banned` enum('1','0') NOT NULL DEFAULT '0',
  `banned_message` text,
  `status` enum('1','0') NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `vk_app_sender_visits`
--
ALTER TABLE `vk_app_sender_visits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_vk` (`uid`),
  ADD KEY `date` (`date`,`visits`),
  ADD KEY `bonus` (`bonus`),
  ADD KEY `country` (`country`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `vk_app_sender_visits`
--
ALTER TABLE `vk_app_sender_visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
