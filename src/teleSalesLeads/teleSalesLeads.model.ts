import mongoose, { Schema } from 'mongoose';

const teleSalesLeadsSchema = new Schema(
    {
        TeleSalesLeadsID: Number,
        PhoneNumber: String,
        CustomerName: String,
        Operator: String,
        Remarks: String,
        CreatedDateTime: String,
        CallDateTime: String,
        UpdatedDateTime: String,
        CallRemarks: String,
        CallStatus: String,
        RegisteredUserName: String,
        ContactPurpose: String,
        FTD: String,
        ReminderDateTime: String,
        ProcessingTime: String,
        RegistrationDate: String,
    },
    { timestamps: true }
);

export const TeleSalesLeadsModel = mongoose.model('TeleSalesLead', teleSalesLeadsSchema);
