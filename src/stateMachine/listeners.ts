import {InvokeCreator, Sender} from "xstate"

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
  // TODO: resize canvas when document resizes
  const paper = document.getElementById("paper")
  const paperRect = paper.getBoundingClientRect()
  const maxWidth = paperRect.width - 2
  const maxHeight = paperRect.height - 2
  let width = image.width
  let height = image.height
  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width
      width = maxWidth
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height
      height = maxHeight
    }
  }
  canvas.width = width
  canvas.height = height
  canvasContext2D.drawImage(image, 0, 0, width, height)
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
    return (): void => {
      console.log(
        "[stateMachine.activities]: [listeners]: Removing listeners...",
      )
      fileReader.removeEventListener("load", (event) =>
        fileReaderOnLoad(image, event),
      )
      image.removeEventListener("load", () => imageOnLoad(image, callback))
    }
  }
  console.log(
    "[stateMachine.activities]: [listeners]: Unable to add listeners to FileReader and Image because they are not defined. (This log message should only be displayed in non-browser environments.)",
  )
}

export default listeners
