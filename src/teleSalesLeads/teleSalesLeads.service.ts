import { Admin } from "../app/Admin/admin.model";
import { TeleSalesLeadsModel } from "./teleSalesLeads.model";
import { TeleSalesLeadsHistoryModel } from "./teleSalesLeadsHistory.model";

export const TeleSalesLeadsService = {
  // ✅ Fetch ALL leads filtered by CallStatus = "New"
  async getLeads() {
    const leads = await TeleSalesLeadsModel.find({ CallStatus: "New" })
      .sort({ createdAt: -1 });

    const total = leads.length;
    return { leads, total };
  },

  // ✅ Update Lead Call + Log History with Admin username
  async updateLeadCall(
    id: string,
    callStatus: string,
    remarks: string,
    operatorId: string
  ) {
    const existing = await TeleSalesLeadsModel.findById(id);
    if (!existing) return null;

    // 🔹 Get Admin username (fallback to operatorId if not found)
    const admin = await Admin.findOne({ id: operatorId });
    const operatorName = admin ? admin.userName : operatorId;

    const updatedLead = await TeleSalesLeadsModel.findByIdAndUpdate(
      id,
      {
        Operator: operatorName,
        CallStatus: callStatus,
        CallRemarks: remarks || "",
        CallDateTime: new Date().toISOString(),
        UpdatedDateTime: new Date().toISOString(),
      },
      { new: true }
    );

    // ✅ Log call update in history
    await TeleSalesLeadsHistoryModel.create({
      leadId: id,
      operatorId,
      actionType: "CALL_UPDATE",
      previousStatus: existing.CallStatus,
      newStatus: callStatus,
      remarks,
    });

    return updatedLead;
  },

  // ✅ Fetch all leads assigned to a specific admin (My Customers)
  // ✅ Fetch all leads assigned to a specific admin (my customers)
  async getMyCustomers(operatorId: string) {
    const admin = await Admin.findOne({ id: operatorId });
    if (!admin) return { leads: [], total: 0 };

    const operatorValue = admin.userName; // matches Operator field
    const leads = await TeleSalesLeadsModel.find({ Operator: operatorValue })
      .sort({ createdAt: -1 });

    const total = leads.length;
    return { leads, total };
  },


  // ✅ Fetch all leads with CallStatus = "Follow Up"
  async getFollowUpLeads() {
    const followUps = await TeleSalesLeadsHistoryModel.aggregate([
      { $match: { newStatus: "Follow Up" } },
      {
        $lookup: {
          from: "telesalesleads",
          localField: "leadId",
          foreignField: "_id",
          as: "leadDetails",
        },
      },
      { $unwind: "$leadDetails" },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          actionType: 1,
          previousStatus: 1,
          newStatus: 1,
          remarks: 1,
          reminderDateTime: 1,
          createdAt: 1,
          operatorId: 1,
          "leadDetails._id": 1,
          "leadDetails.CustomerName": 1,
          "leadDetails.PhoneNumber": 1,
          "leadDetails.Operator": 1,
          "leadDetails.CallRemarks": 1,
          "leadDetails.CallStatus": 1,
          "leadDetails.ReminderDateTime": 1,
        },
      },
    ]);

    return followUps;
  },

  // ✅ Fetch all call history except where newStatus = "New"
 // ✅ Fetch all call history except where newStatus = "New"
async getAllHistory() {
  const history = await TeleSalesLeadsHistoryModel.aggregate([
    { $match: { newStatus: { $ne: "New" } } },
    {
      $lookup: {
        from: "admins", // 👈 your Admin collection name
        localField: "operatorId", // field in history
        foreignField: "id", // field in Admin collection that stores A-0012
        as: "operatorDetails",
      },
    },
    { $unwind: { path: "$operatorDetails", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        leadId: 1,
        actionType: 1,
        previousStatus: 1,
        newStatus: 1,
        remarks: 1,
        reminderDateTime: 1,
        createdAt: 1,
        updatedAt: 1,
        // 👇 only populate the username from Admin
        operatorId: "$operatorDetails.userName",
      },
    },
  ]);

  return history;
},

};
