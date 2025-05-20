export type VehicleMakeType = {
  _id: string;
  name: string;
  models: VehicleModelType[];
  createdAt: string;
  updatedAt: string;
};

export type VehicleModelType = {
  _id: string;
  name: string;
};
