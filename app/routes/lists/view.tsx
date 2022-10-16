import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { getLists } from "~/models/list.server";
import { requireUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);
  const lists = await getLists();
  if (!lists) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ lists, user });
}
export const meta: MetaFunction = () => {
  return {
    title: "View Lists",
  };
};

export default function ViewLists() {
  const { lists, user } = useLoaderData<typeof loader>();
  const isAdmin = user.email === 'admin@swalker.dev'
  const [columns, setColumns] = useState<{
    col1?: React.ReactNode[];
    col2?: React.ReactNode[];
    col3?: React.ReactNode[];
  }>();
  useEffect(() => {
    const columnsObj = lists.reduce(
      (acc, list, index) => {
        const component: React.ReactNode = (
          <div className="py-2" key={list.id}>
            {
              isAdmin && <a href={`/lists/${list.id}`}>edit</a>
            }
            <div className="rounded-md bg-slate-50 p-3 pl-5 drop-shadow-lg">
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
        );
        if (index % 3 === 0) {
          acc.col1.push(component);
        } else if (index % 3 === 1) {
          acc.col2.push(component);
        } else {
          acc.col3.push(component);
        }
        return acc;
      },
      { col1: [], col2: [], col3: [] } as {
        col1: React.ReactNode[];
        col2: React.ReactNode[];
        col3: React.ReactNode[];
      }
    );
    setColumns(columnsObj);
  }, [lists]);
  return (
    <div className="text-red-500">
      <div className="flex flex-col md:flex-row">
        <div className="w-full flex-col px-2 md:w-1/3">
          {columns?.col1 && columns.col1.map((c) => c)}
        </div>
        <div className="flex w-full flex-col px-2 md:w-1/3">
          {columns?.col2 && columns.col2.map((c) => c)}
        </div>
        <div className="flex w-full flex-col px-2 md:w-1/3">
          {columns?.col3 && columns.col3.map((c) => c)}
        </div>
      </div>
      {lists.length < 1 && (
        <div className="w-full flex justify-center">
          <div className="mx-2 rounded-md bg-white p-3">
            <h2 className="text-2xl">No lists yet</h2>
            <p>
              Lists will be populated here so you can see what the person you
              got wants
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
