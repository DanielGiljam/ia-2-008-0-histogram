import {
  ActionFunction,
  DoneInvokeEvent,
  EventObject,
  Machine,
  StateSchema,
  assign,
} from "xstate"

import channelState, {
  ChannelStateEvent,
  ChannelStateSchema,
  toggleChannel,
} from "./channelState"
import generateHistogram, {DataEvent} from "./generateHistogram"

// #region ACTION IMPLEMENTATIONS

const setData = assign<HistogramMachineContext, DoneInvokeEvent<HistogramData>>(
  {
    data: (_context, {data}) => {
      console.log(
        "[histogramMachine.actions]: [setData]: Setting histogram data...",
      )
      return data
    },
  },
)

const logError: ActionFunction<
  HistogramMachineContext,
  DoneInvokeEvent<Error>
> = (_context, {data}) => console.error(data)

// #endregion

// #region TYPES

export type ColorChannel = "red" | "green" | "blue" | "luminosity"

export type HistogramDataObject = {[K in ColorChannel]: number}

export type HistogramData = HistogramDataObject[]

export interface HistogramMachineContext {
  data?: HistogramData;
}

export interface HistogramMachineSchema
  extends StateSchema<HistogramMachineContext> {
  type: "compound";
  states: {
    deactivated: {};
    loading: {};
    idle: {
      type: "parallel";
      states: {
        red: ChannelStateSchema<"red">;
        green: ChannelStateSchema<"green">;
        blue: ChannelStateSchema<"blue">;
        luminosity: ChannelStateSchema<"luminosity">;
      };
    };
    error: {};
  };
}

// #region EVENT TYPES

interface CheckEvent extends EventObject {
  type: "CHECK" | "UNCHECK";
}

// #endregion

export type HistogramMachineEvent =
  | DataEvent
  | DoneInvokeEvent<HistogramData | Error>
  | CheckEvent
  | ChannelStateEvent

// #endregion

const histogramMachine = Machine<
  HistogramMachineContext,
  HistogramMachineSchema,
  HistogramMachineEvent
>(
  {
    id: "histogramMachine",
    type: "compound",
    initial: "deactivated",
    context: {
      data: undefined,
    },
    states: {
      deactivated: {},
      loading: {
        invoke: {
          id: "processData",
          src: generateHistogram,
          onDone: {target: "idle", actions: "setData"},
          onError: {target: "error", actions: "logError"},
        },
      },
      idle: {
        type: "parallel",
        states: {
          red: channelState("red"),
          green: channelState("green"),
          blue: channelState("blue"),
          luminosity: channelState("luminosity"),
        },
        on: {
          CHECK: {
            target: [
              "idle.red.checked",
              "idle.green.checked",
              "idle.blue.checked",
              "idle.luminosity.checked",
            ],
          },
          UNCHECK: {
            target: [
              "idle.red.unchecked",
              "idle.green.unchecked",
              "idle.blue.unchecked",
              "idle.luminosity.unchecked",
            ],
          },
        },
      },
      error: {},
    },
    on: {
      DATA: "loading",
    },
  },
  {
    actions: {
      setData,
      logError,
      toggleChannel,
    },
  },
)

export default histogramMachine
