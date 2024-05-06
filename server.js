const express = require('express')
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const pool = require('./config/db'); // Import the connection pool
const studentRouter = require('./routes/studentRouter')


//config dotenv
dotenv.config();

//rest object
const app = express();

//middlewares
app.use(express.json);
app.use(morgan('dev'));
  
//routes
app.get('/get',(req,res)=>{
    res.send('<h1>Hello</h1>')
    console.log("Hello ====>");
})
// app.get('/getAll',async (req,res)=>{
//     try {
//         console.log("DFdsfd=======>");
//         const data = await db.query('SELECT * FROM send_email')
//         if(!data){
//             return res.status(404).send({
//                 success:false,
//                 message:'No Records Found'
//             })
//         }
//         res.status(200).send({
//             success:true,
//             message:'No Records found',
//             data
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success:false,
//             message:'Error in Get All Student API',
//             error
//         })
//     }
// })
// app.use(studentRouter);
//conditionally Listen
// pool.query('SELECT 1').then(()=>{
//     console.log("MySQL DB Connected".bgCyan.white);
app.listen(process.env.PORT, ()=>{
    console.log(`Server is Listening on: ${process.env.PORT}`.bgMagenta.white);
})
// }).catch((error)=>{
//     console.log(error);
// })

// async function connectAndQuery() {
//     try {
//       const connection = await pool.getConnection(); // Get a connection
  
//       const [rows, fields] = await connection.query('SELECT * FROM send_email'); // Execute a query
//       console.log('Query results:', rows);
  
//       connection.release(); // Release the connection back to the pool
//     } catch (error) {
//       console.error('Error connecting or querying:', error);
//     }
//   }
  
//   connectAndQuery();
