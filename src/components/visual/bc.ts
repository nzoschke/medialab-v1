import { throttle } from "@components/util";

// Visualizer does a dynamic import
export const Visualiser = async (context: AudioContext, node: AudioNode, canvas: HTMLCanvasElement) => {
  const { Visualizer } = await import("@components/visual/Butterchurn");
  const viz = Visualizer(context, node, canvas);
  new ResizeObserver(
    throttle(() => {
      viz.resize(window.innerWidth, window.innerHeight);
    }, 500),
  ).observe(canvas);
};
