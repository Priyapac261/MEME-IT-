const path = require('path');
const express = require('express');
const app = express();

// giving absolute path
const staticPath = path.join(__dirname,"../public");
// console.log(staticPath);
// express.static is a builtin middleware
app.use(express.static(staticPath));

app.get('/',(req,res)=>{
   res.send();
});

app.listen(8000,()=>{
  console.log("Listening....");
})