-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ott 26, 2021 alle 13:09
-- Versione del server: 10.4.18-MariaDB
-- Versione PHP: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `merende`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `foods`
--

CREATE TABLE `foods` (
  `foodId` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `price` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `foods`
--

INSERT INTO `foods` (`foodId`, `name`, `price`) VALUES
(1, 'Ciambellina cioccolato', '1.20'),
(2, 'Saccottino cioccolato', '1.00'),
(3, 'Sandwich tonno', '1.00'),
(4, 'Sandwich prosciutto', '1.00');

-- --------------------------------------------------------

--
-- Struttura della tabella `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userOwner` int(11) NOT NULL,
  `classOwner` varchar(6) NOT NULL,
  `foodId` int(11) NOT NULL,
  `done` varchar(1) NOT NULL DEFAULT 'n',
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `second_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `attribute` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`userId`, `username`, `first_name`, `second_name`, `last_name`, `password`, `email`, `attribute`) VALUES
(1, 'admin', 'Lorenzo', '', 'Pascale', 'U2FsdGVkX1+ZSV5l7lGchcpr1nk+FP0xxr6SxyFseqM=', 'admin@iisve.it', 'admin'),
(2, 's23710', 'Lorenzo', '', 'Pascale', 'U2FsdGVkX1+ZSV5l7lGchcpr1nk+FP0xxr6SxyFseqM=', 's23710@iisve.it', '3 CI'),
(3, 's23552', 'Marco', '', 'Giacchini', 'U2FsdGVkX1+b/F/foE17moMK7WnE9BIhr35OfyDYVhg=', 's23552@iisve.it', '3 CI');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`foodId`);

--
-- Indici per le tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `userOwner` (`userOwner`) USING BTREE,
  ADD KEY `foodId` (`foodId`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `foods`
--
ALTER TABLE `foods`
  MODIFY `foodId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userOwner`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`foodId`) REFERENCES `foods` (`foodId`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
