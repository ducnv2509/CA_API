import express from "express";

const app = express();

const PORT = 5000;

// include body parser for body parameters
app.use(express.json());


// load mysql package
import { createConnection } from "mysql";


// create mysql connection
const connection = createConnection({
    host: "localhost",
    user: "sqluser",
    password: "123456",
    database: "db_ca"
});

// check connection
connection.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("We are now successfully connected with mysql database");
    }
});


// calling stored procedure
app.get("/user-detail/", function (request, response) {

    connection.query("CALL getCustomer()", function (error, result, fields) {

        if (error) {
            throw error;
        } else {
            response.json(result[0]);
        }
    });
});



app.get("/", function (request, response) {

    response.send("Welcome to Initial stage of MySQL");
});

app.listen(PORT, function () {

    console.log("Server is running at 5000 port");
});
