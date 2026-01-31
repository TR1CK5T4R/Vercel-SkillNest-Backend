import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const courseSchema = new Schema({
    videoFile: {
        type: String, //cloudinary url
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,//cloudinary url
        required: true,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    }
}, { timestamps: true })


courseSchema.plugin(mongooseAggregatePaginate)

export const Course = mongoose.model('Course', courseSchema)