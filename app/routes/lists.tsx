import { Link, Outlet } from "@remix-run/react";
import { Button } from "~/components/Button";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { CountDown } from "~/components/Countdown";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/assets/Snowman.svg",
      type: "image/svg+xml",
    },
  ];
};
export const meta: MetaFunction = () => {
  return {
    title: "Gift Lists",
  };
};

export default function Lists() {
  return (
    <>
      <div id="lists" className="relative">
        <div className="w-full">
          <div className="bg-red-500 py-5 ">
            <div className="flex items-center">
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
            </div>
          </div>
          <div className="container mx-auto">
            <CountDown />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
