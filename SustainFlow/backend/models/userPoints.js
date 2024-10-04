import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema({
    availablePoints: [
        {
            agency: {
                type: String,
                required: true
            },
            points: {
                type: Number,
                default: 0
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

const Points = mongoose.model('Points', pointsSchema);

export default Points;
