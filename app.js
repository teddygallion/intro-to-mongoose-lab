/*-------------- Imports --------------*/
const prompt = require("prompt-sync")({ sigint:true });
const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config();

const Customer = require("./models/customer.js");



/*---------- Query Functions -----------*/

const createCustomer = async () => {
    console.clear();
    console.log("1. Create a new customer.");

    let name;
    while (true) {
        name = prompt("Please enter the new customer's name: ").trim();
        if (name.length === 0) {
            console.log("Invalid input. Name cannot be empty.");
        } else {
            break;
        }
    }

    let age;
    while (true) {
        age = parseInt(prompt(`Please enter ${name}'s age: `).trim(), 10);
        if (isNaN(age)) {
            console.log("Invalid input. Please enter a valid number for age.");
        } else if (age <= 0 || age > 150) {
            console.log("Invalid age. Please enter a realistic age (1-150).");
        } else {
            break;
        }
    }

    const customerData = { name, age };
    const customer = await Customer.create(customerData);
    console.log("New customer created: ", customer);
};


const viewAllCustomers = async () => {
	console.clear();
	console.log("2. View all customers. ")
	const customers = await Customer.find({});
	console.log("All Customers: ", customers);
}

const updateCustomer = async () => {
	console.clear();
	console.log("3. Update a Customer. ")
    console.log("Please enter the customer ID: ");
    const customerId = prompt();
    console.log(`
    Please enter the value you wish to update: 
    1. Name
    2. Age
    `);
    
    const valueToUpdate = prompt().trim().toLowerCase();
    console.log("Please enter the new value: ");
    let newUserData = prompt().trim();

    let updateField = {};
    
    if (parseInt(valueToUpdate, 10) === 1 || valueToUpdate === "name") {
        updateField.name = newUserData;
    } else if (parseInt(valueToUpdate, 10) === 2 || valueToUpdate === "age") {
        updateField.age = parseInt(newUserData, 10);
        if (isNaN(updateField.age)) {
            console.log("Invalid age. Please enter a valid number.");
            return;
        }
    } else {
        console.log("Invalid input.");
        return;
    }

    const customerToUpdate = await Customer.findByIdAndUpdate(
        customerId,
        updateField,
        { new: true }
    );

    if (!customerToUpdate) {
        console.log("No customer found with the provided ID.");
    } else {
        console.log("Updated Customer: ", customerToUpdate);
    }
    console.clear();
};
const deleteCustomer = async () =>{
	console.clear();
	console.log("4. Delete a customer. ")
	console.log("please enter the ID of the record you wish to delete")
	const id = prompt();
	const removedCustomer = await Customer.findByIdAndDelete(id);
	console.log(`customer ${id} removed from database. ${removedCustomer}`);

}
const handleQuit = async () =>{
	await mongoose.disconnect();
	console.log('Disconnected from MongoDB');

	  // Close our app, bringing us back to the command line.
	process.exit();
}

/*-------- MongoDB Connection --------*/
const connect = async () => {

  // Connect to MongoDB using the MONGODB_URI specified in our .env file.
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Welcome to the CRM.");
  // Call the runQueries function, which will eventually hold functions to work
  
  await runQueries();

  // Disconnect our app from MongoDB after our queries run.

};

const runQueries = async () => {
  console.log('Queries running.')
  // with data in our db.

  while (true) {
  	  displayMenu();
        let action = parseInt(prompt("Number of action to run: "), 10);

        switch (action) {
            case 1:
                await createCustomer();
                break;
            case 2:
                await viewAllCustomers();
                break;
            case 3:
                await updateCustomer();
                break;
            case 4:
                await deleteCustomer();
                break;
            case 5:
                console.log("Goodbye.");
                await handleQuit();
                return;
            default:
                console.log("Invalid input. Please enter a number between 1 and 5.");
        }
  }
  // The functions calls to run queries in our db will go here as we write them.
};



function displayMenu(){
	console.log(`
	What would you like to do?

	1. Create a customer
	2. View all customers
	3. Update a customer
	4. Delete a customer
	5. Quit
	`);
}

connect();




