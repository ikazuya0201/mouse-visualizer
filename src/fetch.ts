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
      const batchResults: Array<Result> = await new Promise(
        (resolve, rejected) => {
          setTimeout(() => {
            const batchResults: Array<Result> = [];
            try {
              for (let i = 0; i < 300; i++) {
                batchResults.push(JSON.parse(simulator.simulate_one_step()));
              }
            } catch (err) {
              rejected(err);
            }
            resolve(batchResults);
          });
        }
      );
      results = results.concat(batchResults);
    } catch (err) {
      console.log(err);
      break;
    }
  }
  return results;
}
