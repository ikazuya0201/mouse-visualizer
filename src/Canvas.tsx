import React, { useRef, useEffect } from "react";
import { Result } from "./fetch";

interface Props {
  results?: Array<Result>;
  value: number;
  mazeString: string;
  setMazeString: (mazeString: string) => void;
}

//Left-bottom position of the maze is the origin.
interface WallPosition {
  x: number;
  y: number;
  dir: "up" | "right";
}

function parseMazeString(maze_string: string): [Set<string>, number] {
  const walls = new Set<string>();
  const lines = maze_string.split("\n");
  const mazeWidth = Math.floor(lines.length / 2);
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (i % 2 === 0) {
        if (j % 4 === 1 && line[j] === "-") {
          walls.add(
            JSON.stringify({
              x: Math.floor(j / 4),
              y: mazeWidth - Math.floor(i / 2) - 1,
              dir: "up",
            })
          );
        }
      } else {
        if (j % 4 === 0 && line[j] === "|") {
          walls.add(
            JSON.stringify({
              x: Math.floor(j / 4) - 1,
              y: mazeWidth - Math.floor(i / 2) - 1,
              dir: "right",
            })
          );
        }
      }
    }
  });
  return [walls, mazeWidth];
}

function intoMazeString(walls: Set<string>, mazeWidth: number): string {
  const hasWall: Array<Array<{ right: boolean; up: boolean }>> = [];
  for (let x = 0; x < mazeWidth; x++) {
    hasWall.push([]);
    for (let y = 0; y < mazeWidth; y++) {
      hasWall[x].push({ up: false, right: false });
    }
  }
  walls.forEach((wallStr) => {
    const wall: WallPosition = JSON.parse(wallStr);
    if (
      wall.x < 0 ||
      wall.y < 0 ||
      wall.x >= mazeWidth ||
      wall.y >= mazeWidth
    ) {
      return;
    }
    if (wall.dir === "up") {
      hasWall[wall.x][wall.y].up = true;
    } else {
      hasWall[wall.x][wall.y].right = true;
    }
  });

  let res = "";
  for (let y = 0; y < mazeWidth; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (hasWall[x][mazeWidth - y - 1].up) {
        res += "+---";
      } else {
        res += "+   ";
      }
    }
    res += "+\n|";
    for (let x = 0; x < mazeWidth; x++) {
      if (hasWall[x][mazeWidth - y - 1].right) {
        res += "   |";
      } else {
        res += "    ";
      }
    }
    res += "\n";
  }
  for (let x = 0; x < mazeWidth; x++) {
    res += "+---";
  }
  res += "+";
  return res;
}

