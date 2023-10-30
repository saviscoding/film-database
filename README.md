# Overview

This program is a simple web service that allows users to search for and retrieve information about films. The program includes a RESTful API that can be used to access the film data, as well as a web application that allows users to search for films and view the results in a web browser.

---------------

## Installation

In order to run this program, you will need to have the following software installed on your computer:

	1. Eclipse: You can download the latest version of Eclipse from the Eclipse website.
	2. Java: This program was built using JavaSE17, you can download the latest version of Java from the Oracle website.
	3. Tomcat: The application runs on a server (instructions below.)

Once you have Eclipse and Java installed, you can import the project to your Eclipse IDE. To do this, in Eclipse, go to File > Import > Existing Project, then browse to the location where you have cloned this repo and select the project .zip file.

## Tomcat
To run the program, you can use the Eclipse IDE. First, make sure to have a Tomcat server running. To do this

	1. Download and unzip Tomcat 9.0 onto your hard disk. 
	2. Look for the ZIP version https://tomcat.apache.org/download-90.cgi
	3. Start Eclipse, and locate the Servers Tab in the bottom window. If no Servers tab is there, add it by selecting Window —> Show View —> Other —> Server —> Servers
	4. In the empty Servers window, either select “.. create a new server” or right-click and New —>Server 
	5. Select the Apache Tomcat 9.0 Server 
	6. Click Next, and in the follow up screen, browse to the root folder of your Tomcat (extracted in step 1) 
	7. You should then see the server in your Servers tab


## Running the Program
You can run the program using Eclipse by navigating to the index.html file, right-click and select Run -> Run On Server.


## Using RESTful API
The RESTful API for this program is available at the following endpoint: http://localhost:8080/a-film-database/film-api

You can use this API to retrieve, edit and delete information about films by sending GET, POST, PUT and DELETE requests to the endpoint using a program like Postman.


## Using the Web Application
The web application for this program is available at the following endpoint: http://localhost:8080/a-film-database/index.html

You can use this web application to search for films and view the results in a web browser. Simply enter a search term in the search bar and click the "Search Films" button. The search results will be displayed in a table below the search bar. You can also add, update and delete films using the browser.

## Code Structure
This program is organised into the following package structure:

	- src/main/java/controllers: this contains the FilmAPI.java code.
	- src/main/java/database: this contains the FilmDAO.java code.
	- src/main/java/models: this contains the Film.java code.
	- src/main/webapp/scripts: contains the scripts.js file with the JavaScript code used by the web page.
	- src/main/webapp/index.html: the web page to run.









