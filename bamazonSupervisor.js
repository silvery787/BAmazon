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
	showSupMenu();

});

function showSupMenu(){

	inquirer.prompt([
		{
			type    : 'list',
			message : 'Choose action, please:',
			choices  : ['View Product Sales by Department', 'Create New Department'],
			name    : 'action',
			default : 'View Product Sales by Department'
		},
	]).then(function(user){
		if(user && user.action){
			switch(user.action){
				case 'View Product Sales by Department' :
					viewProductsByDepartment();
					break;
				case 'Create New Department':
					addDepartment();
					break;
			}
		}
		else closeApp();
	});

}

function viewProductsByDepartment(){
	console.log(colors.green.bold('\n ===  Product Sales by Department  ===')+'\n');
	let query = "SELECT d.id, d.name, d.over_head_costs, SUM(p.product_sales) as sales, "+
 			"SUM(p.product_sales)-d.over_head_costs as profit FROM departments d "+
 			"LEFT JOIN products p ON d.name = p.department_name GROUP BY d.id";
 	connection.query(query, function(error, result){
 		if (error) throw error;

		let table = new Table({
	    	head: ['dep. id', 'dep. name', 'overhead costs', 'product sales', 'total profit'], 
	    	colWidths: [12, 20, 20, 15, 15]
		});
		for(let i=0; i<result.length; i++){
			table.push([
				result[i].id,
				result[i].name,
				result[i].over_head_costs,
				result[i].sales || 0,
				result[i].profit || (-result[i].over_head_costs)
			]);
		}
		console.log(table.toString()+"\n");

		nextActionPrompt();

 	});

}

function addDepartment(){
	console.log(colors.green.bold("\n ====   Adding New Department ===="));

	inquirer.prompt([
		{
			type    : 'input',
			message : 'Department name:',
			name 	: 'name'
		},
		{
			type    : 'input',
			message : 'Overhead costs:',
			name 	: 'costs'
		},
		{
			type	: 'confirm',
			message : 'Are you sure?',
			name 	: 'confirm'
		}
	]).then(function(add_dep){
		if( add_dep.confirm ){

			let query = "INSERT INTO departments (name, over_head_costs)"+
						"VALUES (?,?)";
			connection.query(query, [add_dep.name, add_dep.costs], function(error, res){
				
				if(error) throw error;

				console.log("Rows added: "+res.affectedRows+'\n');
				nextActionPrompt();
				
			});
		}
		else{
			nextActionPrompt();
		}
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
			showSupMenu();
			return;
		}
		else{
			closeApp();
		}
	});

}

function closeApp(){

	console.log('Bye! Have a nice day!\n');
	connection.end();
}
