import React from "react";
import { ISubmitEvent } from "@rjsf/core";
import Form from "@rjsf/material-ui";
import {
  WidgetProps,
  ObjectFieldTemplateProps,
  FieldTemplateProps,
  ArrayFieldTemplateProps,
} from "@rjsf/core";
import { JSONSchema7 } from "json-schema";
import {
  IconButton,
  TextareaAutosize,
  TextField,
  Select,
  MenuItem,
  Grid,
} from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import { ExpandMore, ChevronRight, Add, Delete } from "@material-ui/icons";

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
  time_limit: number;
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
        x: 15,
        y: 14,
        direction: "SouthWest",
      },
      {
        x: 15,
        y: 14,
        direction: "SouthEast",
      },
      {
        x: 15,
        y: 16,
        direction: "NorthWest",
      },
      {
        x: 15,
        y: 16,
        direction: "NorthEast",
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
    valid_control_lower_bound: 0.1,
    low_zeta: 1.0,
    low_b: 1.0,
    fail_safe_distance: 0.05,
    search_velocity: 0.3,
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
  maze_string: `+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|                           |   |   |                           |
+   +---+---+---+   +---+   +---+---+   +---+   +---+---+---+   +
|   |           |   |                       |   |           |   |
+   +---+---+   +   +   +---+---+---+---+   +   +   +---+---+   +
|           |   |   |                       |   |   |           |
+   +---+   +---+   +---+---+---+---+---+---+   +---+   +---+   +
|   |   |   |   |           |       |           |   |   |   |   |
+   +---+   +---+---+---+---+---+---+   +---+   +---+   +---+   +
|                   |                       |                   |
+   +---+---+   +   +---+---+   +---+---+---+---+---+---+---+   +
|   |       |   |   |       |   |   |       |       |           |
+   +---+   +   +   +   +---+   +---+---+   +   +   +   +---+   +
|       |   |   |   |   |               |   |   |   |   |       |
+---+   +   +   +   +---+   +---+---+   +---+   +   +   +   +   +
|   |   |   |       |   |   |       |   |   |       |   |   |   |
+   +   +---+   +   +   +   +   +   +   +   +   +   +   +   +   +
|   |   |       |   |   |   |           |   |   |   |   |   |   |
+---+   +---+   +   +---+   +---+---+   +---+   +   +   +   +   +
|       |   |   |   |   |               |   |   |   |   |       |
+   +---+   +   +   +   +---+---+---+---+   +   +   +   +---+   +
|   |       |       |           |           |       |           |
+   +---+---+---+   +---+---+---+---+---+---+---+   +---+---+   +
|               |                               |               |
+   +---+---+   +   +---+   +---+---+   +---+   +---+---+---+   +
|               |                               |   |       |   |
+   +---+---+   +   +---+---+---+---+---+---+   +---+---+   +   +
|   |   |   |       |           |           |           |   |   |
+   +   +---+   +   +   +---+---+---+---+   +   +---+   +   +   +
|   |   |       |   |   |               |   |           |   |   |
+   +   +   +---+   +---+   +---+---+   +---+   +---+   +---+   +
|   |   |                                       |   |           |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+`,
  time_limit: 300000,
};

const Directions = [
  "North",
  "NorthEast",
  "East",
  "SouthEast",
  "South",
  "SouthWest",
  "West",
  "NorthWest",
];

