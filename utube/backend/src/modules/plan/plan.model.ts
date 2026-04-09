import mongoose,{Schema,Document} from "mongoose"

export interface IPlan extends Document{
    name : string
    price : number
    duration: number // in days
    features: {
        uploadLimit: number
        analyticsAccess: boolean
        adFree : boolean
        aiTools: boolean
    }
}

const planSchema = new Schema<IPlan>({
    name: {
        type: String,
        required: true,
        unique: true 
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 30 // 30 days default
    },
    features: {
        uploadLimit: Number,
        analyticsAccess: Boolean,
        adFree: Boolean,
        aiTools: Boolean
    }
},{
    timestamps: true
})

export const Plan = mongoose.model<IPlan>("Plan",planSchema)