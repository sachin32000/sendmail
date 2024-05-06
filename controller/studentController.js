//GetAll Students
const db = require('../config/db')
const getStudents = async (req,res)=>{
    try {
        console.log("DFdsfd=======>");
        const data = await db.query('SELECT * FROM send_email')
        if(!data){
            return res.status(404).send({
                success:false,
                message:'No Records Found'
            })
        }
        res.status(200).send({
            success:true,
            message:'No Records found',
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get All Student API',
            error
        })
    }
}

module.exports = {
    getStudents
}