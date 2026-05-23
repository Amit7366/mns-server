import { Request, Response } from "express";
import { TeleSalesLeadsService } from "./teleSalesLeads.service";
import sendResponse from "../app/utilis/sendResponse";

export const TeleSalesLeadsController = {
  // ✅ Fetch ALL "New" leads
  async getLeads(req: Request, res: Response) {
    try {
      const result = await TeleSalesLeadsService.getLeads();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "TeleSales leads fetched successfully",
        data: {
          leads: result.leads,
          total: result.total,
        },
      });
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Server error while fetching leads",
        data: null,
      });
    }
  },

  // ✅ Update Lead Call Info
  async updateLeadCall(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { callStatus, remarks, operatorId } = req.body;

      if (!callStatus || !operatorId) {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "callStatus and operatorId are required",
          data: null,
        });
      }

      const updatedLead = await TeleSalesLeadsService.updateLeadCall(
        id,
        callStatus,
        remarks,
        operatorId
      );

      if (!updatedLead) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Lead not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Lead updated successfully",
        data: updatedLead,
      });
    } catch (error: any) {
      console.error("Error updating lead:", error);
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Server error while updating lead",
        data: null,
      });
    }
  },

  // ✅ Fetch My Customers (no pagination)
   async getMyCustomers(req: Request, res: Response) {
    try {
      const operatorId = req.query.operatorId as string;

      if (!operatorId) {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "operatorId is required",
          data: null,
        });
      }

      const result = await TeleSalesLeadsService.getMyCustomers(operatorId);
      

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My customers fetched successfully",
        data: {
          leads: result.leads,
          total: result.total,
        },
      });
    } catch (error: any) {
      console.error("Error fetching my customers:");
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Server error while fetching my customers",
        data: null,
      });
    }
  },


  // ✅ Fetch Follow-Up Leads
  async getFollowUpLeads(req: Request, res: Response) {
    try {
      const leads = await TeleSalesLeadsService.getFollowUpLeads();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Follow-up leads fetched successfully",
        data: leads,
      });
    } catch (error: any) {
      console.error("Error fetching follow-up leads:", error);
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Server error while fetching follow-up leads",
        data: null,
      });
    }
  },

  // ✅ Fetch All Call History
  async getAllHistory(req: Request, res: Response) {
    try {
      const history = await TeleSalesLeadsService.getAllHistory();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All lead history fetched successfully",
        data: history,
      });
    } catch (error: any) {
      console.error("Error fetching history:", error);
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Server error while fetching history",
        data: null,
      });
    }
  },
};