export default function Canvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [walls, mazeWidth] = parseMazeString(props.mazeString);
  const squareWidthPixel = 50;
  const origin = [100, 100 + mazeWidth * squareWidthPixel];
  const squareWidthMeter = 0.09;
  const squareRatio = squareWidthPixel / squareWidthMeter;
  const canvasWidth = mazeWidth * squareWidthPixel + 200;
  const canvasHeight = mazeWidth * squareWidthPixel + 200;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawWall = (pos: WallPosition) => {
      ctx.beginPath();
      if (pos.dir === "up") {
        ctx.moveTo(
          origin[0] + pos.x * squareWidthPixel,
          origin[1] - (pos.y + 1) * squareWidthPixel
        );
        ctx.lineTo(
          origin[0] + (pos.x + 1) * squareWidthPixel,
          origin[1] - (pos.y + 1) * squareWidthPixel
        );
        ctx.stroke();
      } else {
        ctx.moveTo(
          origin[0] + (pos.x + 1) * squareWidthPixel,
          origin[1] - pos.y * squareWidthPixel
        );
        ctx.lineTo(
          origin[0] + (pos.x + 1) * squareWidthPixel,
          origin[1] - (pos.y + 1) * squareWidthPixel
        );
        ctx.stroke();
      }
      ctx.closePath();
    };

    const drawRobot = (x: number, y: number, theta: number) => {
      const width = 0.037;
      const backLength = 0.024;
      const frontLength = 0.026;
      const leftBottom = [-width / 2.0, -backLength];
      const rightBottom = [width / 2.0, -backLength];
      const front = [0, frontLength];
      const right = [width / 2.0, 0.006];
      const left = [-width / 2.0, 0.006];
      const cos = Math.cos(theta - Math.PI / 2.0);
      const sin = Math.sin(theta - Math.PI / 2.0);
      const positions = [
        leftBottom,
        rightBottom,
        right,
        front,
        left,
        leftBottom,
      ];
      const rotation = (pos: Array<number>) => {
        return [pos[0] * cos - pos[1] * sin, pos[0] * sin + pos[1] * cos];
      };
      const trans = (pos: Array<number>) => {
        const rot = rotation(pos);
        return [x + rot[0], y + rot[1]];
      };
      const intoPixel = (pos: Array<number>) => {
        return [
          origin[0] + pos[0] * squareRatio,
          origin[1] - pos[1] * squareRatio,
        ];
      };
      ctx.beginPath();
      for (let i = 0; i < positions.length - 1; i++) {
        const src = intoPixel(trans(positions[i]));
        const dst = intoPixel(trans(positions[i + 1]));
        ctx.moveTo(src[0], src[1]);
        ctx.lineTo(dst[0], dst[1]);
      }
      ctx.stroke();
      ctx.closePath();
    };

    walls.forEach((wall) => drawWall(JSON.parse(wall)));

    if (props.results !== undefined) {
      const index = Math.floor((props.value * props.results.length) / 100);
      if (index < props.results.length) {
        const state = props.results[index];
        drawRobot(state.x.x, state.y.x, state.theta.x);
      }
    }

    for (let i = 0; i < 2 * mazeWidth; i++) {
      const halfSquareWidthPixel = squareWidthPixel / 2;
      const margin = 5;

      // lower
      ctx.fillText(
        i.toString(),
        origin[0] + (i + 1) * halfSquareWidthPixel - margin,
        origin[1] + halfSquareWidthPixel
      );

      // upper
      ctx.fillText(
        i.toString(),
        origin[0] + (i + 1) * halfSquareWidthPixel - margin,
        origin[1] - squareWidthPixel * mazeWidth - halfSquareWidthPixel + margin
      );

      // left
      ctx.fillText(
        i.toString(),
        origin[0] - halfSquareWidthPixel,
        origin[1] - (i + 1) * halfSquareWidthPixel + margin
      );

      // right
      ctx.fillText(
        i.toString(),
        origin[0] +
          squareWidthPixel * mazeWidth +
          halfSquareWidthPixel -
          margin,
        origin[1] - (i + 1) * halfSquareWidthPixel + margin
      );
    }

    ctx.save();
  });

  const onClick = (event: any) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left - origin[0];
    const y = origin[1] - (event.clientY - rect.top);
    const xquo = Math.floor(x / squareWidthPixel);
    const yquo = Math.floor(y / squareWidthPixel);
    const xrem = x % squareWidthPixel;
    const yrem = y % squareWidthPixel;
    const cands = [
      [xrem, "left"],
      [squareWidthPixel - xrem, "right"],
      [yrem, "bottom"],
      [squareWidthPixel - yrem, "top"],
    ];
    cands.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      } else {
        return 1;
      }
    });
    const dir = cands[0][1];
    const wall = ((): WallPosition | undefined => {
      switch (dir) {
        case "right":
          return {
            x: xquo,
            y: yquo,
            dir: "right",
          };
        case "top":
          return {
            x: xquo,
            y: yquo,
            dir: "up",
          };
        case "left":
          if (xquo === 0) {
            return undefined;
          } else {
            return {
              x: xquo - 1,
              y: yquo,
              dir: "right",
            };
          }
        case "bottom":
          if (yquo == 0) {
            return undefined;
          } else {
            return {
              x: xquo,
              y: yquo - 1,
              dir: "up",
            };
          }
        default:
          return undefined;
      }
    })();
    if (wall === undefined) {
      return;
    }
    const wallStr = JSON.stringify(wall);
    if (walls.has(wallStr)) {
      walls.delete(wallStr);
    } else {
      walls.add(wallStr);
    }
    props.setMazeString(intoMazeString(walls, mazeWidth));
  };

  return (
    <div>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: "1px solid #ddd",
        }}
        className="canvas"
        ref={canvasRef}
        onClick={onClick}
      />
    </div>
  );
}
