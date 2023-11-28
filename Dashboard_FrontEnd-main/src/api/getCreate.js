import axios from "axios";

export default async function CheckCreate() {
  //production
  const response = await axios.get(import.meta.env.VITE_CREATE_API+"/");
  
}
