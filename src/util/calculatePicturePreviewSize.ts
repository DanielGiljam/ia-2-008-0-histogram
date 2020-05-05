function calculatePicturePreviewSize (
  image: HTMLImageElement,
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
  canvas: HTMLCanvasElement,
  canvasContext2D: CanvasRenderingContext2D,
): void {
  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width
      width = maxWidth
    }
    if (height > maxHeight) {
      width *= maxHeight / height
      height = maxHeight
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height
      height = maxHeight
    }
    if (width > maxWidth) {
      height *= maxWidth / width
      width = maxWidth
    }
  }
  canvas.width = width
  canvas.height = height
  canvasContext2D.drawImage(image, 0, 0, width, height)
}

export default calculatePicturePreviewSize
