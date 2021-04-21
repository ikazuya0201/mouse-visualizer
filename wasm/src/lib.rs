use std::rc::Rc;

use components::defaults::{config::Config, state::State};
use components::{
    defaults::{
        alias::SearchOperator, config::ConfigContainer, resource::ResourceBuilder,
        state::StateContainer,
    },
    prelude::*,
    traits::Operator,
    types::data::Pose,
    utils::math::LibmMath,
    utils::probability::Probability,
    wall_manager::WallManager,
};
use mouse_simulator::AgentSimulator;
use serde::{Deserialize, Serialize};
use uom::si::{
    angle::degree,
    electric_potential::volt,
    f32::{Angle, ElectricPotential, Length},
    length::millimeter,
};
use wasm_bindgen::prelude::*;

const N: usize = 32;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused)]
macro_rules! console_log {
    ($($t:tt)*) => {
        #[allow(unused_unsafe)]
        unsafe { log(&format_args!($($t)*).to_string()) }
    }
}

fn shape_maze_string(input: &str) -> String {
    let lines = input.lines().collect::<Vec<_>>();
    let mut res = String::new();
    for i in 0..2 * N + 1 {
        if i >= 2 * N + 1 - lines.len() {
            let i = i + lines.len() - 2 * N - 1;
            res.push_str(lines[i]);
            if i % 2 == 0 {
                for _ in lines.len() / 2..N {
                    res.push_str("---+");
                }
                res.push_str("\n");
            } else {
                for _ in lines.len() / 2..N {
                    res.push_str("   |");
                }
                res.push_str("\n");
            }
        } else if i % 2 == 0 {
            for _ in 0..N {
                res.push_str("+---");
            }
            res.push_str("+\n");
        } else {
            for _ in 0..N {
                res.push_str("|   ");
            }
            res.push_str("|\n");
        }
    }
    res
}

#[derive(Clone, PartialEq, Debug, Serialize, Deserialize)]
pub struct Input {
    pub state: State<N>,
    pub config: Config<N>,
    pub maze_string: String,
}

#[wasm_bindgen]
pub fn simulate(input: &str) -> String {
    console_error_panic_hook::set_once();

    let input: Input = serde_json::from_str(input).unwrap();

    let maze_string = shape_maze_string(&input.maze_string);

    let existence_threshold = Probability::new(0.1).unwrap();

    let distance_sensors_poses = vec![
        Pose {
            x: Length::new::<millimeter>(0.0),
            y: Length::new::<millimeter>(23.0),
            theta: Angle::new::<degree>(0.0),
        },
        Pose {
            x: Length::new::<millimeter>(-11.5),
            y: Length::new::<millimeter>(13.0),
            theta: Angle::new::<degree>(90.0),
        },
        Pose {
            x: Length::new::<millimeter>(11.5),
            y: Length::new::<millimeter>(13.0),
            theta: Angle::new::<degree>(-90.0),
        },
    ];

    let wheel_interval = Length::new::<millimeter>(33.5);

    let simulator = AgentSimulator::new(
        input.state.robot_state().clone(),
        *input.config.period(),
        *input.config.translational_model_gain(),
        *input.config.translational_model_time_constant(),
        *input.config.rotational_model_gain(),
        *input.config.rotational_model_time_constant(),
        WallManager::<N>::with_str(existence_threshold, &maze_string),
        distance_sensors_poses,
    );

    let (
        stepper,
        observer,
        right_encoder,
        left_encoder,
        imu,
        right_motor,
        left_motor,
        distance_sensors,
    ) = simulator.split(
        wheel_interval,
        ElectricPotential::new::<volt>(3.7),
        *input.config.square_width(),
        *input.config.wall_width(),
        *input.config.ignore_radius_from_pillar(),
        *input.config.ignore_length_from_wall(),
    );

    let wall_manager = Rc::new(WallManager::new(existence_threshold));
    let resource = ResourceBuilder::new()
        .left_encoder(left_encoder)
        .right_encoder(right_encoder)
        .imu(imu)
        .left_motor(left_motor)
        .right_motor(right_motor)
        .wall_manager(wall_manager)
        .distance_sensors(distance_sensors.into_iter().collect())
        .build()
        .unwrap();

    let config: ConfigContainer<N> = input.config.into();
    let state: StateContainer<N> = input.state.into();
    let (operator, _) =
        SearchOperator::<_, _, _, _, _, _, LibmMath, N>::construct(&config, &state, resource);
    let mut log = Vec::new();
    while operator.run().is_err() && !operator.tick().is_err() {
        log.push(observer.state().clone());
        stepper.step();
    }
    serde_json::to_string(&log).unwrap()
}
