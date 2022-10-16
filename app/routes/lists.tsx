import { Link, Outlet } from "@remix-run/react";
import { Button } from "~/components/Button";
import type { LinksFunction } from "@remix-run/node";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/assets/Snowman.svg",
      type: "image/svg+xml",
    },
  ];
};

export default function Lists() {
  const [countDown, setCountDown] = useState(
    intervalToDuration({
      start: new Date(),
      end: new Date("12/25/2022"),
    })
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(
        intervalToDuration({
          start: new Date(),
          end: new Date("12/25/2022"),
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <>
      <div id="lists" className="relative">
        <div className="w-full">
          <div className="flex w-full items-center bg-red-500 py-5 ">
            <img
              src="/assets/Snowman.svg"
              alt="Snowman"
              className="w-1/6 md:w-1/12"
            />
            {/* <h1 className="mx-5 text-2xl font-bold text-white md:text-5xl">
              Lists
            </h1> */}
            <Button>
              <Link to="/lists/make">Make Your List</Link>
            </Button>
            <Button>
              <Link to="/lists/view">View Lists</Link>
            </Button>
            <div className="hidden space-x-1 md:flex">
              {countDown.months && countDown.months > 0 && (
                <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
                  <p className="text-2xl font-bold">
                    {countDown.months.toString().length === 1
                      ? countDown.months.toString().padStart(2, "0")
                      : countDown.months}
                  </p>
                  <p className="text-sm font-light">Months</p>
                </div>
              )}
              {countDown.days && countDown.days > 0 && (
                <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
                  <p className="text-2xl font-bold">
                    {countDown.days.toString().length === 1
                      ? countDown.days.toString().padStart(2, "0")
                      : countDown.days}
                  </p>
                  <p className="text-sm font-light">Days</p>
                </div>
              )}
              {countDown.minutes && countDown.minutes > 0 && (
                <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
                  <p className="text-2xl font-bold">
                    {countDown.minutes.toString().length < 2
                      ? countDown.minutes.toString().padStart(2, "0")
                      : countDown.minutes}
                  </p>
                  <p className="text-sm font-light">Minutes</p>
                </div>
              )}
              {countDown.seconds && (
                <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
                  <p className="text-2xl font-bold">
                    {countDown.seconds.toString().length < 2
                      ? countDown.seconds.toString().padStart(2, "0")
                      : countDown.seconds}
                  </p>
                  <p className="text-sm font-light">Seconds</p>
                </div>
              )}
            </div>
          </div>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

// import { useCallback } from "react";
// import type { Container, Engine } from "tsparticles-engine";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";

// const App = () => {
//   const particlesInit = useCallback(async (engine: Engine) => {
//     console.log(engine);

//     // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
//     // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
//     // starting from v2 you can add only the features you need reducing the bundle size
//     await loadFull(engine);
//   }, []);

//   const particlesLoaded = useCallback(
//     async (container: Container | undefined) => {
//       await console.log(container);
//     },
//     []
//   );
//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       loaded={particlesLoaded}
//       options={{
//         background: {
//           color: {
//             value: "#0d47a1",
//           },
//         },
//         fpsLimit: 120,
//         interactivity: {
//           events: {
//             onClick: {
//               enable: true,
//               mode: "push",
//             },
//             onHover: {
//               enable: true,
//               mode: "repulse",
//             },
//             resize: true,
//           },
//           modes: {
//             push: {
//               quantity: 4,
//             },
//             repulse: {
//               distance: 200,
//               duration: 0.4,
//             },
//           },
//         },
//         particles: {
//           color: {
//             value: "#ffffff",
//           },
//           links: {
//             color: "#ffffff",
//             distance: 150,
//             enable: true,
//             opacity: 0.5,
//             width: 1,
//           },
//           collisions: {
//             enable: true,
//           },
//           move: {
//             direction: "none",
//             enable: true,
//             outModes: {
//               default: "bounce",
//             },
//             random: false,
//             speed: 6,
//             straight: false,
//           },
//           number: {
//             density: {
//               enable: true,
//               area: 800,
//             },
//             value: 80,
//           },
//           opacity: {
//             value: 0.5,
//           },
//           shape: {
//             type: "circle",
//           },
//           size: {
//             value: { min: 1, max: 5 },
//           },
//         },
//         detectRetina: true,
//       }}
//     />
//   );
// };
