-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2022 at 05:43 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tinychat`
--

-- --------------------------------------------------------

--
-- Table structure for table `table_brand`
--

CREATE TABLE `table_brand` (
  `id` int(50) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_alias` varchar(100) NOT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  `domain` varchar(200) DEFAULT NULL,
  `token` varchar(200) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `expired_date` datetime DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `table_chat_info`
--

CREATE TABLE `table_chat_info` (
  `id` int(50) UNSIGNED NOT NULL,
  `brand_id` int(50) UNSIGNED NOT NULL,
  `customer_id` int(50) UNSIGNED NOT NULL,
  `is_seen_member` int(1) UNSIGNED NOT NULL,
  `is_seen_customer` int(1) UNSIGNED NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `table_customer`
--

CREATE TABLE `table_customer` (
  `id` int(50) UNSIGNED NOT NULL,
  `token` varchar(200) NOT NULL,
  `brand_id` int(50) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` int(50) UNSIGNED NOT NULL,
  `is_active` int(1) DEFAULT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `table_member`
--

CREATE TABLE `table_member` (
  `id` int(50) UNSIGNED NOT NULL,
  `brand_id` int(50) UNSIGNED DEFAULT NULL,
  `user_id` int(50) UNSIGNED DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `table_message`
--

CREATE TABLE `table_message` (
  `id` int(50) UNSIGNED NOT NULL,
  `chatinfo_id` int(50) UNSIGNED NOT NULL,
  `sender_id` int(50) UNSIGNED NOT NULL,
  `is_brand` int(1) UNSIGNED NOT NULL,
  `type` varchar(50) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `is_seen_member` int(1) UNSIGNED NOT NULL,
  `is_seen_customer` int(1) UNSIGNED NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `table_session`
--

CREATE TABLE `table_session` (
  `id` int(50) UNSIGNED NOT NULL,
  `token` varchar(200) NOT NULL,
  `user_id` int(50) UNSIGNED NOT NULL,
  `is_login` int(1) NOT NULL,
  `expire` int(50) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `table_user`
--

CREATE TABLE `table_user` (
  `id` int(50) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `table_brand`
--
ALTER TABLE `table_brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_alias` (`name_alias`);

--
-- Indexes for table `table_chat_info`
--
ALTER TABLE `table_chat_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table_customer`
--
ALTER TABLE `table_customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table_member`
--
ALTER TABLE `table_member`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table_message`
--
ALTER TABLE `table_message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table_session`
--
ALTER TABLE `table_session`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table_user`
--
ALTER TABLE `table_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `table_brand`
--
ALTER TABLE `table_brand`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table_chat_info`
--
ALTER TABLE `table_chat_info`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table_customer`
--
ALTER TABLE `table_customer`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table_member`
--
ALTER TABLE `table_member`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table_message`
--
ALTER TABLE `table_message`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table_session`
--
ALTER TABLE `table_session`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table_user`
--
ALTER TABLE `table_user`
  MODIFY `id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
