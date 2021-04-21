import React, { useRef, useEffect } from "react";
import { Result } from "./fetch";

interface Props {
  walls: Array<WallPosition>;
  mazeWidth: number;
  results?: Array<Result>;
  value: number;
}

//Left-bottom position of the maze is the origin.
export interface WallPosition {
  x: number;
  y: number;
  dir: "up" | "right";
}

export function parseMazeString(
  maze_string: string
): [Array<WallPosition>, number] {
  const walls: Array<WallPosition> = [];
  const lines = maze_string.split("\n");
  const mazeWidth = Math.floor(lines.length / 2);
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (i % 2 === 0) {
        if (j % 4 === 1 && line[j] === "-") {
          walls.push({
            x: Math.floor(j / 4),
            y: mazeWidth - Math.floor(i / 2) - 1,
            dir: "up",
          });
        }
      } else {
        if (j % 4 === 0 && line[j] === "|") {
          walls.push({
            x: Math.floor(j / 4) - 1,
            y: mazeWidth - Math.floor(i / 2) - 1,
            dir: "right",
          });
        }
      }
    }
  });
  return [walls, mazeWidth];
}

export default function Canvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mazeWidth = props.mazeWidth;
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

    for (const wall of props.walls) {
      drawWall(wall);
    }

    if (props.results !== undefined) {
      const index = Math.floor((props.value * props.results.length) / 100);
      if (index < props.results.length) {
        const state = props.results[index];
        drawRobot(state.x.x, state.y.x, state.theta.x);
      }
    }
    ctx.save();
  });

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
      />
    </div>
  );
}