export const inputSchema: JSONSchema7 = {
  type: "object",
  title: "Input",
  properties: {
    config: {
      type: "object",
      properties: {
        start: {
          type: "object",
          properties: {
            x: {
              type: "integer",
            },
            y: {
              type: "integer",
            },
            direction: {
              type: "string",
              enum: Directions,
            },
          },
          required: ["x", "y", "direction"],
        },
        return_goal: {
          type: "object",
          properties: {
            x: {
              type: "integer",
            },
            y: {
              type: "integer",
            },
            direction: {
              type: "string",
              enum: Directions,
            },
          },
          required: ["x", "y", "direction"],
        },
        goals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: {
                type: "integer",
              },
              y: {
                type: "integer",
              },
              direction: {
                type: "string",
                enum: Directions,
              },
            },
            required: ["x", "y", "direction"],
          },
        },
        search_initial_route: {
          type: "string",
          enum: ["Init"],
        },
        search_final_route: {
          type: "string",
          enum: ["Final"],
        },
        estimator_cut_off_frequency: {
          type: "number",
        },
        period: {
          type: "number",
        },
        translational_kp: {
          type: "number",
        },
        translational_ki: {
          type: "number",
        },
        translational_kd: {
          type: "number",
        },
        translational_model_gain: {
          type: "number",
        },
        translational_model_time_constant: {
          type: "number",
        },
        rotational_kp: {
          type: "number",
        },
        rotational_ki: {
          type: "number",
        },
        rotational_kd: {
          type: "number",
        },
        rotational_model_gain: {
          type: "number",
        },
        rotational_model_time_constant: {
          type: "number",
        },
        kx: {
          type: "number",
        },
        kdx: {
          type: "number",
        },
        ky: {
          type: "number",
        },
        kdy: {
          type: "number",
        },
        valid_control_lower_bound: {
          type: "number",
        },
        low_zeta: {
          type: "number",
        },
        low_b: {
          type: "number",
        },
        fail_safe_distance: {
          type: "number",
        },
        search_velocity: {
          type: "number",
        },
        max_velocity: {
          type: "number",
        },
        max_acceleration: {
          type: "number",
        },
        max_jerk: {
          type: "number",
        },
        spin_angular_velocity: {
          type: "number",
        },
        spin_angular_acceleration: {
          type: "number",
        },
        spin_angular_jerk: {
          type: "number",
        },
        run_slalom_velocity: {
          type: "number",
        },
      },
      required: [
        "start",
        "return_goal",
        "goals",
        "search_initial_route",
        "search_final_route",
        "estimator_cut_off_frequency",
        "period",
        "translational_kp",
        "translational_ki",
        "translational_kd",
        "translational_model_gain",
        "translational_model_time_constant",
        "rotational_kp",
        "rotational_ki",
        "rotational_kd",
        "rotational_model_gain",
        "rotational_model_time_constant",
        "kx",
        "kdx",
        "ky",
        "kdy",
        "valid_control_lower_bound",
        "low_zeta",
        "low_b",
        "fail_safe_distance",
        "search_velocity",
        "max_velocity",
        "max_acceleration",
        "max_jerk",
        "spin_angular_velocity",
        "spin_angular_acceleration",
        "spin_angular_jerk",
        "run_slalom_velocity",
      ],
    },
    state: {
      type: "object",
      properties: {
        current_node: {
          type: "object",
          properties: {
            x: {
              type: "integer",
            },
            y: {
              type: "integer",
            },
            direction: {
              type: "string",
              enum: Directions,
            },
          },
          required: ["x", "y", "direction"],
        },
        robot_state: {
          type: "object",
          properties: {
            x: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                },
                v: {
                  type: "integer",
                },
                a: {
                  type: "integer",
                },
                j: {
                  type: "integer",
                },
              },
              required: ["x", "v", "a", "j"],
            },
            y: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                },
                v: {
                  type: "integer",
                },
                a: {
                  type: "integer",
                },
                j: {
                  type: "integer",
                },
              },
              required: ["x", "v", "a", "j"],
            },
            theta: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                },
                v: {
                  type: "integer",
                },
                a: {
                  type: "integer",
                },
                j: {
                  type: "integer",
                },
              },
              required: ["x", "v", "a", "j"],
            },
          },
          required: ["x", "y", "theta"],
        },
      },
      required: ["current_node", "robot_state"],
    },
    maze_string: {
      type: "string",
    },
    time_limit: {
      type: "integer",
    },
  },
  required: ["config", "state", "maze_string", "time_limit"],
};

function CustomTextareaWidget(props: WidgetProps) {
  return (
    <TextareaAutosize
      defaultValue={props.value}
      style={{ width: "100%" }}
      onChange={(event) => props.onChange(event.target.value)}
    />
  );
}

function CustomTextWidget(props: WidgetProps) {
  return (
    <TextField
      defaultValue={props.value}
      onChange={(event) => props.onChange(event.target.value)}
    />
  );
}

function CustomSelectWidget(props: WidgetProps) {
  return (
    <Select
      defaultValue={props.value}
      onChange={(event) => props.onChange(event.target.value)}
    >
      {(props.options.enumOptions as any).map(
        ({ value, label }: any, i: number) => {
          return (
            <MenuItem key={i} value={value}>
              {label}
            </MenuItem>
          );
        }
      )}
    </Select>
  );
}

function FieldTemplate(props: FieldTemplateProps) {
  return (
    <TreeItem nodeId={props.id} label={props.label}>
      {props.children}
    </TreeItem>
  );
}

function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  return <div>{props.properties.map((prop) => prop.content)}</div>;
}

function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  return (
    <div>
      {props.items &&
        props.items.map((p: any) => {
          return (
            <Grid container key={p.key} direction="row" alignItems="center">
              <Grid item xs={8}>
                {p.children}
              </Grid>
              <Grid item xs={4}>
                <IconButton tabIndex={-1} onClick={p.onDropIndexClick(p.index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      <IconButton onClick={props.onAddClick}>
        <Add />
      </IconButton>
    </div>
  );
}

const widgets = {
  TextareaWidget: CustomTextareaWidget,
  TextWidget: CustomTextWidget,
  SelectWidget: CustomSelectWidget,
};

const uiSchema = {
  maze_string: {
    "ui:widget": "textarea",
  },
};

interface Props {
  input: Input;
  onSubmit: (e: ISubmitEvent<Input>) => void;
}

export function InputForm(props: Props) {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
    >
      <Form
        schema={inputSchema}
        formData={props.input}
        uiSchema={uiSchema}
        widgets={widgets}
        onSubmit={props.onSubmit}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
      />
    </TreeView>
  );
}
