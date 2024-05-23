import butterchurn from "butterchurn";

/**
 * @callback fetchPreset
 * @param {string} path - Path to .json
 * @param {number=} seconds - Seconds to blend between presets
 * @returns {Promise<void>}
 */

/**
 * @callback resize
 * @param {number} width - Width
 * @param {number} height - Height
 * @returns {void}
 */

/**
 * @typedef {Object} Viz
 * @property {fetchPreset} fetchPreset
 * @property {resize} resize
 */

/**
 * @param {AudioContext} audioContext - AudioContext
 * @param {AudioNode} audioNode - AudioNode
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {Viz}
 */
export const Visualizer = (audioContext, audioNode, canvas) => {
  console.log(`canvas width=${canvas.width} height=${canvas.height}`);

  const viz = butterchurn.createVisualizer(audioContext, canvas, {
    width: canvas.width,
    height: canvas.height,
    pixelRatio: 1,
  });
  viz.connectAudio(audioNode);

  function animate() {
    requestAnimationFrame(() => animate());
    viz.render();
  }
  animate();

  const fetchPreset = async (path, seconds) => {
    path = path.replace(/#/g, "%23");
    const res = await fetch(path);
    const data = await res.json();
    const s = seconds === undefined ? 5.2 : seconds;
    viz.loadPreset(data, s);
  };

  const resize = (width, height) => {
    console.log(`resize width=${width} height=${height}`);
    canvas.width = width;
    canvas.height = height;
    viz.setRendererSize(width, height);
  };

  return {
    fetchPreset,
    resize,
  };
};
