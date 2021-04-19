import React from "react";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export type Direction =
  | "North"
  | "NorthEast"
  | "East"
  | "SouthEast"
  | "South"
  | "SouthWest"
  | "West"
  | "NorthWest";

export interface Input {
  config: {
    start: {
      x: number;
      y: number;
      direction: Direction;
    };
    return_goal: {
      x: number;
      y: number;
      direction: Direction;
    };
    goals: Array<{
      x: number;
      y: number;
      direction: Direction;
    }>;
    search_initial_route: "Init";
    search_final_route: "Final";
    estimator_cut_off_frequency: number;
    period: number;
    translational_kp: number;
    translational_ki: number;
    translational_kd: number;
    translational_model_gain: number;
    translational_model_time_constant: number;
    rotational_kp: number;
    rotational_ki: number;
    rotational_kd: number;
    rotational_model_gain: number;
    rotational_model_time_constant: number;
    kx: number;
    kdx: number;
    ky: number;
    kdy: number;
    valid_control_lower_bound: number;
    low_zeta: number;
    low_b: number;
    fail_safe_distance: number;
    search_velocity: number;
    max_velocity: number;
    max_acceleration: number;
    max_jerk: number;
    spin_angular_velocity: number;
    spin_angular_acceleration: number;
    spin_angular_jerk: number;
    run_slalom_velocity: number;
  };
  state: {
    current_node: {
      x: number;
      y: number;
      direction: Direction;
    };
    robot_state: {
      x: {
        x: number;
        v: number;
        a: number;
        j: number;
      };
      y: {
        x: number;
        v: number;
        a: number;
        j: number;
      };
      theta: {
        x: number;
        v: number;
        a: number;
        j: number;
      };
    };
  };
  maze_string: string;
}

export const defaultInput: Input = {
  config: {
    start: {
      x: 0,
      y: 0,
      direction: "North",
    },
    return_goal: {
      x: 0,
      y: 0,
      direction: "South",
    },
    goals: [
      {
        x: 2,
        y: 0,
        direction: "South",
      },
      {
        x: 2,
        y: 0,
        direction: "West",
      },
    ],
    search_initial_route: "Init",
    search_final_route: "Final",
    estimator_cut_off_frequency: 50.0,
    period: 0.001,
    translational_kp: 1.0,
    translational_ki: 0.05,
    translational_kd: 0.01,
    translational_model_gain: 1.0,
    translational_model_time_constant: 0.3694,
    rotational_kp: 1.0,
    rotational_ki: 0.2,
    rotational_kd: 0.0,
    rotational_model_gain: 10.0,
    rotational_model_time_constant: 0.1499,
    kx: 40.0,
    kdx: 4.0,
    ky: 40.0,
    kdy: 4.0,
    valid_control_lower_bound: 0.03,
    low_zeta: 1.0,
    low_b: 1e-3,
    fail_safe_distance: 0.05,
    search_velocity: 0.12,
    max_velocity: 1.0,
    max_acceleration: 50.0,
    max_jerk: 100.0,
    spin_angular_velocity: 3.141592653589793,
    spin_angular_acceleration: 31.41592653589793,
    spin_angular_jerk: 125.66370614359172,
    run_slalom_velocity: 0.5,
  },
  state: {
    current_node: {
      x: 0,
      y: 0,
      direction: "North",
    },
    robot_state: {
      x: {
        x: 0.045,
        v: 0,
        a: 0,
        j: 0,
      },
      y: {
        x: 0.045,
        v: 0,
        a: 0,
        j: 0,
      },
      theta: {
        x: 1.5707963267948966,
        v: 0,
        a: 0,
        j: 0,
      },
    },
  },
  maze_string: `+---+---+---+---+
|               |
+   +---+---+   +
|   |       |   |
+   +   +   +   +
|   |   |       |
+   +   +---+   +
|   |       |   |
+---+---+---+---+`,
};

function intoList(value: any, nestCount: number) {
  if (typeof value === "number") {
    return <TextField defaultValue={value} type="number" />;
  } else if (typeof value === "string") {
    if (value.length <= 15) {
      return <TextField defaultValue={value} type="string" />;
    } else {
      return <TextareaAutosize defaultValue={value} />;
    }
  } else if (value instanceof Array) {
    return (
      <List disablePadding>
        {value.map((elem) => intoList(elem, nestCount))}
      </List>
    );
  } else {
    const style = {
      paddingLeft: nestCount * 10 + 10,
    };
    return (
      <div>
        <Divider />
        <List disablePadding>
          {Object.entries(value).map((elem) => {
            if (typeof elem[1] === "number" || typeof elem[1] === "string") {
              return (
                <div>
                  <ListItem key={elem[0]} style={style}>
                    <ListItemText primary={elem[0]} />
                    {intoList(elem[1], nestCount + 1)}
                  </ListItem>
                </div>
              );
            } else {
              return (
                <div>
                  <ListItem key={elem[0]} style={style}>
                    <ListItemText primary={elem[0]} />
                  </ListItem>
                  {intoList(elem[1], nestCount + 1)}
                </div>
              );
            }
          })}
        </List>
        <Divider />
      </div>
    );
  }
}

export const defaultInputList = intoList(defaultInput, 0);
