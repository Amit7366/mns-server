import mongoose, { Schema } from 'mongoose';

const teleSalesLeadsHistorySchema = new Schema(
    {
        leadId: { type: Schema.Types.ObjectId, ref: 'TeleSalesLead', required: true }, // Reference to main lead
        operatorId: { type: String, required: true },
        actionType: { type: String, required: true }, // e.g. "CALL_UPDATE", "FOLLOW_UP"
        previousStatus: { type: String },
        newStatus: { type: String },
        remarks: { type: String },
        reminderDateTime: { type: String },
    },
    { timestamps: true }
);

export const TeleSalesLeadsHistoryModel = mongoose.model('TeleSalesLeadHistory', teleSalesLeadsHistorySchema);
