import { Request, Response } from "express";
import Organization, { organizationId } from "./organization.model.js";

export const populateOrganization = async () => {
  try {
    const resto = await Organization.findOne({
      _id: organizationId,
    });

    if (resto) {
      console.log("Organization document already exists");
    } else {
      await Organization.create({
        _id: organizationId,
        name: "ThermoBox",
      });

      console.log("Organization document created successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Get Organization Info
 */
export const getOrganizationInfo = async (_: Request, res: Response) => {
  try {
    const org = await Organization.findById(organizationId);

    res.json(org);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update Organization Info
 */
export const updateOrganizationInfo = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      email,
      phoneNumber,
      tvaNumber,
      tvaPercentage,
    } = req.body;

    //TODO: handle image upload and decide where to store it
    await Organization.findByIdAndUpdate(organizationId, {
      name,
      address,
      email,
      phoneNumber,
      tvaNumber,
      tvaPercentage,
    });

    res.json({ message: "Organization updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
