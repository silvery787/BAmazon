DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
use bamazon;

-- DROP TABLE IF EXISTS products;
CREATE TABLE products (
	item_id INT NOT NULL UNIQUE AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(8,2) NOT NULL,
	stock_quantity INT NOT NULL,
	product_sales DECIMAL(16,2) DEFAULT 0,
	PRIMARY KEY(item_id)
);

-- DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	over_head_costs DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(id)
);