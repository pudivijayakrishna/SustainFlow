import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
    reward: [
        {
            name: {
                type: String,
                required: true
            },
            point: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
