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
} from "./channelState"
import processData, {DataEvent} from "./processData"

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

export type ColorChannel = "red" | "green" | "blue" | "alpha"

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
        alpha: ChannelStateSchema<"alpha">;
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
          src: processData,
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
          alpha: channelState("alpha"),
        },
        on: {
          CHECK: {
            target: [
              "idle.red.checked",
              "idle.green.checked",
              "idle.blue.checked",
              "idle.alpha.checked",
            ],
          },
          UNCHECK: {
            target: [
              "idle.red.unchecked",
              "idle.green.unchecked",
              "idle.blue.unchecked",
              "idle.alpha.unchecked",
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
    },
  },
)

export default histogramMachine
