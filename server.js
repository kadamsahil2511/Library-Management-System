const express = require('express');
const app= express();
const bookRouter = require('./src/routes/bookRouter');
const issueBookRouter = require('./src/routes/issueBookRouter');

require('dotenv').config();

const requestLogger = (request, response, next) => {
    console.log(`${request.method} ${request.path} ${new Date().toISOString()}`);
    next();
}

app.get("/",(request,response)=>{
    response.json("Hello Internet! \nWelcome to the Library Management API.");
});

app.use(requestLogger);
app.use('/books', bookRouter);
app.use("/issueBooks",issueBookRouter);

app.get("/health",(request,response)=>{
    response.status(200).json({
        status: "OK",
        message : "Server is running successfully"
    });
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});