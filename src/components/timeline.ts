import { gsap } from "gsap";

export interface State {
  progress: number;
  status: Status;
}

export type Status = "new" | "play" | "pause" | "complete";

interface Opts {
  onStatus?: (s: Status) => void;
  onProgress?: (p: number) => void;
}

export const Timeline = (opts?: Opts) => {
  const timeline = gsap.timeline({
    defaults: {
      ease: "none",
      immediateRender: false,
    },
    paused: true,
  });

  const state: State = new Proxy(
    {
      progress: 0,
      status: "new" as Status,
    },
    {
      set(obj, prop, value) {
        if (prop == "progress") {
          obj["progress"] = value;
          opts?.onProgress && opts.onProgress(value);
        }

        if (prop == "status") {
          obj["status"] = value;
          opts?.onStatus && opts.onStatus(value);
        }

        return true;
      },
    },
  );

  timeline.vars.onComplete = () => {
    state.status = "complete";
  };

  timeline.vars.onUpdate = () => {
    state.progress = timeline.progress();
  };

  const datas = () => {
    const tws = timeline.getChildren(false, true, false) as gsap.core.Tween[];
    return tws.filter((tw) => tw.data);
  };

  return {
    datas,
    pauseResume: () => {
      if (state.status == "new") {
        state.status = "play";
        timeline.play();
        return;
      }

      if (state.status == "play") {
        state.status = "pause";
        timeline.pause();
        return;
      }

      if (state.status == "pause") {
        state.status = "play";
        timeline.play();
        return;
      }

      if (state.status == "complete") {
        state.progress = 0;
        state.status = "play";
        timeline.progress(0);
        timeline.play();
        return;
      }
    },
    set opts(o: Opts) {
      opts = o;
    },
    set progress(p: number) {
      state.progress = p;
    },
    timeline,
  };
};
