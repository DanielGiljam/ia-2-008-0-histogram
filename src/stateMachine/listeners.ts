import {InvokeCreator, Sender} from "xstate"

import calculatePicturePreviewSize from "../util/calculatePicturePreviewSize"

import {StateMachineContext, StateMachineEvent} from "./index"

function fileReaderOnLoad (
  image: HTMLImageElement,
  event: ProgressEvent<FileReader>,
): void {
  console.log("[Image]: Loading image...")
  image.src = event.target.result.toString()
}

function imageOnLoad (
  image: HTMLImageElement,
  send: Sender<StateMachineEvent>,
): void {
  console.log("[Image]: Extracting image data...")
  const canvas = document.getElementById("canvas") as HTMLCanvasElement
  const canvasContext2D = canvas.getContext("2d")
  canvasContext2D.drawImage(image, 0, 0)
  send({
    type: "PICTURE_LOADED",
    imageData: canvasContext2D.getImageData(0, 0, image.width, image.height),
  })
  console.log("[Image]: Calculating picture preview size...")
  calculatePicturePreviewSize(image, canvas)
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
    fileReader.addEventListener("load", (event) =>
      fileReaderOnLoad(image, event),
    )
    image.addEventListener("load", () => imageOnLoad(image, callback))
    window.addEventListener("resize", () => windowOnResize(image))
    return (): void => {
      console.log(
        "[stateMachine.activities]: [listeners]: Removing listeners...",
      )
      fileReader.removeEventListener("load", (event) =>
        fileReaderOnLoad(image, event),
      )
      image.removeEventListener("load", () => imageOnLoad(image, callback))
      window.removeEventListener("resize", () => windowOnResize(image))
    }
  }
  console.log(
    "[stateMachine.activities]: [listeners]: Unable to add listeners to FileReader and Image because they are not defined. (This log message should only be displayed in non-browser environments.)",
  )
}

export default listeners
