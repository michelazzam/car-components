import mongoose from "mongoose";

interface IOrganization {
  _id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  tvaNumber: string;
  tvaPercentage: string;
}

export const organizationId = "organization_id";

const OrganizationSchema = new mongoose.Schema<IOrganization>(
  {
    _id: {
      type: String,
      default: organizationId,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    tvaNumber: {
      type: String,
    },
    tvaPercentage: {
      type: String,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const Organization = mongoose.model("Organization", OrganizationSchema);
export default Organization;
