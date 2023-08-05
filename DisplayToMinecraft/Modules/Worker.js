const { parentPort, workerData } = require('worker_threads')

const getColorSimilarity = require('./Tools/GetColorSimilarity')

parentPort.addListener('message', (data) => {
  let chunk = []
  
  for (let i = 0; i < data.length; i++) {
    chunk.push(Object.keys(workerData).map((item) => {
      return { name: item, value: getColorSimilarity({ r: workerData[item].r, g: workerData[item].g, b: workerData[item].b }, data[i]) }
    }).sort((a, b) => a.value - b.value)[0].name)
  }

  parentPort.postMessage(chunk)
})