import {
  ActionFunction,
  ConditionPredicate,
  EventObject,
  Machine,
  assign,
} from "xstate"

import {FileRejection} from "react-dropzone"

import listeners from "./listeners"

// #region GUARDS

const noFileRejections: ConditionPredicate<StateMachineContext, FilesEvent> = (
  _context,
  {fileRejections},
) => !fileRejections.length

// #endregion

// #region ACTION IMPLEMENTATIONS

const loadPicture: ActionFunction<StateMachineContext, FilesEvent> = (
  {fileReader},
  {acceptedFiles: [file]},
) => {
  console.log(
    "[stateMachine.actions]: [loadPicture]: Reading picture as data URL...",
  )
  fileReader.readAsDataURL(file)
}

const setErrorMessage = assign<StateMachineContext, FilesEvent>({
  errorMessage: (_context, {fileRejections}) => {
    console.log(
      "[stateMachine.actions]: [setErrorMessage]: Creating error message...",
    )
    return fileRejections.length > 1
      ? "Cannot load multiple files."
      : "File must be an image."
  },
})

const clearErrorMessage = assign<StateMachineContext, ClearErrorMessageEvent>({
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
interface FilesEvent extends EventObject {
  type: "FILES";
  acceptedFiles: File[];
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
  | FilesEvent
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
      FILES: [
        {
          target: ".pictureLoader.processing",
          cond: "noFileRejections",
          actions: "loadPicture",
        },
        {actions: "setErrorMessage"},
      ],
      CLEAR_ERROR_MESSAGE: {actions: "clearErrorMessage"},
    },
    invoke: {
      id: "listeners",
      src: listeners,
    },
  },
  {
    guards: {
      noFileRejections,
    },
    actions: {
      loadPicture,
      setErrorMessage,
      clearErrorMessage,
      setImageData,
    },
  },
)

export default stateMachine
