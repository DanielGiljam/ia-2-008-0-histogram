import {useCallback, useEffect, useState} from "react"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import InsertPhotoRoundedIcon from "@material-ui/icons/InsertPhotoRounded"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import clsx from "clsx"

import {useDropzone} from "react-dropzone"

import {breakpoint as bp} from "../src/theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      alignItems: "center",
      backgroundColor: theme.palette.grey[100],
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      maxHeight: theme.breakpoints.values[bp] * 0.3,
      maxWidth: theme.breakpoints.values[bp] * 0.4,
      padding: theme.spacing(2),
      width: "100%",
      "& > canvas": {
        position: "absolute",
      },
      "&:hover": {
        backgroundColor: theme.palette.grey[200],
        cursor: "pointer",
        "& > canvas": {
          opacity: theme.palette.action.focusOpacity,
          transition: theme.transitions.create("opacity"),
        },
        "& > :not(canvas)": {
          zIndex: 1,
        },
      },
    },
    paperDragActive: {
      backgroundColor: theme.palette.grey[200],
      cursor: "copy",
      "& > svg": {
        animation: `${
          theme.transitions.duration.complex * 2
        }ms infinite linear alternate $iconDragActiveAnimation`,
        fontSize: theme.typography.h1.fontSize,
      },
      "& > canvas": {
        opacity: theme.palette.action.focusOpacity,
        transition: theme.transitions.create("opacity"),
      },
      "& > :not(canvas)": {
        zIndex: 1,
      },
    },
    "@keyframes iconDragActiveAnimation": {
      from: {
        transform: "scale(0.75)",
      },
      to: {
        transform: "scale(1)",
      },
    },
  }),
)

let fileReader: FileReader
let image: HTMLImageElement

function onDropAccepted ([picture]: File[]): void {
  fileReader.readAsDataURL(picture)
}

function fileReaderOnLoad (event: ProgressEvent<FileReader>): void {
  image.src = event.target.result.toString()
}

function Index (): JSX.Element {
  const [imageData, setImageData] = useState<ImageData | undefined>()
  const styles = useStyles()
  const onDropRejected = useCallback((rejects) => {
    // TODO: display in UI when files are rejected
    console.log("[onDropRejected]: Following files were rejected:", rejects)
  }, [])
  const imageOnLoad = useCallback(() => {
    const paper = document.getElementById("paper")
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    const paperRect = paper.getBoundingClientRect()
    const canvasContext2D = canvas.getContext("2d")
    canvasContext2D.drawImage(image, 0, 0)
    const imageData = canvasContext2D.getImageData(
      0,
      0,
      image.width,
      image.height,
    )
    // TODO: resize canvas when document resizes
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
    setImageData(imageData)
  }, [])
  useEffect(() => {
    fileReader = new FileReader()
    image = new Image()
    fileReader.addEventListener("load", fileReaderOnLoad)
    image.addEventListener("load", imageOnLoad)
    return (): void => {
      fileReader.removeEventListener("load", fileReaderOnLoad)
      image.removeEventListener("load", imageOnLoad)
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: "image/*",
    multiple: false,
    onDropAccepted,
    onDropRejected,
    preventDropOnDocument: true,
  })
  return (
    <Paper
      className={clsx(styles.paper, isDragActive && styles.paperDragActive)}
      id={"paper"}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <canvas hidden={!imageData} id={"canvas"}></canvas>
      <InsertPhotoRoundedIcon color={"action"} fontSize={"large"} />
      <Typography
        align={"center"}
        color={"textSecondary"}
        component={"span"}
        noWrap
      >
        Drag and drop a picture
        {isDragActive ? undefined : (
          <>
            <br />
            or click to load a picture manually
          </>
        )}
      </Typography>
    </Paper>
  )
}

export default Index
