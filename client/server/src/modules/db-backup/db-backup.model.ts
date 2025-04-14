import mongoose from "mongoose";

interface IDBBackup {
  _id: string;
  path: string;
}

export const DBBackupId = "unique_DBBackup_id";
const DBBackupSchema = new mongoose.Schema<IDBBackup>(
  {
    _id: {
      type: String,
      default: DBBackupId,
    },

    path: {
      type: String,
    },
  },
  {
    timestamps: false,
    _id: false,
  }
);

const DBBackup = mongoose.model("DBBackup", DBBackupSchema);
export default DBBackup;
