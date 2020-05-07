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

const setLoadingProgress = assign<StateMachineContext, LoadingProgressEvent>({
  loadingProgress: (_context, {loadingProgress}) => loadingProgress,
})

const setErrorMessage = assign<
  StateMachineContext,
  FilesEvent | LoadingErrorEvent
>({
  errorMessage: ({fileReader}, {type, ...event}) => {
    console.log(
      "[stateMachine.actions]: [setErrorMessage]: Setting error message...",
    )
    if (type === "FILES") {
      return (event as FilesEvent).fileRejections.length > 1
        ? "Cannot load multiple files."
        : "File must be an image."
    } else {
      if ((event as LoadingErrorEvent).from === "FileReader") {
        fileReader.abort()
        return "Encountered an error while reading file."
      } else {
        return "Encountered an error while loading image."
      }
    }
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
  loadingProgress?: number;
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
interface LoadingProgressEvent extends EventObject {
  type: "LOADING_PROGRESS";
  loadingProgress: number;
}
interface LoadingErrorEvent extends EventObject {
  type: "LOADING_ERROR";
  from: "FileReader" | "Image";
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
  | LoadingProgressEvent
  | LoadingErrorEvent
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
      loadingProgress: undefined,
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
              LOADING_PROGRESS: {actions: "setLoadingProgress"},
              LOADING_ERROR: {target: "idle", actions: "setErrorMessage"},
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
      setLoadingProgress,
      setErrorMessage,
      clearErrorMessage,
      setImageData,
    },
  },
)

export default stateMachine
