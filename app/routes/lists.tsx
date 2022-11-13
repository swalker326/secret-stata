import { Form, Link, Outlet } from "@remix-run/react";
import { Button } from "~/components/Button";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { CountDown } from "~/components/Countdown";
import { logout } from "~/session.server";

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
              <Button>
                <Link to="/lists/make">Make Your List</Link>
              </Button>
              <Button>
                <Link to="/lists/view">View Lists</Link>
              </Button>
            </div>

            <Form method="post" action="/logout">
              <Button type="submit">Logout</Button>
            </Form>
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
