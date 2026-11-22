function constrainSheetPosition(offset, viewportExtent, imageExtent) {
  if (imageExtent <= viewportExtent) return (viewportExtent - imageExtent) / 2;
  return Math.min(0, Math.max(viewportExtent - imageExtent, offset));
}

function anchorSheetZoom(start, nextScale, from, to = from) {
  const ratio = nextScale / start.scale;
  return {
    scale: nextScale,
    x: to.x - (from.x - start.x) * ratio,
    y: to.y - (from.y - start.y) * ratio
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { constrainSheetPosition, anchorSheetZoom };
}
