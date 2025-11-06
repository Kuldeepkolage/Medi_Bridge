import mongoose from "mongoose";

const zealSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    eventDate:{
        type:String,
        required:true
    },
    eventTime:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }
});

export const Zeal = mongoose.model("Zeal", zealSchema);
