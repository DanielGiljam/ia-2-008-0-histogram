import {ActionFunction, EventObject, Machine, assign} from "xstate"

import {FileRejection} from "react-dropzone"

import listeners from "./listeners"

// #region ACTION IMPLEMENTATIONS

const loadPicture: ActionFunction<PictureLoaderContext, AcceptEvent> = (
  {fileReader},
  {picture},
) => {
  console.log(
    "[pictureLoader.actions]: [loadPicture]: Reading picture as data URL...",
  )
  fileReader.readAsDataURL(picture)
}

const setErrorMessages = assign<PictureLoaderContext, RejectEvent>({
  errorMessages: ({errorMessages}, {fileRejections}) => {
    console.log(
      "[pictureLoader.actions]: [setErrorMessages]: Creating error messages...",
    )
    return [
      ...errorMessages,
      ...fileRejections.map(
        ({file, errors}) =>
          `File name: "${file.name}", ${
            errors.length > 1
              ? `reasons: ${errors
                  .map(({message}) => `"${message}"`)
                  .join(", ")}`
              : `reason: "${errors[0].message}"`
          }`,
      ),
    ]
  },
})

const setImageData = assign<PictureLoaderContext, PictureLoadedEvent>({
  imageData: (_context, {imageData}) => {
    console.log(
      "[pictureLoader.actions]: [setImageData]: Setting image data...",
    )
    return imageData
  },
})

// #endregion

// #region TYPES

export interface PictureLoaderContext {
  fileReader?: FileReader;
  image?: HTMLImageElement;
  imageData?: ImageData;
  errorMessages: string[];
}

export interface PictureLoaderSchema {
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
interface PictureLoadedEvent extends EventObject {
  type: "PICTURE_LOADED";
  imageData: ImageData;
}

// #endregion

export type PictureLoaderEvent =
  | DragoverEvent
  | AcceptEvent
  | RejectEvent
  | PictureLoadedEvent

// #endregion

const pictureLoaderMachine = Machine<
  PictureLoaderContext,
  PictureLoaderSchema,
  PictureLoaderEvent
>(
  {
    id: "pictureLoader",
    type: "parallel",
    context: {
      fileReader:
        typeof FileReader !== "undefined" ? new FileReader() : undefined,
      image: typeof Image !== "undefined" ? new Image() : undefined,
      imageData: undefined,
      errorMessages: [],
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
      REJECT: {target: ".pictureLoader.idle", actions: "setErrorMessages"},
    },
    invoke: {
      id: "listeners",
      src: listeners,
    },
  },
  {
    actions: {
      loadPicture,
      setErrorMessages,
      setImageData,
    },
  },
)

export default pictureLoaderMachine
