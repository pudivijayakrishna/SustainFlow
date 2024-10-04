import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    reward: {
        name: {
            type: String,
            required: true,
        },
        point: {
            type: Number,
            required: true,
        },
    },
}, {
    timestamps: true,
});

const History = mongoose.model("History", historySchema);

export default History;
