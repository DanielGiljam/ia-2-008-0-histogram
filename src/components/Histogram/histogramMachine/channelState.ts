import {EventObject, StateNodeConfig, StateSchema} from "xstate"

import {
  ColorChannel,
  HistogramMachineContext,
  HistogramMachineEvent,
} from "./index"

// #region TYPES

export interface ChannelStateSchema<T extends ColorChannel>
  extends StateSchema<undefined> {
  type: "compound";
  states: {
    checked: {};
    unchecked: {};
  };
}

// #region EVENT TYPES

interface ChannelCheckEvent<T extends ColorChannel> extends EventObject {
  type: T extends "red"
    ? "RED.CHECK" | "RED.UNCHECK"
    : T extends "green"
    ? "GREEN.CHECK" | "GREEN.UNCHECK"
    : T extends "blue"
    ? "BLUE.CHECK" | "BLUE.UNCHECK"
    : T extends "alpha"
    ? "ALPHA.CHECK" | "ALPHA.UNCHECK"
    : unknown;
}

// #endregion

export type ChannelStateEvent = ChannelCheckEvent<ColorChannel>

// #endregion

function channelState<T extends ColorChannel> (
  channel: T,
): StateNodeConfig<
  HistogramMachineContext,
  ChannelStateSchema<T>,
  HistogramMachineEvent
> {
  return {
    type: "compound",
    initial: "checked",
    states: {
      checked: {
        on: {
          [channel.toUpperCase() + ".UNCHECK"]: "unchecked",
        },
      },
      unchecked: {
        on: {
          [channel.toUpperCase() + ".UNCHECK"]: "checked",
        },
      },
    },
  }
}

export default channelState
