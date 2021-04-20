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
  const mazeWidth = Math.floor(input.maze_string.split("\n").length / 2);
  const instance = axios.create({
    baseURL: "http://localhost:3030",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  });
  const response = await instance.post(`/simulate/${mazeWidth}/search/`, input);
  return response.data;
}
