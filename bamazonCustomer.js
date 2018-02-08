const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
const Table = require('cli-table');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});

var allTotal = 0;

connection.connect(function(err){
	if(err)throw err;
	
	runCustomerLogic();

});

function runCustomerLogic(){

	console.log(colors.green.bold("\n  ====   All Products ===="));
	let query_str = "SELECT * FROM products";
	connection.query(query_str, function(error, result){
		if (error) throw error;

		let table = new Table({
	    	head: ['id', 'name', 'department', 'price', 'quantity'],//, 'product_sales'], 
	    	colWidths: [6, 15, 20, 10, 10]//, 15]
		});
		for(let i=0; i<result.length; i++){
			table.push([
				result[i].item_id,
				result[i].product_name,
				result[i].department_name,
				result[i].price,
				result[i].stock_quantity//,
				// result[i].product_sales
			]);
		}
		console.log(table.toString()+"\n");
	  
		promptCustomer();

	});
}

function promptCustomer(){

	inquirer.prompt([
		{
			type : "input",
			message : "Product id you wish to purchase:",
			name : "id"
		},
		{
			type : "input",
			message : "Quantity:",
			name : "quantity" 
		}
	]).then(function(data){
		if(data.id && data.quantity){
			let id = data.id;
			let q = data.quantity;
			processRequest(id, q);
		}
		else {
			console.log("Ok, bye! Have a nice day!\n");
			connection.end();
		}
	});
}

function nextActionPrompt(){
	console.log('\n');
	inquirer.prompt([
	{
		type : "confirm",
		message : "Continue?",
		name: "continue"
	}
	]).then(function(data){
		if(data.continue){
			promptCustomer();
			return;
		}
		else{
			endTransaction();
		}
	});
}

function endTransaction(){

	connection.end();
	console.log('-----------------------------------------');
	console.log("Transaction complete.");
	console.log(colors.bold("\nTotal: $"+ allTotal)+"\n");
}

function processRequest(id, quantity){

	let query1 = "SELECT * FROM products WHERE item_id = ?";
	connection.query(query1, id, function(error, result){
		if(error) throw error;
		if(result.length === 0) {

		}
		if(result){
			if(result.length === 0 || result[0].stock_quantity < quantity){
				if(result.length === 0 ){
					console.log(colors.red.bold("Product doesn't exist!"));
				}
				else if(result[0].stock_quantity < quantity){
					console.log(colors.red.bold("Insufficient quantity!"));
				}
				nextActionPrompt();
			}
			else {
				let name = colors.green.bold(result[0].product_name);
				let total = result[0].price * quantity;
				let sales = result[0].product_sales + total;

				console.log("Thank you!");

				allTotal+=total;
				
				console.log("You purchased "+name+" ("+quantity+"). Total: "+colors.bold('$'+total.toFixed(2)));

				let new_quantity = result[0].stock_quantity - quantity;
				let query2 = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?";
				connection.query(query2, [new_quantity, sales, result[0].item_id], function(error2, result2){
					if(error2){
						connection.end();
						throw error2;
					}
					else{
						nextActionPrompt();
					}
				});
			}
		}
	});

}