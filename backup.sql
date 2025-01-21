-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: mts_app_konkurs
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `mts_app_konkurs`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mts_app_konkurs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `mts_app_konkurs`;

--
-- Table structure for table `Odgovori`
--

DROP TABLE IF EXISTS `Odgovori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Odgovori` (
  `id_Odgovora` int NOT NULL AUTO_INCREMENT,
  `Odgovor` varchar(255) NOT NULL,
  `Tacno` tinyint(1) NOT NULL,
  `id_Pitanja` int DEFAULT NULL,
  PRIMARY KEY (`id_Odgovora`),
  KEY `id_Pitanja` (`id_Pitanja`),
  CONSTRAINT `Odgovori_ibfk_1` FOREIGN KEY (`id_Pitanja`) REFERENCES `Pitanja` (`id_pitanja`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Odgovori`
--

LOCK TABLES `Odgovori` WRITE;
/*!40000 ALTER TABLE `Odgovori` DISABLE KEYS */;
INSERT INTO `Odgovori` VALUES (1,'test',1,1),(2,'test',0,1),(3,'test',1,2),(4,'test',1,1),(5,'test',0,1),(6,'test',1,2);
/*!40000 ALTER TABLE `Odgovori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pitanja`
--

DROP TABLE IF EXISTS `Pitanja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pitanja` (
  `id_pitanja` int NOT NULL AUTO_INCREMENT,
  `pitanje` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_pitanja`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pitanja`
--

LOCK TABLES `Pitanja` WRITE;
/*!40000 ALTER TABLE `Pitanja` DISABLE KEYS */;
INSERT INTO `Pitanja` VALUES (1,'kad je poceo prvi svetski rat'),(2,'Kad je bilo sletanje na mesec');
/*!40000 ALTER TABLE `Pitanja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `odgovori`
--

DROP TABLE IF EXISTS `odgovori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `odgovori` (
  `id_odgovora` bigint NOT NULL AUTO_INCREMENT,
  `odgovor` varchar(255) NOT NULL,
  `tacno` bit(1) NOT NULL,
  `id_pitanja` bigint DEFAULT NULL,
  PRIMARY KEY (`id_odgovora`),
  KEY `FKhdgykqo7r2fw4shoqe75aq811` (`id_pitanja`),
  CONSTRAINT `FKhdgykqo7r2fw4shoqe75aq811` FOREIGN KEY (`id_pitanja`) REFERENCES `pitanja` (`id_pitanja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `odgovori`
--

LOCK TABLES `odgovori` WRITE;
/*!40000 ALTER TABLE `odgovori` DISABLE KEYS */;
/*!40000 ALTER TABLE `odgovori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pitanja`
--

DROP TABLE IF EXISTS `pitanja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pitanja` (
  `id_pitanja` bigint NOT NULL AUTO_INCREMENT,
  `pitanje` varchar(255) NOT NULL,
  `pitanja` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_pitanja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pitanja`
--

LOCK TABLES `pitanja` WRITE;
/*!40000 ALTER TABLE `pitanja` DISABLE KEYS */;
/*!40000 ALTER TABLE `pitanja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `grad` varchar(255) NOT NULL,
  `ime` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `prezime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'kostic.aleksandar006@gmail.com','Nis','Aleksandar','123456789','Kostic'),(3,'kostic.aleksandar006@gmail.com','Nis','Aleksandar','123456789','Kostic'),(4,'kostic.aleksandar006@gmail.com','Nis','Aleksandar','123456789','Kostic');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-21 13:50:47
