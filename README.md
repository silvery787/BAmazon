# BAmazon

Amazon-like storefront node,js applicetion using the MySQL database.

bamazonCustomer.js - allows to take in orders from customers and depletes stock from the store's inventory.
					Also, when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's *product_sales column* of **products** table.

bamazonManager.js - Manager View allows to perform a set of actions from menu:
					* View Products for Sale
					* View Low Inventory (all items with an inventory count lower than five)
					* Add to Inventory
					* Add New Product

bamazonSupervisor.js - Supervisor View allows user to:
					* Product Sales by Department
					* Create New Department

installation		: npm install
db object collecion : schema.sql
db sample data 		: seeds.sql

[Screencast video](https://youtu.be/FVZrgncbpMo)