# JavaScript Order Management App

## Introduction

Welcome to the JavaScript Order Management App! This application is designed to assist in managing customer orders efficiently. It provides a user-friendly interface to view customer details, their orders, and individual items within each order.

## Features

1. **Customer List:**
   - Upon launching the app, you will be presented with a list of customers.
   - Clicking on a customer's name will trigger the retrieval and display of their orders.

2. **Order Details:**
   - Once a customer is selected, the app fetches and displays a list of orders associated with that customer.
   - Each order contains multiple items, providing a comprehensive overview of the customer's transactions.

3. **Item Details:**
   - Clicking on a specific order reveals individual items within that order.
   - Detailed information about each item, such as product name, quantity, and price, is displayed.

## Getting Started

To run the JavaScript Order Management App on your local machine, follow these steps:

## Clone the Repository
Start by cloning the repository using the following command:

git clone repository-url

## Open the project in Visual Studio Code:
Navigate to the project directory and open it in Visual Studio Code with the following commands:

cd project-directory
code .


## Project Overview

SampleApp is thoughtfully organized to streamline the management of customers, orders, and line items. Key functionalities include:
Customer Table: Displays a well-organized table of customers on the main page.
Order List: Dynamically loads and presents a detailed list of orders upon selecting a customer.
Line Item Editing: Enables users to seamlessly view and edit line items within an order, providing the flexibility to adjust quantities as needed.

## Running the Application

### Using an HTTP Server:

Start by installing a simple HTTP server,Node.js's http-server module.
Navigate to the project directory in the command line.
Launch the server with the appropriate command (e.g.,  http-server ).
Open a web browser and go to the provided URL (usually http://localhost:8000).

### Double-clicking the index.html File:

Navigate to the project directory using a file explorer.
Locate the index.html file in the project directory.
Double-click on the index.html file, and it will open in the default web browser.
This method is straightforward but may not support certain features that require a server environment.

### Using a Live Server Extension:

If you are using a code editor like Visual Studio Code, you can install a Live Server extension.
Open the project in Visual Studio Code.
Right-click on the index.html file and select the "Open with Live Server" option.
The extension will launch a local server and automatically open the application in your default web browser.
This method provides a more dynamic development environment with live reloading.

## Additional Features

Simple and Intuitive Design: SampleApp is intentionally kept simple, emphasizing core JavaScript and HTML concepts while ensuring an intuitive user experience.

## Exploration

Feel free to delve into the codebase to gain a deeper understanding of the Order Management Application's implementation.



## If you want to run your JavaScript application on localhost:4200

1.Run the following command to install Express.js as a dependency:
npm install express

2.Create a new JavaScript file (e.g., server.js) in your project directory.

3.Open server.js in your text editor and add the following code

const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

4.Create a Public Directory:
Create a new directory named public in your project directory. This is where you'll put your HTML, CSS, and JavaScript files.

5.Move Your Files:

Move your JavaScript application files (including HTML, CSS, and JavaScript files) to the public directory.

6.Start the Server:
Open a terminal or command prompt, navigate to your project directory, and run the following command to start the server:

node server.js


## Conclusion

SampleApp serves not only as a practical Order Management Application but also as a robust template for UI documentation.
It establishes a solid foundation for building similar applications. For further assistance or customization, refer to the
comprehensive source code and documentation provided within the project.
