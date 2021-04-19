import React, { useRef, useEffect } from "react";

interface Props {
  walls: Array<WallPosition>;
  mazeWidth: number;
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
    if (2 * mazeWidth + 1 <= i) {
      return;
    }
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
        if (j > 0 && j % 4 === 0 && line[j] === "|") {
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
  const canvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const ref: any = canvasRef.current;
    return ref.getContext("2d");
  };

  const mazeWidth = props.mazeWidth;
  const squareWidth = 50;
  const origin = [300, 100 + mazeWidth * squareWidth];

  useEffect(() => {
    const ctx: CanvasRenderingContext2D = getContext();
    const basicWall = () => {
      ctx.beginPath();
      ctx.moveTo(origin[0], origin[1]);
      ctx.lineTo(origin[0] + mazeWidth * squareWidth, origin[1]);
      ctx.stroke();

      ctx.moveTo(origin[0], origin[1]);
      ctx.lineTo(origin[0], origin[1] - mazeWidth * squareWidth);
      ctx.stroke();
      ctx.closePath();
    };

    const drawWall = (pos: WallPosition) => {
      ctx.beginPath();
      if (pos.dir === "up") {
        ctx.moveTo(
          origin[0] + pos.x * squareWidth,
          origin[1] - (pos.y + 1) * squareWidth
        );
        ctx.lineTo(
          origin[0] + (pos.x + 1) * squareWidth,
          origin[1] - (pos.y + 1) * squareWidth
        );
        ctx.stroke();
      } else {
        ctx.moveTo(
          origin[0] + (pos.x + 1) * squareWidth,
          origin[1] - pos.y * squareWidth
        );
        ctx.lineTo(
          origin[0] + (pos.x + 1) * squareWidth,
          origin[1] - (pos.y + 1) * squareWidth
        );
        ctx.stroke();
      }
      ctx.closePath();
    };

    basicWall();

    for (const wall of props.walls) {
      drawWall(wall);
    }
    ctx.save();
  });

  return (
    <div>
      <canvas
        width="2000px"
        height="2000px"
        style={{
          border: "1px solid #ddd",
        }}
        className="canvas"
        ref={canvasRef}
      />
    </div>
  );
}
