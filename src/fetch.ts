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
  const simulator = wasm.Simulator.new(JSON.stringify(input));
  let results: Array<Result> = [];
  for (;;) {
    try {
      await new Promise<void>((resolve, rejected) => {
        setTimeout(() => {
          const batchResults: Array<Result> = [];
          try {
            for (let i = 0; i < 300; i++) {
              batchResults.push(JSON.parse(simulator.simulate_one_step()));
            }
            results = results.concat(batchResults);
            if (results.length > input.time_limit) {
              rejected("time limit exceeded");
            }
          } catch (err) {
            results = results.concat(batchResults);
            rejected(err);
          }
          resolve();
        });
      });
    } catch (err) {
      console.log(err);
      break;
    }
  }
  return results;
}
