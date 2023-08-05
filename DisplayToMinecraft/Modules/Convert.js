const { Canvas } = require('skia-canvas')
const os = require('os')

//轉換
module.exports = async (image, resolution) => {
  return new Promise((resolve) => {
    if (resolution === undefined) resolution = 0.1

    let ctx =  new Canvas(Math.trunc(image.width*resolution), Math.trunc(image.height*resolution)).getContext('2d')
    ctx.drawImage(image, 0, 0, Math.trunc(image.width*resolution), Math.trunc(image.height*resolution))

    let imageData = ctx.getImageData(0, 0, Math.trunc(image.width*resolution), Math.trunc(image.height*resolution)).data
    let data = []
    for (let i = 0; i < imageData.length; i+=4) data.push({ r: imageData[i], g: imageData[i+1], b: imageData[i+2] })
    let chunkSize = data.length/os.cpus().length

    let chunkComplete = {}
    let id = 0
    for (let i = 0; i < data.length; i+=chunkSize) {
      let workerID = id

      workers[id].postMessage(data.slice(i, i+chunkSize))
      workers[id].addListener('message', (data2) => {
        chunkComplete[workerID] = data2
        
        if (Object.keys(chunkComplete).length >= os.cpus().length) {
          let fullData = []
          for (let i2 = 0; i2 < os.cpus().length; i2++) fullData = fullData.concat(chunkComplete[i2])
          resolve({ width: Math.trunc(image.width*resolution), height: Math.trunc(image.height*resolution), data: fullData })
        }
      }, { once: true })
      id++
    }
  })
}

const workers = require('./WorkerManager')