const express = require('express');
const app = express();
app.use(express.static('../dist'));
app.use('/assets', express.static('../dist/assets'));

<<<<<<< HEAD
app.listen(80,()=>{
=======
app.listen(4001,()=>{
>>>>>>> 585903ed12069aeac0d0d0bb2518f8f6db6fab56
    console.log('server is running!')
})
