use std::rc::Rc;

use components::defaults::{config::Config, state::State};
use components::{
    administrator::OperatorError,
    defaults::{
        alias::{
            ReturnOperator, ReturnSetupOperator, RunOperator, RunSetupOperator, SearchOperator,
        },
        config::ConfigContainer,
        resource::ResourceBuilder,
        state::{StateBuilder, StateContainer},
    },
    prelude::*,
    traits::Operator,
    types::data::Pose,
    utils::math::LibmMath,
    utils::probability::Probability,
    wall_manager::WallManager,
    Construct, Deconstruct,
};
use mouse_simulator::{
    AgentSimulator, DistanceSensorMock, EncoderMock, ImuMock, MotorMock, Observer, Stepper,
};
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

enum Operators {
    Blank,
    SearchOperator(
        SearchOperator<
            EncoderMock,
            EncoderMock,
            ImuMock,
            MotorMock,
            MotorMock,
            DistanceSensorMock<N>,
            LibmMath,
            N,
        >,
    ),
    ReturnSetupOperator(
        ReturnSetupOperator<
            EncoderMock,
            EncoderMock,
            ImuMock,
            MotorMock,
            MotorMock,
            DistanceSensorMock<N>,
            LibmMath,
            N,
        >,
    ),
    ReturnOperator(
        ReturnOperator<
            EncoderMock,
            EncoderMock,
            ImuMock,
            MotorMock,
            MotorMock,
            DistanceSensorMock<N>,
            LibmMath,
            N,
        >,
    ),
    RunSetupOperator(
        RunSetupOperator<
            EncoderMock,
            EncoderMock,
            ImuMock,
            MotorMock,
            MotorMock,
            DistanceSensorMock<N>,
            LibmMath,
            N,
        >,
    ),
    RunOperator(
        RunOperator<
            EncoderMock,
            EncoderMock,
            ImuMock,
            MotorMock,
            MotorMock,
            DistanceSensorMock<N>,
            LibmMath,
            N,
        >,
    ),
}

impl Operator for Operators {
    type Error = core::convert::Infallible;

    fn run(&self) -> Result<(), OperatorError<Self::Error>> {
        fn convert_err<T: core::fmt::Debug>(
            err: OperatorError<T>,
        ) -> OperatorError<core::convert::Infallible> {
            match err {
                OperatorError::Other(err) => unimplemented!("{:?}", err),
                OperatorError::Incompleted => OperatorError::Incompleted,
            }
        }

        match self {
            Operators::Blank => {
                unreachable!("Operators::run should never be called when it is None")
            }
            Operators::SearchOperator(inner) => inner.run().map_err(|err| convert_err(err)),
            Operators::ReturnOperator(inner) => inner.run().map_err(|err| convert_err(err)),
            Operators::ReturnSetupOperator(inner) => inner.run().map_err(|err| convert_err(err)),
            Operators::RunOperator(inner) => inner.run().map_err(|err| convert_err(err)),
            Operators::RunSetupOperator(inner) => inner.run().map_err(|err| convert_err(err)),
        }
    }

    fn tick(&self) -> Result<(), Self::Error> {
        match self {
            Operators::Blank => {
                unreachable!("Operators::tick should never be called when it is None")
            }
            Operators::SearchOperator(inner) => {
                inner.tick().map_err(|err| unreachable!("{:?}", err))
            }
            Operators::ReturnOperator(inner) => {
                inner.tick().map_err(|err| unreachable!("{:?}", err))
            }
            Operators::ReturnSetupOperator(inner) => {
                inner.tick().map_err(|err| unreachable!("{:?}", err))
            }
            Operators::RunOperator(inner) => inner.tick().map_err(|err| unreachable!("{:?}", err)),
            Operators::RunSetupOperator(inner) => {
                inner.tick().map_err(|err| unreachable!("{:?}", err))
            }
        }
    }
}

type Resource = components::defaults::resource::Resource<
    EncoderMock,
    EncoderMock,
    ImuMock,
    MotorMock,
    MotorMock,
    DistanceSensorMock<N>,
    N,
>;

#[wasm_bindgen]
pub struct Simulator {
    operator: Operators,
    stepper: Stepper,
    observer: Observer,
    config: ConfigContainer<N>,
    resource: Option<Resource>,
}

#[wasm_bindgen]
impl Simulator {
    pub fn new(input: &str) -> Self {
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
        let (operator, resource) = SearchOperator::construct(&config, &state, resource);
        Self {
            operator: Operators::SearchOperator(operator),
            stepper,
            observer,
            config,
            resource: Some(resource),
        }
    }

    fn convert<T, U>(&mut self, operator: T) -> U
    where
        T: Deconstruct<StateBuilder<N>, Resource>,
        U: Construct<ConfigContainer<N>, StateContainer<N>, Resource>,
    {
        let (mut state, mut resource) = operator.deconstruct();
        resource = resource.merge(self.resource.take().expect("Should never be None"));
        let state: StateContainer<N> = state.build().expect("Should never panic").into();
        let (operator, resource) = U::construct(&self.config, &state, resource);
        self.resource = Some(resource);
        operator
    }

    pub fn simulate_one_step(&mut self) -> Result<String, JsValue> {
        console_error_panic_hook::set_once();

        while self.operator.run().is_ok() {
            let mut tmp = Operators::Blank;
            core::mem::swap(&mut tmp, &mut self.operator);
            let mut next = match tmp {
                Operators::SearchOperator(inner) => {
                    Operators::ReturnSetupOperator(self.convert(inner))
                }
                Operators::ReturnSetupOperator(inner) => {
                    Operators::ReturnOperator(self.convert(inner))
                }
                Operators::ReturnOperator(inner) => {
                    Operators::RunSetupOperator(self.convert(inner))
                }
                Operators::RunSetupOperator(inner) => Operators::RunOperator(self.convert(inner)),
                Operators::RunOperator(_) => {
                    return Err(JsValue::from_str("entire process finished"))
                }
                _ => unreachable!("Operators should never be Blank here"),
            };
            core::mem::swap(&mut next, &mut self.operator);
        }
        self.stepper.step();
        self.operator
            .tick()
            .map_err(|err| JsValue::from_str(&format!("{:?}", err)))?;
        serde_json::to_string(&self.observer.state())
            .map_err(|err| JsValue::from_str(&format!("{:?}", err)))
    }
}
