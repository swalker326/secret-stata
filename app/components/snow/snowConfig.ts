export const snowConfig = {
  background: {
    color: "#000000",
  },
  particles: {
    color: { value: "#fff" },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 400,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: 10,
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 10,
    },
    zIndex: {
      value: { min: 0, max: 0 },
    },
  },
};
