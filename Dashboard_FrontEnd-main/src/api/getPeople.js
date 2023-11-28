import axios from "axios";

export default async function getPeople() {
  //production
  const response = await axios.get(import.meta.env.VITE_READ_API+"/get");
  return response.data;
}
