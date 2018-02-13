# BAmazon

### Amazon-like storefront node.js application using the MySQL database.###

__bamazonCustomer.js__ - allows to take in orders from customers and depletes stock from the store's inventory.
			Also, when a customer purchases anything from the store, 
			the price of the product multiplied by the quantity purchased is added to the product's
			**product_sales column** of **products** table.

__bamazonManager.js__ - Manager View allows to perform a set of actions from menu:

* View Products for Sale
* View Low Inventory (all items with an inventory count lower than five)
* Add to Inventory
* Add New Product

__bamazonSupervisor.js__ - Supervisor View allows user to:

* Product Sales by Department
* Create New Department

installation		: npm install<br>
db object collecion 	: schema.sql<br>
db sample data 		: seeds.sql<br>

[Screencast video](https://youtu.be/FVZrgncbpMo)
