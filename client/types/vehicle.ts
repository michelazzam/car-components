export type VehicleMakeType = {
  id: string;
  name: string;
  totalModels: number;
  models?: VehicleModelType[];
};

export type VehicleModelType = {
  id: string;
  name: string;
};
