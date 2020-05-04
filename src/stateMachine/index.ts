import {ActionFunction, EventObject, Machine, assign} from "xstate"

import {FileRejection} from "react-dropzone"

import listeners from "./listeners"

// #region ACTION IMPLEMENTATIONS

const loadPicture: ActionFunction<StateMachineContext, AcceptEvent> = (
  {fileReader},
  {picture},
) => {
  console.log(
    "[stateMachine.actions]: [loadPicture]: Reading picture as data URL...",
  )
  fileReader.readAsDataURL(picture)
}

const setErrorMessage = assign<StateMachineContext, RejectEvent>({
  errorMessage: (_context, {fileRejections}) => {
    console.log(
      "[stateMachine.actions]: [setErrorMessage]: Creating error message...",
    )
    return fileRejections.length > 1
      ? "Cannot load multiple files."
      : "File must be an image."
  },
})

const clearErrorMessage = assign<StateMachineContext, RejectEvent>({
  errorMessage: () => {
    console.log(
      "[stateMachine.actions]: [clearErrorMessage]: Clearing error message...",
    )
    return undefined
  },
})

const setImageData = assign<StateMachineContext, PictureLoadedEvent>({
  imageData: (_context, {imageData}) => {
    console.log("[stateMachine.actions]: [setImageData]: Setting image data...")
    return imageData
  },
})

// #endregion

// #region TYPES

export interface StateMachineContext {
  fileReader?: FileReader;
  image?: HTMLImageElement;
  imageData?: ImageData;
  errorMessage?: string;
}

export interface StateMachineSchema {
  type: "parallel";
  states: {
    dropzone: {
      type: "compound";
      states: {
        idle: {};
        dragover: {};
      };
    };
    pictureLoader: {
      type: "compound";
      states: {
        idle: {};
        processing: {};
      };
    };
  };
}

// #region EVENT TYPES

interface DragoverEvent extends EventObject {
  type: "DRAGOVER_START" | "DRAGOVER_END";
}
interface AcceptEvent extends EventObject {
  type: "ACCEPT";
  picture: File;
}
interface RejectEvent extends EventObject {
  type: "REJECT";
  fileRejections: FileRejection[];
}
interface ClearErrorMessageEvent extends EventObject {
  type: "CLEAR_ERROR_MESSAGE";
}
interface PictureLoadedEvent extends EventObject {
  type: "PICTURE_LOADED";
  imageData: ImageData;
}

// #endregion

export type StateMachineEvent =
  | DragoverEvent
  | AcceptEvent
  | RejectEvent
  | ClearErrorMessageEvent
  | PictureLoadedEvent

// #endregion

const stateMachine = Machine<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent
>(
  {
    id: "stateMachine",
    type: "parallel",
    context: {
      fileReader:
        typeof FileReader !== "undefined" ? new FileReader() : undefined,
      image: typeof Image !== "undefined" ? new Image() : undefined,
      imageData: undefined,
      errorMessage: undefined,
    },
    states: {
      dropzone: {
        type: "compound",
        initial: "idle",
        states: {
          idle: {},
          dragover: {
            on: {
              DRAGOVER_END: "idle",
            },
          },
        },
      },
      pictureLoader: {
        type: "compound",
        initial: "idle",
        states: {
          idle: {},
          processing: {
            on: {
              PICTURE_LOADED: {target: "idle", actions: "setImageData"},
            },
          },
        },
      },
    },
    on: {
      DRAGOVER_START: ".dropzone.dragover",
      ACCEPT: {target: ".pictureLoader.processing", actions: "loadPicture"},
      REJECT: {
        target: ".pictureLoader.idle",
        actions: "setErrorMessage",
      },
      CLEAR_ERROR_MESSAGE: {actions: "clearErrorMessage"},
    },
    invoke: {
      id: "listeners",
      src: listeners,
    },
  },
  {
    actions: {
      loadPicture,
      setErrorMessage,
      clearErrorMessage,
      setImageData,
    },
  },
)

export default stateMachine
