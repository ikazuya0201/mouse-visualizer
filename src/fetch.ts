import { Input } from "./input";

export interface Result {
  x: {
    x: number;
  };
  y: {
    x: number;
  };
  theta: {
    x: number;
  };
}

export default async function fetchResult(
  input: Input
): Promise<Array<Result>> {
  const wasm = await import("wasm");
  return JSON.parse(wasm.simulate(JSON.stringify(input)));
}
