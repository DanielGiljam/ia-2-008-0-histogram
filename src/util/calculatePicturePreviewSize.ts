function calculatePicturePreviewSize (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
): void {
  const picturePreview = document.getElementById("picturePreview")
  picturePreview.style.height = ""
  let {width, height} = image
  const {
    width: maxWidth,
    height: maxHeight,
  } = picturePreview.getBoundingClientRect()
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
  picturePreview.style.height = height + "px"
  canvas.getContext("2d").drawImage(image, 0, 0, width, height)
}

export default calculatePicturePreviewSize
