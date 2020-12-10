-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 08. Feb 2019 um 12:20
-- Server-Version: 10.1.36-MariaDB
-- PHP-Version: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `zeiterfassung`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `admin`
--

CREATE TABLE `admin` (
  `ID` int(11) NOT NULL,
  `admin` varchar(255) DEFAULT NULL,
  `passwort` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `admin`
--

INSERT INTO `admin` (`ID`, `admin`, `passwort`) VALUES
(1, 'master', 'master');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `positionen`
--

CREATE TABLE `positionen` (
  `ID` int(11) NOT NULL,
  `position` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `positionen`
--

INSERT INTO `positionen` (`ID`, `position`) VALUES
(1, 'Peojektmanager'),
(2, 'Softwareentwickler'),
(3, 'Softwaretester');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `standorte`
--

CREATE TABLE `standorte` (
  `ID` int(11) NOT NULL,
  `standort` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `standorte`
--

INSERT INTO `standorte` (`ID`, `standort`) VALUES
(1, 'HUFK'),
(2, 'BRZ'),
(3, 'BMF'),
(4, 'Büro'),
(5, 'Kunde2'),
(6, 'Kunde3'),
(7, 'Kunde4');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `userdaten`
--

CREATE TABLE `userdaten` (
  `ID` int(11) NOT NULL,
  `vorname` varchar(30) NOT NULL,
  `nachname` varchar(30) NOT NULL,
  `positionID` int(11) DEFAULT NULL,
  `standortID` int(30) DEFAULT NULL,
  `telefon` varchar(30) DEFAULT NULL,
  `mail` varchar(30) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `passwort` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `userdaten`
--

INSERT INTO `userdaten` (`ID`, `vorname`, `nachname`, `positionID`, `standortID`, `telefon`, `mail`, `username`, `passwort`) VALUES
(1, 'Islam', 'Kozloev', 2, 1, '16597123', '349853ß956', NULL, NULL),
(2, 'Fabian', 'Pieber', 2, 6, '37ß60', '829ß5467', 'kack', 'kack'),
(3, 'Halil', 'Yildrim', 2, 3, '32894689', 'OIKHO', 'test', 'test'),
(4, 'Kerem', 'Basak', 2, 3, '535', '34535', 'hallo', 'hallo'),
(5, 'Saliha', 'Topuzoglu', 1, 7, '720824', '89265ß', 'holeiche', 'Ydyj0S2V');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zeitkonten`
--

CREATE TABLE `zeitkonten` (
  `ID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `tag` date DEFAULT NULL,
  `login` time DEFAULT NULL,
  `logout` time DEFAULT NULL,
  `arbeitsstunden` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `zeitkonten`
--

INSERT INTO `zeitkonten` (`ID`, `userID`, `tag`, `login`, `logout`, `arbeitsstunden`) VALUES
(2, 3, '2019-02-06', '06:05:27', '08:10:17', NULL),
(3, 2, '2019-02-06', '06:18:28', '06:18:37', NULL),
(5, 3, '2019-02-07', '08:28:15', NULL, NULL),
(7, 4, '2019-02-07', '09:15:08', '11:44:59', NULL),
(8, 4, '2019-02-06', '09:15:08', NULL, NULL),
(9, 5, '2019-02-07', '12:02:29', '12:02:56', NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `positionen`
--
ALTER TABLE `positionen`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `standorte`
--
ALTER TABLE `standorte`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `userdaten`
--
ALTER TABLE `userdaten`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `standortID` (`standortID`),
  ADD KEY `positionID` (`positionID`);

--
-- Indizes für die Tabelle `zeitkonten`
--
ALTER TABLE `zeitkonten`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `userID` (`userID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `positionen`
--
ALTER TABLE `positionen`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `standorte`
--
ALTER TABLE `standorte`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `userdaten`
--
ALTER TABLE `userdaten`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `zeitkonten`
--
ALTER TABLE `zeitkonten`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `userdaten`
--
ALTER TABLE `userdaten`
  ADD CONSTRAINT `userdaten_ibfk_1` FOREIGN KEY (`standortID`) REFERENCES `standorte` (`ID`),
  ADD CONSTRAINT `userdaten_ibfk_2` FOREIGN KEY (`positionID`) REFERENCES `positionen` (`ID`);

--
-- Constraints der Tabelle `zeitkonten`
--
ALTER TABLE `zeitkonten`
  ADD CONSTRAINT `zeitkonten_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `userdaten` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
