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
	showMenu();
});

const LOWQ = 5;

function showMenu(){
	inquirer.prompt([
		{
			type    : 'list',
			message : 'Choose action, please:',
			choices  : ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			name    : 'action',
			default : 'View Products for Sale'
		},
	]).then(function(user){
		if(user && user.action){
			switch(user.action){
				case 'View Products for Sale' :
					viewAll();
					break;
				case 'View Low Inventory':
					viewLow(LOWQ);
					break;
				case 'Add to Inventory':
					addQuantity();
					break;
				case 'Add New Product':
					addProduct();
					break;
			}
		}
		else closeApp();
	});
}

function nextActionPrompt(){

	inquirer.prompt([
		{
			type : "confirm",
			message : "Show Main Menu?",
			name : "menu"
		}
	]).then(function(user){
		if(user.menu){
			showMenu();
			return;
		}
		else{
			closeApp();
		}
	});

}

function viewAll(){

	console.log(colors.green.bold("\n  ====   All Products ===="));
	let query_str = "SELECT * FROM products;";
	connection.query(query_str, function(error, result){
		if (error) throw error;

		let table = new Table({
	    	head: ['id', 'name', 'department', 'price', 'quantity'], 
	    	colWidths: [6, 15, 20, 10, 10]
		});
		for(let i=0; i<result.length; i++){
			table.push([
				result[i].item_id,
				result[i].product_name,
				result[i].department_name,
				result[i].price,
				result[i].stock_quantity
			]);
		}
		console.log(table.toString()+"\n");

		nextActionPrompt();

	});

}

function viewLow(low_num){

	console.log(colors.green.bold("\n  ====   Low Inventory ===="));
	let query = "SELECT * FROM products WHERE stock_quantity < ?";
	connection.query(query, low_num, function(error, result){
		if (error) throw error;

		let table = new Table({
	    	head: ['id', 'name', 'department', 'price', 'quantity'], 
	    	colWidths: [6, 15, 20, 10, 10]
		});
		for(let i=0; i<result.length; i++){
			table.push([
				result[i].item_id,
				result[i].product_name,
				result[i].department_name,
				result[i].price,
				result[i].stock_quantity
			]);
		}
		console.log(table.toString()+"\n");

		nextActionPrompt();

	});

}

function addQuantity(){
	
	console.log(colors.green.bold("\n  ====   Adding Product to Inventory ===="));
	
	inquirer.prompt([
		{
			type    : 'input',
			message : 'Enter id of the item you wish to add to stock:',
			name 	: 'product_id'
		},
		{
			type	: 'input',
			message	: 'Quantity to add:',
			name 	: 'quantity'
		}
	]).then(function(mngr){
		if(mngr.quantity < 0){
			console.log(colors.red.bold("You can't add negative quantity\n"));
			nextActionPrompt();
			return;
		}
		else if(! parseInt(mngr.quantity)){
			console.log(colors.red.bold("Undefined quantity\n"));
			nextActionPrompt();
			return;
		}
		else{
			let query1 = "SELECT stock_quantity FROM products WHERE item_id = ?";
			connection.query(query1, mngr.product_id, function(err1, res1){
				
				if(err1) throw err1;
				
				if(!res1 || res1.length !== 1){
					console.log(colors.red.bold("Product doesn't exist!\n"));
					nextActionPrompt();
				}
				else{

					let new_quantity = parseInt(mngr.quantity) + parseInt(res1[0].stock_quantity);
					let query2 = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
					connection.query(query2, [new_quantity, mngr.product_id], function(err2, res2){
						if(err2){
							connection.end();
							throw err2;
						}
						else{
							// if(no such product or negatine number)
							console.log("Rows updated: "+res2.affectedRows);
							console.log("Items added to stock: "+colors.red.bold(mngr.quantity)+'\n');
							console.log("Total in stock: "+colors.red.bold(new_quantity)+'\n');
							nextActionPrompt();
						}

					});
				}
			});
		}
	});

}

function addProduct(){

	console.log(colors.green.bold("\n  ====   Adding New Product to Inventory ===="));

	let dep_query = "SELECT name FROM departments";
	connection.query(dep_query, function(err, res){
		if(err){
			connection.end();
			throw err;
		}

		let dep_list =[];
		for(let i=0; i<res.length; i++){
			dep_list.push(res[i].name);
		}
		if(dep_list.length === 0) dep_list = ['electronics', 'clothing', 'beauty_and_health', 'sport'];
		inquirer.prompt([
			{
				type    : 'input',
				message : 'Product name:',
				name 	: 'name'
			},
			{
				type    : 'list',
				message : 'Department:',
				choices : dep_list,
				name 	: 'department'
			},
			{
				type    : 'input',
				message : 'Price:',
				name 	: 'price'
			},
			{
				type	: 'input',
				message	: 'Quantity:',
				name 	: 'quantity'
			},
			{
				type	: 'confirm',
				message : 'Are you sure?',
				name 	: 'confirm'
			}
		]).then(function(p){
			if( p.confirm ){
				if(!parseFloat(p.price)){
					console.log(colors.red.bold("Incorrect type for Price!"));
					nextActionPrompt();
				}
				else if(!parseInt(p.quantity)){
					console.log(colors.red.bold("Incorrect type for Quantity!"));
					nextActionPrompt();
				}
				else{
					let query = "INSERT INTO products (product_name, department_name, price, stock_quantity)"+
								"VALUES (?,?,?,?)";
					connection.query(query, [p.name, p.department, p.price, p.quantity], function(error, result){
						
						if(error) throw error;

						console.log("Rows added: "+result.affectedRows+'\n');
						nextActionPrompt();
						
					});
				}

			}
			else{
				nextActionPrompt();
			}
		});
	});
}

function closeApp(){

	console.log('Bye! Have a nice day!\n');
	connection.end();
}




