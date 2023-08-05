const { Worker } = require('worker_threads')
const { Canvas } = require('skia-canvas')
const decompress = require('decompress')
const fs = require('fs')
const os = require('os')

//轉換器
class Converter {
  #data = {}

  //加載
  async load (version) {
    if (version === undefined) version = '1.20'
    if (!fs.existsSync(getPath(__dirname, ['Data', 'Versions', `${version}.zip`]))) throw new Error(`不支援此 Minecraft 版本 (${version})`)
    
    if (!fs.existsSync(getPath(__dirname, ['Data', 'Versions', 'Resources', version])) && fs.existsSync(getPath(__dirname, ['Data', 'Versions', `${version}.zip`]))) {
      fs.mkdirSync(getPath(__dirname, ['Data', 'Versions', 'Resources', version]))
      await decompress(getPath(__dirname, ['Data', 'Versions', `${version}.zip`]), getPath(__dirname, ['Data', 'Versions', 'Resources', version]))
    }

    this.#data = await load(version)

    let workerData = {}
    Object.keys(this.#data).forEach((item) => workerData[item] = { r: this.#data[item].r, g: this.#data[item].g, b: this.#data[item].b })
    for (let i = 0; i < os.cpus().length; i++) workers[i] = new Worker(getPath(__dirname, ['Modules', 'Worker.js']), { workerData })
  }

  //轉換
  async convert (image, resolution) {
    return await convert(image, resolution)
  }

  //停止
  stopWorker () {
    this.#data = {}
    Object.keys(workers).forEach((item) => {
      workers[item].terminate()
      delete workers[item]
    })
  }

  //顯示
  display (data) {
    let canvas = new Canvas(data.width*16, data.height*16)
    let ctx = canvas.getContext('2d')

    let i = 0
    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        if (data.data[i] !== undefined) {
          ctx.drawImage(this.#data[data.data[i]].image, x*16, y*16, 16, 16)
          i++
        }
      }
    }

    canvas.saveAsSync('image.png')
  }
}

module.exports = { Converter }

const getPath = require('./Modules/Tools/GetPath')

let workers = require('./Modules/WorkerManager')
const convert = require('./Modules/Convert')
const load = require('./Modules/Load')
