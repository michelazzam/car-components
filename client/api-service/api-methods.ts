import axiosClient from "@/lib/axios-client";

export const getFromApi = async (endpoint: string, params?: any) => {
  try {
    const result = await axiosClient.get(endpoint, {
      params,
    });
    return result.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const sendToApi = async (
  endpoint: string,
  data: any,
  method: "POST" | "PUT" | "DELETE"
) => {
  //get the origin that is sending the request
  const origin = window.location.origin;
  try {
    let result;
    if (method === "POST") result = await axiosClient.post(endpoint, data);
    else if (method === "PUT") result = await axiosClient.put(endpoint, data);
    else if (method === "DELETE")
      result = await axiosClient.delete(endpoint, {
        params: data,
      });
    return result?.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Cannot Send request \n 
The endpont is : ${endpoint} \n 
The data is : ${JSON.stringify(data)} \n 
The origin is : ${origin}`
    );
  }
};
