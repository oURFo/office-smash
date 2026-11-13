// The preview and printed mark share these exact geometry values.
export function stampGeometry(size,angle,canvasWidth,displayWidth){
  return {size:Number(size)*canvasWidth/Math.max(1,displayWidth),angle:Number(angle)};
}
