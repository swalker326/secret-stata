import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import {
  getUserByName,
  getUsersWithoutGifts,
  updateUserGifts,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  const users = await getUsersWithoutGifts();
  if (!users) return json({ users: [] }, { status: 404 });
  return json({ users }, { status: 200 });
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

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const giftOne = formData.get("giftOne");
  const giftTwo = formData.get("giftTwo");
  const giftThree = formData.get("giftThree");
  if (typeof name !== "string" || name.length === 0) {
    return json(
      {
        errors: {
          name: "Name is required",
          gifts: [""],
        },
      },
      { status: 400 }
    );
  }
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
  const user = await getUserByName(name);
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
}
export const meta: MetaFunction = () => {
  return {
    title: "Make Your List",
  };
};

export default function List() {
  const actionData = useActionData<typeof action>();
  const { users } = useLoaderData<typeof loader>();
  return (
    <main className="relative z-10 m-5 h-full flex-col rounded-md bg-white py-10 md:mx-0 md:flex">
      <h1 className="p-4 text-3xl md:px-10 md:text-5xl">Make your list</h1>
      <div className="text-md z-10 space-y-6 px-4 md:px-10 md:text-2xl">
        <p>
          List 3 gifts you would want, or maybe just things you're interested
          in. This will help your secret santa make your christmas merry!
        </p>
        <p className="text-sm font-light">
          Please try to keep your gifts around $25.
        </p>
        <img
          src="/assets/santa.svg"
          alt="santa"
          className="mx-auto w-1/2 md:w-1/4"
        />
      </div>
      <div>
        <Form method="post" className="z-10 space-y-6 px-4 md:px-10" noValidate>
          <h1>Your List</h1>
          <p>This is the list of your gifts, you can edit them as you want.</p>
          <div className="z-10 mt-5 space-y-2">
            <select name="name">
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
            <Input
              name="giftOne"
              placeholder="Gift 1"
              type="text"
              // error={
              //   actionData?.errors?.gifts?.includes("giftOne")
              //     ? { message: "Please enter a gift", isError: true }
              //     : undefined
              // }
            />
            <Input
              name="giftTwo"
              placeholder="Gift 2"
              type="text"
              // error={
              //   actionData?.errors?.gifts?.includes("giftTwo")
              //     ? { message: "Please enter a gift", isError: true }
              //     : undefined
              // }
            />
            <Input
              name="giftThree"
              placeholder="Gift 3"
              type="text"
              // error={
              //   actionData?.errors?.gifts?.includes("giftThree")
              //     ? { message: "Please enter a gift", isError: true }
              //     : undefined
              // }
              className="w-full rounded border border-gray-500 text-lg"
            />
          </div>
          <div className="relative z-10 flex justify-end">
            <Button type="submit" variant="red">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
