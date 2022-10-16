import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getLists } from "~/models/list.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  await requireUserId(request);
  const lists = await getLists();
  if (!lists) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ lists });
}

export default function ViewLists() {
  const { lists } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-wrap text-red-500">
      {lists.length > 0 ? (
        lists.map((list) => (
          <div className="my-3 w-1/2 md:w-1/4" key={list.id}>
            <div className="h-min- mx-3 h-full rounded-md bg-slate-50 p-2 drop-shadow-lg">
              <h2 className="text-2xl">
                {list.name.charAt(0).toUpperCase() +
                  list.name.split(" ")[0].slice(1)}
              </h2>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <ol className="ml-3 list-decimal">
                {list.gifts.map((gift, i) => (
                  <li key={i} className="m-1">
                    {gift}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white w-full rounded-md p-3">
            <h2 className="text-2xl">No lists yet</h2>
            <p>Lists will be populated here so you can see what the person you got wants</p>
        </div>
      )}
    </div>
  );
}
