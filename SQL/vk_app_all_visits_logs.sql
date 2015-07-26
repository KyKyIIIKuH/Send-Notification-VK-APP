-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 26 2015 г., 12:00
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
-- Структура таблицы `vk_app_all_visits_logs`
--

CREATE TABLE IF NOT EXISTS `vk_app_all_visits_logs` (
  `id` bigint(11) NOT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `id_app` bigint(11) NOT NULL,
  `id_vk` bigint(12) NOT NULL,
  `date` datetime NOT NULL,
  `country` varchar(3) DEFAULT NULL,
  `ip` char(20) DEFAULT NULL,
  `social` enum('vk','ok','facebook') NOT NULL DEFAULT 'vk'
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `vk_app_all_visits_logs`
--
ALTER TABLE `vk_app_all_visits_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date` (`date`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `vk_app_all_visits_logs`
--
ALTER TABLE `vk_app_all_visits_logs`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=0;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
