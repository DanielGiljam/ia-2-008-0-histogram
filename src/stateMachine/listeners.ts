import {InvokeCreator, Sender} from "xstate"

import calculatePicturePreviewSize from "../util/calculatePicturePreviewSize"

import {StateMachineContext, StateMachineEvent} from "./index"

function fileReaderOnLoadStart (send: Sender<StateMachineEvent>): void {
  send({type: "LOADING_PROGRESS", loadingProgress: 0})
}

function fileReaderOnProgress (
  send: Sender<StateMachineEvent>,
  event: ProgressEvent<FileReader>,
): void {
  send({
    type: "LOADING_PROGRESS",
    loadingProgress: (event.loaded / (event.total * 2)) * 100,
  })
}

function fileReaderOnError (send: Sender<StateMachineEvent>): void {
  send({type: "LOADING_ERROR", from: "FileReader"})
}

function fileReaderOnLoad (
  image: HTMLImageElement,
  send: Sender<StateMachineEvent>,
  event: ProgressEvent<FileReader>,
): void {
  send({
    type: "LOADING_PROGRESS",
    loadingProgress: 50,
  })
  console.log("[Image]: Loading image...")
  image.src = event.target.result.toString()
}

function imageOnProgress (
  send: Sender<StateMachineEvent>,
  event: ProgressEvent<EventTarget>,
): void {
  send({
    type: "LOADING_PROGRESS",
    loadingProgress: ((event.total + event.loaded) / (event.total * 2)) * 100,
  })
}

function imageOnError (send: Sender<StateMachineEvent>): void {
  send({type: "LOADING_ERROR", from: "Image"})
}

function imageOnLoad (
  image: HTMLImageElement,
  send: Sender<StateMachineEvent>,
): void {
  send({type: "LOADING_PROGRESS", loadingProgress: 100})
  console.log(
    "[Image]: Calculating picture preview size and extracting image data...",
  )
  const canvas = document.getElementById("canvas") as HTMLCanvasElement
  calculatePicturePreviewSize(image, canvas)
  send({
    type: "PICTURE_LOADED",
    imageData: canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height),
  })
}

function windowOnResize (image: HTMLImageElement): void {
  if (!image.width || !image.height) return
  const canvas = document.getElementById("canvas") as HTMLCanvasElement
  console.log("[window.onresize]: Calculating picture preview size...")
  calculatePicturePreviewSize(image, canvas)
}

const listeners: InvokeCreator<StateMachineContext, StateMachineEvent> = ({
  fileReader,
  image,
}) => (callback): (() => void) | void => {
  if (fileReader && image) {
    console.log("[stateMachine.activities]: [listeners]: Adding listeners...")
    fileReader.addEventListener("loadstart", () =>
      fileReaderOnLoadStart(callback),
    )
    fileReader.addEventListener("progress", (event) =>
      fileReaderOnProgress(callback, event),
    )
    fileReader.addEventListener("error", () => fileReaderOnError(callback))
    fileReader.addEventListener("load", (event) =>
      fileReaderOnLoad(image, callback, event),
    )
    image.addEventListener("progress", (event) =>
      imageOnProgress(callback, event),
    )
    image.addEventListener("error", () => imageOnError(callback))
    image.addEventListener("load", () => imageOnLoad(image, callback))
    window.addEventListener("resize", () => windowOnResize(image))
    return (): void => {
      console.log(
        "[stateMachine.activities]: [listeners]: Removing listeners...",
      )
      fileReader.removeEventListener("loadstart", () =>
        fileReaderOnLoadStart(callback),
      )
      fileReader.removeEventListener("progress", (event) =>
        fileReaderOnProgress(callback, event),
      )
      fileReader.removeEventListener("error", () => fileReaderOnError(callback))
      fileReader.removeEventListener("load", (event) =>
        fileReaderOnLoad(image, callback, event),
      )
      image.removeEventListener("progress", (event) =>
        imageOnProgress(callback, event),
      )
      image.removeEventListener("error", () => imageOnError(callback))
      image.removeEventListener("load", () => imageOnLoad(image, callback))
      window.removeEventListener("resize", () => windowOnResize(image))
    }
  }
  console.log(
    "[stateMachine.activities]: [listeners]: Unable to add listeners to FileReader and Image because they are not defined. (This log message should only be displayed in non-browser environments.)",
  )
}

export default listeners
