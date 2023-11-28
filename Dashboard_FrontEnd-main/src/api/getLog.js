import axios from "axios";

export default async function getLog() {
  //production
  const response = await axios.get(import.meta.env.VITE_LOG_API+"/log");
  return response.data;
}
export async function CheckLog() {
  //production
  await axios.get(import.meta.env.VITE_LOG_API+"/");
}