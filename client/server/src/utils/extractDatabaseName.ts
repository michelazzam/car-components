export function extractDatabaseName(mongoUrl: string) {
  try {
    // Remove any trailing query parameters
    const cleanUrl = mongoUrl.split("?")[0];

    // Get the part after the last /
    const dbName = cleanUrl.split("/").pop();

    // If there's no database specified, return null
    if (!dbName || dbName === cleanUrl) {
      return null;
    }

    return dbName;
  } catch (error) {
    return null;
  }
}
