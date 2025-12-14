import mongoose from 'mongoose';

export async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on('connected',()=> {
            console.log("mongoDB connected...")
        })

        connection.on('error',(err) => {
            console.log("mongoDB error, make sure it runs", + err.message)
            // process.exit()
        })
        
    } catch(error){
        console.log("something went wront", error)
    }
}