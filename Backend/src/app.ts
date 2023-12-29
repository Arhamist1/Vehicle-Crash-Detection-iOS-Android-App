var express = require('express');
import routes from "./routes/index";

var app = express();

app.use(express.json({limit: '300MB'}));
app.use(express.urlencoded({limit: '300MB'}));
app.use("/", routes);

var server = app.listen(8080, function () {
   var port = server.address().port
   
   console.log("Example app listening at http://localhost:%s", port)
})
