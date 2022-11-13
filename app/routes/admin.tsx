import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUserById, getUsers } from "~/models/user.server";
import { requireUser } from "~/session.server";
import { Button } from "~/components/Button";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  if (user.name !== "admin@swalker.dev") {
    invariant(false, "You are not authorized to view this page");
  }
  const users = await getUsers();
  // if (!users) return json({ users: [] }, { status: 404 });
  invariant(users, "Something went wrong, we can't find any users");
  const usersWithSantas = await Promise.all(
    users.map(async (user) => {
      if (!user.santaId) return { ...user, santa: null };
      const santa = await getUserById(user.santaId);
      return santa ? { ...user, santa } : { ...user, santa: null };
    })
  );
  return json({ usersWithSantas }, { status: 200 });
}

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/assets/santa.svg",
      type: "image/svg+xml",
    },
  ];
};

export default function Admin() {
  const { usersWithSantas: users } = useLoaderData<typeof loader>();
  const usersWithSantas = users.filter(
    (user) => user.name !== "admin@swalker.dev"
  );
  return (
    <div className="relative">
      <div className="bg-red-500 py-5 ">
        <div className="flex items-center justify-between">
          <img
            src="/assets/Snowman.svg"
            alt="Snowman"
            className="w-1/6 md:w-1/12"
          />
          <Form method="post" action="/logout">
            <Button className="mr-2" type="submit">
              Logout
            </Button>
          </Form>
        </div>
      </div>
      <div className=" mt-4 flex flex-col items-center rounded-lg bg-white p-6">
        <h1 className="text-5xl">Admin</h1>
        <h3>Santas: {new Set(usersWithSantas).size}</h3>
        <h3>
          Recipients: {new Set(usersWithSantas.filter((u) => u.santa)).size}
        </h3>
        <div className="flex w-full flex-wrap">
          {usersWithSantas.map(({ santa, name, id, gifts }) => {
            return (
              <div key={id} className="w-1/3">
                <div className="bg-gray-100 m-2 p-2 rounded-md">
                  <div className="p-1 text-xl underline">
                    <Link to={`/${id}`}>{name}</Link>
                  </div>
                  <div className="p-1">
                    <strong className="font-light">Santa:</strong> {santa?.name}
                  </div>
                  {gifts?.items && gifts.items.length > 0 ? (
                    <ul className="list-disc">
                      <h2 className="p-1 font-bold">Gifts</h2>
                      {gifts?.items.map((gift, index) => {
                        return (
                          <li className="ml-4" key={index}>
                            {gift}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="p-1">No gifts yet</div>
                  )}
                </div>
              </div>
            );
          })}
          {/* {usersWithSantas
              // .filter((users) => users.)
              .map(({ name, santa, id }) => (
                <tr key={name} className="border-2 border-black">
                  <td className="border-l-2 border-black p-1">
                    {santa && (
                      <Link to={`/${id}`}>
                        <span className="text-lg">{santa.name}</span>
                      </Link>
                    )}
                  </td>
                  <td className="border-l-2 border-black p-1">
                    <span className="text-lg">{name}</span>
                  </td>
                </tr>
              ))}
          </table> */}
        </div>
      </div>
    </div>
  );
}
