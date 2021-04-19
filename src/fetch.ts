import axios from "axios";
import { Input } from "./input";

export interface Result {
  state: {
    x: {
      x: number;
    };
    y: {
      x: number;
    };
    theta: {
      x: number;
    };
  };
}

export default async function fetchResult(
  input: Input
): Promise<Array<Result>> {
  const instance = axios.create({
    baseURL: "http://localhost:3030",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  });
  const response = await instance.post(`/simulate/16/search/`, input);
  return response.data;
}
