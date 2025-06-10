-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema wypożyczalnia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema wypożyczalnia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `wypożyczalnia` DEFAULT CHARACTER SET utf8mb3 ;
USE `wypożyczalnia` ;

-- -----------------------------------------------------
-- Table `wypożyczalnia`.`cennik`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`cennik` (
  `idCennik` INT NOT NULL AUTO_INCREMENT,
  `RocznikCennik` YEAR NOT NULL,
  `Cena_per_Dzień` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idCennik`),
  UNIQUE INDEX `RocznikCennik` (`RocznikCennik` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`klienci`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`klienci` (
  `idKlient` INT NOT NULL AUTO_INCREMENT,
  `Imie` VARCHAR(50) NOT NULL,
  `Nazwisko` VARCHAR(50) NOT NULL,
  `Telefon` VARCHAR(15) NULL DEFAULT NULL,
  `Email` VARCHAR(100) NULL DEFAULT NULL,
  `Adres` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`idKlient`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`pracownicy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`pracownicy` (
  `idPracownicy` INT NOT NULL AUTO_INCREMENT,
  `Imie` VARCHAR(50) NOT NULL,
  `Nazwisko` VARCHAR(50) NOT NULL,
  `Telefon` VARCHAR(15) NULL DEFAULT NULL,
  `Email` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idPracownicy`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`samochody`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`samochody` (
  `Nr_Rej` VARCHAR(45) NOT NULL,
  `Rocznik` YEAR NOT NULL,
  `Numer_VIN` VARCHAR(45) NOT NULL,
  `Dostępność` TINYINT(1) NULL DEFAULT '1',
  `Marka` VARCHAR(45) NOT NULL,
  `Model` VARCHAR(45) NOT NULL,
  `Klasa` VARCHAR(45) NULL DEFAULT NULL,
  `Kolor` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`Nr_Rej`),
  UNIQUE INDEX `Numer_VIN` (`Numer_VIN` ASC) VISIBLE,
  INDEX `fk_Cennik` (`Rocznik` ASC) VISIBLE,
  CONSTRAINT `fk_Cennik`
    FOREIGN KEY (`Rocznik`)
    REFERENCES `wypożyczalnia`.`cennik` (`RocznikCennik`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`wypożyczenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`wypożyczenia` (
  `idWypożyczenia` INT NOT NULL AUTO_INCREMENT,
  `Klient` INT NOT NULL,
  `Pracownik` INT NULL DEFAULT NULL,
  `NrRej` VARCHAR(45) NOT NULL,
  `Data_wypożyczenia` DATE NULL DEFAULT NULL,
  `Data_zwrotu` DATE NULL DEFAULT NULL,
  `Pakiet_ubezpieczeń` INT NOT NULL,
  `Status` ENUM('oczekujące', 'zatwierdzone', 'anulowane', 'zakończone') NULL DEFAULT 'oczekujące',
  PRIMARY KEY (`idWypożyczenia`),
  INDEX `Klient` (`Klient` ASC) VISIBLE,
  INDEX `Pracownik` (`Pracownik` ASC) VISIBLE,
  INDEX `NrRej` (`NrRej` ASC) VISIBLE,
  CONSTRAINT `wypożyczenia_ibfk_1`
    FOREIGN KEY (`Klient`)
    REFERENCES `wypożyczalnia`.`klienci` (`idKlient`),
  CONSTRAINT `wypożyczenia_ibfk_2`
    FOREIGN KEY (`Pracownik`)
    REFERENCES `wypożyczalnia`.`pracownicy` (`idPracownicy`),
  CONSTRAINT `wypożyczenia_ibfk_3`
    FOREIGN KEY (`NrRej`)
    REFERENCES `wypożyczalnia`.`samochody` (`Nr_Rej`))
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`faktury`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`faktury` (
  `idFaktury` INT NOT NULL AUTO_INCREMENT,
  `NrWypożyczenia` INT NOT NULL,
  `Klient` VARCHAR(100) NOT NULL,
  `NrRejestracyjny` VARCHAR(45) NOT NULL,
  `DataWypożyczenia` DATE NOT NULL,
  `DataZwrotu` DATE NULL DEFAULT NULL,
  `CzasWypożyczenia` INT NULL DEFAULT NULL,
  `Pakiet` VARCHAR(45) NULL DEFAULT NULL,
  `CenaUbezpieczenia` DECIMAL(10,2) NULL DEFAULT NULL,
  `CenaZaDzień` DECIMAL(10,2) NULL DEFAULT NULL,
  `KosztNaprawy` DECIMAL(10,2) NULL DEFAULT NULL,
  `CenaWypożyczenia` DECIMAL(10,2) NULL DEFAULT NULL,
  `CenaCałkowita` DECIMAL(10,2) NULL DEFAULT NULL,
  PRIMARY KEY (`idFaktury`),
  INDEX `NrWypożyczenia` (`NrWypożyczenia` ASC) VISIBLE,
  CONSTRAINT `faktury_ibfk_1`
    FOREIGN KEY (`NrWypożyczenia`)
    REFERENCES `wypożyczalnia`.`wypożyczenia` (`idWypożyczenia`))
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`naprawy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`naprawy` (
  `idNaprawa` INT NOT NULL AUTO_INCREMENT,
  `NrWypożyczenia` INT NOT NULL,
  `Koszt` DECIMAL(10,2) NOT NULL,
  `Opis` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`idNaprawa`),
  INDEX `NrWypożyczenia` (`NrWypożyczenia` ASC) VISIBLE,
  CONSTRAINT `naprawy_ibfk_1`
    FOREIGN KEY (`NrWypożyczenia`)
    REFERENCES `wypożyczalnia`.`wypożyczenia` (`idWypożyczenia`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`ocac`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`ocac` (
  `idOCAC` INT NOT NULL AUTO_INCREMENT,
  `Pakiet` VARCHAR(45) NOT NULL,
  `Cena` DECIMAL(10,2) NOT NULL,
  `PokrycieNaprawy` DECIMAL(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`idOCAC`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `wypożyczalnia`.`uzytkownicy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`uzytkownicy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `haslo` VARCHAR(255) NOT NULL,
  `rola` ENUM('klient', 'pracownik', 'admin') NOT NULL DEFAULT 'klient',
  `powiazane_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb3;

USE `wypożyczalnia` ;

-- -----------------------------------------------------
-- Placeholder table for view `wypożyczalnia`.`aktywne_wypozyczenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`aktywne_wypozyczenia` (`idWypożyczenia` INT, `Imie` INT, `Nazwisko` INT, `Marka` INT, `Model` INT, `Data_wypożyczenia` INT, `Status` INT);

-- -----------------------------------------------------
-- Placeholder table for view `wypożyczalnia`.`faktury_klient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`faktury_klient` (`idFaktury` INT, `NrWypożyczenia` INT, `Samochod` INT, `DataWypożyczenia` INT, `DataZwrotu` INT, `CzasWypożyczenia` INT, `Pakiet` INT, `CenaUbezpieczenia` INT, `CenaZaDzień` INT, `KosztNaprawy` INT, `CenaWypożyczenia` INT, `CenaCałkowita` INT, `idKlienta` INT);

-- -----------------------------------------------------
-- Placeholder table for view `wypożyczalnia`.`oczekujące_wypozyczenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`oczekujące_wypozyczenia` (`idWypożyczenia` INT, `Imie` INT, `Nazwisko` INT, `Marka` INT, `Model` INT, `Data_wypożyczenia` INT, `Status` INT);

-- -----------------------------------------------------
-- Placeholder table for view `wypożyczalnia`.`samochody_z_cenami`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`samochody_z_cenami` (`Nr_Rej` INT, `Marka` INT, `Model` INT, `Klasa` INT, `Rocznik` INT, `Kolor` INT, `Cena_per_Dzień` INT);

-- -----------------------------------------------------
-- Placeholder table for view `wypożyczalnia`.`widok_uzytkownicy_szczegoly`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`widok_uzytkownicy_szczegoly` (`id_uzytkownika` INT, `email` INT, `rola` INT, `powiazane_id` INT, `imie` INT, `nazwisko` INT, `telefon` INT, `adres` INT);

-- -----------------------------------------------------
-- Placeholder table for view `wypożyczalnia`.`widok_wypozyczenia_admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wypożyczalnia`.`widok_wypozyczenia_admin` (`idWypożyczenia` INT, `klient_imie` INT, `klient_nazwisko` INT, `Marka` INT, `Model` INT, `Nr_Rej` INT, `Data_wypożyczenia` INT, `Data_zwrotu` INT, `Status` INT, `pracownik_imie` INT, `pracownik_nazwisko` INT);

-- -----------------------------------------------------
-- procedure FakturaWystaw
-- -----------------------------------------------------

DELIMITER $$
USE `wypożyczalnia`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `FakturaWystaw`(IN wypo_id INT)
BEGIN
  INSERT INTO faktury (
    NrWypożyczenia, Klient, NrRejestracyjny, DataWypożyczenia, DataZwrotu, CzasWypożyczenia,
    Pakiet, CenaUbezpieczenia, CenaZaDzień, KosztNaprawy, CenaWypożyczenia, CenaCałkowita
  )
  SELECT
    w.idWypożyczenia,
    CONCAT(k.Imie, ' ', k.Nazwisko),
    w.NrRej,
    w.Data_wypożyczenia,
    w.Data_zwrotu,
    GREATEST(DATEDIFF(w.Data_zwrotu, w.Data_wypożyczenia), 1),
    o.Pakiet,
    o.Cena,
    c.Cena_per_Dzień,
    IFNULL(n.Koszt, 0) * (1 - o.PokrycieNaprawy),
    GREATEST(DATEDIFF(w.Data_zwrotu, w.Data_wypożyczenia), 1) * c.Cena_per_Dzień,
    GREATEST(DATEDIFF(w.Data_zwrotu, w.Data_wypożyczenia), 1) * c.Cena_per_Dzień + o.Cena + (IFNULL(n.Koszt, 0) * (1 - o.PokrycieNaprawy))
  FROM wypożyczenia w
  LEFT JOIN klienci k ON w.Klient = k.idKlient
  LEFT JOIN ocac o ON w.Pakiet_ubezpieczeń = o.idOCAC
  LEFT JOIN samochody s ON w.NrRej = s.Nr_Rej
  LEFT JOIN cennik c ON s.Rocznik = c.RocznikCennik
  LEFT JOIN naprawy n ON w.idWypożyczenia = n.NrWypożyczenia
  WHERE w.idWypożyczenia = wypo_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `wypożyczalnia`.`aktywne_wypozyczenia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wypożyczalnia`.`aktywne_wypozyczenia`;
USE `wypożyczalnia`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wypożyczalnia`.`aktywne_wypozyczenia` AS select `w`.`idWypożyczenia` AS `idWypożyczenia`,`k`.`Imie` AS `Imie`,`k`.`Nazwisko` AS `Nazwisko`,`s`.`Marka` AS `Marka`,`s`.`Model` AS `Model`,`w`.`Data_wypożyczenia` AS `Data_wypożyczenia`,`w`.`Status` AS `Status` from ((`wypożyczalnia`.`wypożyczenia` `w` join `wypożyczalnia`.`klienci` `k` on((`w`.`Klient` = `k`.`idKlient`))) join `wypożyczalnia`.`samochody` `s` on((`w`.`NrRej` = `s`.`Nr_Rej`))) where (`w`.`Status` in ('oczekujące','zatwierdzone'));

-- -----------------------------------------------------
-- View `wypożyczalnia`.`faktury_klient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wypożyczalnia`.`faktury_klient`;
USE `wypożyczalnia`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wypożyczalnia`.`faktury_klient` AS select `f`.`idFaktury` AS `idFaktury`,`f`.`NrWypożyczenia` AS `NrWypożyczenia`,concat(`s`.`Marka`,' ',`s`.`Model`) AS `Samochod`,`f`.`DataWypożyczenia` AS `DataWypożyczenia`,`f`.`DataZwrotu` AS `DataZwrotu`,`f`.`CzasWypożyczenia` AS `CzasWypożyczenia`,`f`.`Pakiet` AS `Pakiet`,`f`.`CenaUbezpieczenia` AS `CenaUbezpieczenia`,`f`.`CenaZaDzień` AS `CenaZaDzień`,`f`.`KosztNaprawy` AS `KosztNaprawy`,`f`.`CenaWypożyczenia` AS `CenaWypożyczenia`,`f`.`CenaCałkowita` AS `CenaCałkowita`,`w`.`Klient` AS `idKlienta` from ((`wypożyczalnia`.`faktury` `f` join `wypożyczalnia`.`wypożyczenia` `w` on((`f`.`NrWypożyczenia` = `w`.`idWypożyczenia`))) join `wypożyczalnia`.`samochody` `s` on((`w`.`NrRej` = `s`.`Nr_Rej`)));

-- -----------------------------------------------------
-- View `wypożyczalnia`.`oczekujące_wypozyczenia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wypożyczalnia`.`oczekujące_wypozyczenia`;
USE `wypożyczalnia`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wypożyczalnia`.`oczekujące_wypozyczenia` AS select `w`.`idWypożyczenia` AS `idWypożyczenia`,`k`.`Imie` AS `Imie`,`k`.`Nazwisko` AS `Nazwisko`,`s`.`Marka` AS `Marka`,`s`.`Model` AS `Model`,`w`.`Data_wypożyczenia` AS `Data_wypożyczenia`,`w`.`Status` AS `Status` from ((`wypożyczalnia`.`wypożyczenia` `w` join `wypożyczalnia`.`klienci` `k` on((`w`.`Klient` = `k`.`idKlient`))) join `wypożyczalnia`.`samochody` `s` on((`w`.`NrRej` = `s`.`Nr_Rej`))) where (`w`.`Status` = 'oczekujące');

-- -----------------------------------------------------
-- View `wypożyczalnia`.`samochody_z_cenami`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wypożyczalnia`.`samochody_z_cenami`;
USE `wypożyczalnia`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wypożyczalnia`.`samochody_z_cenami` AS select `s`.`Nr_Rej` AS `Nr_Rej`,`s`.`Marka` AS `Marka`,`s`.`Model` AS `Model`,`s`.`Klasa` AS `Klasa`,`s`.`Rocznik` AS `Rocznik`,`s`.`Kolor` AS `Kolor`,`c`.`Cena_per_Dzień` AS `Cena_per_Dzień` from (`wypożyczalnia`.`samochody` `s` join `wypożyczalnia`.`cennik` `c` on((`s`.`Rocznik` = `c`.`RocznikCennik`))) where (`s`.`Dostępność` = 1);

-- -----------------------------------------------------
-- View `wypożyczalnia`.`widok_uzytkownicy_szczegoly`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wypożyczalnia`.`widok_uzytkownicy_szczegoly`;
USE `wypożyczalnia`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wypożyczalnia`.`widok_uzytkownicy_szczegoly` AS select `u`.`id` AS `id_uzytkownika`,`u`.`email` AS `email`,`u`.`rola` AS `rola`,`u`.`powiazane_id` AS `powiazane_id`,(case when (`u`.`rola` = 'klient') then `k`.`Imie` when (`u`.`rola` = 'pracownik') then `p`.`Imie` else NULL end) AS `imie`,(case when (`u`.`rola` = 'klient') then `k`.`Nazwisko` when (`u`.`rola` = 'pracownik') then `p`.`Nazwisko` else NULL end) AS `nazwisko`,(case when (`u`.`rola` = 'klient') then `k`.`Telefon` when (`u`.`rola` = 'pracownik') then `p`.`Telefon` else NULL end) AS `telefon`,(case when (`u`.`rola` = 'klient') then `k`.`Adres` else NULL end) AS `adres` from ((`wypożyczalnia`.`uzytkownicy` `u` left join `wypożyczalnia`.`klienci` `k` on(((`u`.`rola` = 'klient') and (`u`.`powiazane_id` = `k`.`idKlient`)))) left join `wypożyczalnia`.`pracownicy` `p` on(((`u`.`rola` = 'pracownik') and (`u`.`powiazane_id` = `p`.`idPracownicy`))));

-- -----------------------------------------------------
-- View `wypożyczalnia`.`widok_wypozyczenia_admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wypożyczalnia`.`widok_wypozyczenia_admin`;
USE `wypożyczalnia`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wypożyczalnia`.`widok_wypozyczenia_admin` AS select `w`.`idWypożyczenia` AS `idWypożyczenia`,`k`.`Imie` AS `klient_imie`,`k`.`Nazwisko` AS `klient_nazwisko`,`s`.`Marka` AS `Marka`,`s`.`Model` AS `Model`,`s`.`Nr_Rej` AS `Nr_Rej`,`w`.`Data_wypożyczenia` AS `Data_wypożyczenia`,`w`.`Data_zwrotu` AS `Data_zwrotu`,`w`.`Status` AS `Status`,`p`.`Imie` AS `pracownik_imie`,`p`.`Nazwisko` AS `pracownik_nazwisko` from (((`wypożyczalnia`.`wypożyczenia` `w` join `wypożyczalnia`.`klienci` `k` on((`w`.`Klient` = `k`.`idKlient`))) join `wypożyczalnia`.`samochody` `s` on((`w`.`NrRej` = `s`.`Nr_Rej`))) left join `wypożyczalnia`.`pracownicy` `p` on((`w`.`Pracownik` = `p`.`idPracownicy`)));
USE `wypożyczalnia`;

DELIMITER $$
USE `wypożyczalnia`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `wypożyczalnia`.`blokuj_usuwanie_samochodu`
BEFORE DELETE ON `wypożyczalnia`.`samochody`
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1 FROM wypożyczenia WHERE NrRej = OLD.Nr_Rej
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Nie można usunąć samochodu powiązanego z wypożyczeniem';
  END IF;
END$$

USE `wypożyczalnia`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `wypożyczalnia`.`dodaj_rocznik_do_cennika`
BEFORE INSERT ON `wypożyczalnia`.`samochody`
FOR EACH ROW
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM cennik WHERE RocznikCennik = NEW.Rocznik
  ) THEN
    INSERT INTO cennik (RocznikCennik, Cena_per_Dzień)
    VALUES (NEW.Rocznik, 100.00);
  END IF;
END$$

USE `wypożyczalnia`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `wypożyczalnia`.`ODBLOKUJ_SAMOCHOD_PO_ZAKONCZENIU_LUB_ANULACJI`
AFTER UPDATE ON `wypożyczalnia`.`wypożyczenia`
FOR EACH ROW
BEGIN
    IF NEW.Status IN ('zakończone', 'anulowane') AND OLD.Status NOT IN ('zakończone', 'anulowane') THEN
        UPDATE samochody
        SET Dostępność = 1
        WHERE Nr_Rej = NEW.NrRej;
    END IF;
END$$

USE `wypożyczalnia`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `wypożyczalnia`.`ustaw_date_wypozyczenia`
BEFORE UPDATE ON `wypożyczalnia`.`wypożyczenia`
FOR EACH ROW
BEGIN
  IF NEW.Status = 'zatwierdzone'
     AND OLD.Status != 'zatwierdzone'
     AND NEW.Data_wypożyczenia IS NULL THEN
    SET NEW.Data_wypożyczenia = CURDATE();
  END IF;
END$$

USE `wypożyczalnia`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `wypożyczalnia`.`ustaw_date_zwrotu`
BEFORE UPDATE ON `wypożyczalnia`.`wypożyczenia`
FOR EACH ROW
BEGIN
  IF NEW.Status = 'zakończone' AND OLD.Status != 'zakończone' AND NEW.Data_zwrotu IS NULL THEN
    SET NEW.Data_zwrotu = CURDATE();
  END IF;
END$$

USE `wypożyczalnia`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `wypożyczalnia`.`ustaw_dostepnosc_po_zatwierdzeniu`
AFTER UPDATE ON `wypożyczalnia`.`wypożyczenia`
FOR EACH ROW
BEGIN
  IF NEW.Status = 'zatwierdzone' AND OLD.Status != 'zatwierdzone' THEN
    UPDATE samochody
    SET Dostępność = 0
    WHERE Nr_Rej = NEW.NrRej;
  END IF;
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
