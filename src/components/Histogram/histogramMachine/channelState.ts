import {ActionFunction, EventObject, StateNodeConfig, StateSchema} from "xstate"

import {
  ColorChannel,
  HistogramMachineContext,
  HistogramMachineEvent,
} from "./index"

// #region ACTION IMPLEMENTATIONS

export const toggleChannel: ActionFunction<
  HistogramMachineContext,
  ChannelCheckEvent<ColorChannel>
> = (_context, _event, {action}) => {
  const {channel, display} = (action as unknown) as {
    channel: ColorChannel;
    display: "none" | null;
  }
  const channelRef = document.getElementById(channel)
  if (channelRef) {
    channelRef.style.display = display
  }
}

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
    : T extends "luminosity"
    ? "LUMINOSITY.CHECK" | "LUMINOSITY.UNCHECK"
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
        onEntry: {
          type: "toggleChannel",
          display: null,
          channel,
        },
      },
      unchecked: {
        on: {
          [channel.toUpperCase() + ".CHECK"]: "checked",
        },
        onEntry: {
          type: "toggleChannel",
          display: "none",
          channel,
        },
      },
    },
  }
}

export default channelState
