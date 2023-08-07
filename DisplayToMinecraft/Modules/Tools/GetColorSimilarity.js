//取得兩個顏色的相似度 (越低越像)
module.exports = (color, color2) => {
  let value = (Math.abs(color.r-color2.r)+Math.abs(color.g-color2.g)+Math.abs(color.r-color2.b))
  
  let mainColor = { name: undefined, value: 0 }
  if (color.r > value) mainColor = { name: 'r', value: color.r }
  if (color.g > value) mainColor = { name: 'g', value: color.g }
  if (color.b > value) mainColor = { name: 'b', value: color.b }
  if (mainColor.name !== undefined && Math.abs(color[mainColor.name]-color2[mainColor.name]) < 50) value-=50

  return value
}