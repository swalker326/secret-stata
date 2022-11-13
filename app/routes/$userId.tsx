import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

import { getUserById, updateUserGifts } from "~/models/user.server";
import { getUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const loggedInUser = await getUser(request);
  invariant(loggedInUser, "no user logged in");
  invariant(params.userId, "no id found");
  const user = await getUserById(params.userId);
  invariant(user, "user not found");
  invariant(user.recipientId, "user has no santa");
  if (loggedInUser.name !== "admin@swalker.dev") {
    throw new Error("You are not authorized to view this page");
  }
  const recipient = await getUserById(user.recipientId);
  return json({ user, recipient });
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  invariant(params.userId, "no id found");
  const user = await getUserById(params.userId);
  // const name = formData.get("name");
  const giftOne = formData.get("giftOne");
  const giftTwo = formData.get("giftTwo");
  const giftThree = formData.get("giftThree");
  if (!giftOne || !giftTwo || !giftThree) {
    const gifts = [
      { key: "giftOne", value: giftOne },
      { key: "giftTwo", value: giftTwo },
      { key: "giftThree", value: giftThree },
    ];
    return json(
      {
        errors: {
          name: null,
          gifts: gifts.filter((gift) => !gift.value).map((gift) => gift.key),
        },
      },
      { status: 400 }
    );
  }
  const list: string[] = [
    giftOne.toString(),
    giftTwo.toString(),
    giftThree.toString(),
  ];
  if (!user) {
    return json(
      {
        errors: {
          name: "User not found",
          gifts: [""],
        },
      },
      { status: 400 }
    );
  }
  await updateUserGifts({
    id: user.id,
    gifts: list,
  });
  return json({ user, errors: { name: "", gifts: [""] }, status: 200 });
}
export const meta: MetaFunction = () => {
  return {
    title: "Your Details",
  };
};
export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/assets/santa.svg",
      type: "image/svg+xml",
    },
  ];
};

export default function UserDetails() {
  const { user, recipient } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

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
      <div className="m-6 rounded bg-white p-4">
        <h1 className="text-3xl font-bold">Hi {user.name}</h1>
        <p className="py-3">
          You're <strong>{recipient?.name}'s</strong> secret santa
        </p>
        {recipient?.gifts?.items.length ? (
          <div>
            <h3 className="text-2xl md:text-2xl">
              Gift ideas for {recipient?.name}:
            </h3>
            {recipient?.gifts?.items.map((gift, index) => {
              return (
                <div key={index} className="flex flex-col">
                  <p>{gift}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>{recipient?.name} has not submitted their gift list</p>
        )}

        <div className="my-6">
          <h3 className="text-3xl">Your List</h3>
          <p>
            Add 3 gifts that you would want. Gifts should be 25 dollars or less.
          </p>
          <Form method="post" className="z-10 space-y-6 px-4" noValidate>
            <div className="z-10 mt-5 space-y-2">
              <Input
                name="giftOne"
                placeholder="Gift 1"
                type="text"
                defaultValue={user.gifts ? user.gifts?.items[0] : ""}
                error={
                  actionData?.errors?.gifts?.includes("giftOne")
                    ? { message: "Please enter a gift", isError: true }
                    : undefined
                }
              />
              <Input
                name="giftTwo"
                placeholder="Gift 2"
                type="text"
                defaultValue={user.gifts ? user.gifts?.items[1] : ""}
                error={
                  actionData?.errors?.gifts?.includes("giftTwo")
                    ? { message: "Please enter a gift", isError: true }
                    : undefined
                }
              />
              <Input
                name="giftThree"
                placeholder="Gift 3"
                type="text"
                defaultValue={user.gifts ? user.gifts?.items[2] : ""}
                error={
                  actionData?.errors?.gifts?.includes("giftThree")
                    ? { message: "Please enter a gift", isError: true }
                    : undefined
                }
                className="w-full rounded border border-gray-500 text-lg"
              />
            </div>
            <div className="relative z-10 flex justify-end">
              <Button type="submit" variant="red">
                {transition.state !== "idle" ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
