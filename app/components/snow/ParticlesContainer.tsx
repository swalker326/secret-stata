// import React from "react";
// import Particles from "react-tsparticles";
// import { snowConfig } from "./snowConfig";

// export const Snow = () => <Particles id="tsparticles" options={snowConfig} />;

import React from "react";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadSnowPreset } from "tsparticles-preset-snow";
import { snowConfig } from "./snowConfig";

export class ParticlesContainer extends React.PureComponent {
  // this customizes the component tsParticles installation
  async customInit(engine: Engine): Promise<void> {
    // this adds the preset to tsParticles, you can safely use the
    await loadSnowPreset(engine);
  }

  render() {
    // const options = {
    //   preset: "snow",
    // };

    return <Particles options={snowConfig} init={this.customInit} />;
  }
}
