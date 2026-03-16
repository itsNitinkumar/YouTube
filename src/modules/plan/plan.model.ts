import mongoose,{Schema,Document} from "mongoose"
export interface IPlan extends Document{
    name : string
    price : number
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
unique: true },
price: {
    type: Number,
    required: true
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