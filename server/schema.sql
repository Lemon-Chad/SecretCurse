CREATE DATABASE secret_curses;
USE secret_curses;

CREATE TABLE accounts (
    id integer PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
