import mongoose from "mongoose";
const CampaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
    },
    desc: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
})


export default mongoose.model("Campaign", CampaignSchema)