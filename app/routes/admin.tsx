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

export default function Admin() {
  const { usersWithSantas } = useLoaderData<typeof loader>();
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
      <div className=" mt-4 flex w-1/2 flex-col items-center rounded-lg bg-white p-6">
        <h1 className="text-5xl">Admin</h1>
        <h3>Santas: {new Set(usersWithSantas).size}</h3>
        <h3>
          Recipients: {new Set(usersWithSantas.filter((u) => u.santa)).size}
        </h3>
        <div className="w-full">
          <table>
            <tr className="border-t-2 border-r-2 border-l-2 border-black p-1">
              <th className="border-r-2 border-black text-left">Santa</th>
              <th className="border-l-2 border-black p-1 text-left">
                Recipient
              </th>
            </tr>
            {usersWithSantas
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
          </table>
        </div>
      </div>
    </div>
  );
}
