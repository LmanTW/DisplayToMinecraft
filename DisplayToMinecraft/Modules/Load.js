const { Canvas, loadImage } = require('skia-canvas')
const path = require('path')
const fs = require('fs')

module.exports = async (version) => {
  let data = {}

  for (let item of fs.readdirSync(getPath(__dirname, ['<', 'Data', 'Versions', 'Resources', version]))) {
    let name = path.parse(item).name
    if (path.extname(item) === '.png' && !name.includes('sunflower') && !name.includes('campfire_log') && (filterData.map((item2) => `${name}.`.includes(item2))).includes(true)) {
      let image = await loadImage(getPath(__dirname, ['<', 'Data', 'Versions', 'Resources', version, item]))
      let ctx = new Canvas(item.width, item.height).getContext('2d')

      ctx.drawImage(image, 0, 0)

      let imageData = ctx.getImageData(0, 0, image.width, image.height).data
      let r = 0, g = 0, b = 0
      for (let i = 0; i < imageData.length; i+=4) {
        r+=imageData[i]
        g+=imageData[i+1]
        b+=imageData[i+2]
      }

      data[name] = { image, r: r/(image.width*image.height), g: g/(image.width*image.height), b: b/(image.width*image.height) }
    }
  }

  return data
}

const getPath = require('./Tools/GetPath')

const filterData = require('../Data/FilterData.json')