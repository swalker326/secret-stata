import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/Input";
import { addList } from "~/models/list.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  return {};
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

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const giftOne = formData.get("giftOne");
  const giftTwo = formData.get("giftTwo");
  const giftThree = formData.get("giftThree");
  const giftFour = formData.get("giftFour");
  const giftFive = formData.get("giftFive");
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
  const gifts: string[] = [
    giftOne.toString(),
    giftTwo.toString(),
    giftThree.toString(),
  ];
  if (giftFour) gifts.push(giftFour.toString());
  if (giftFive) gifts.push(giftFive.toString());
  await addList({
    name,
    gifts: gifts,
  });
  return redirect("/lists/view");
}
export const meta: MetaFunction = () => {
  return {
    title: "Gift List",
  };
};

export default function List() {
  const actionData = useActionData<typeof action>();
  return (
    <main className="relative z-10 m-5 h-full flex-col rounded-md bg-white py-10 md:mx-0 md:flex ">
      <h1 className="p-4 text-3xl md:px-10 md:text-5xl">Make your list</h1>
      <div className="text-md z-10 space-y-6 px-4 md:px-10 md:text-2xl">
        <p>
          List 3 - 5 gifts you would want, or maybe just things you're
          interested in. This will help whoever draws you in the secret santa
          get you a gift you might enjoy a little more
        </p>
        <p>
          There is room to put 5 things, but you only need to put 3. Please try
          to keep your gifts around $25.
        </p>
      </div>
      <div>
        <Form method="post" className="z-10 space-y-6 px-4 md:px-10" noValidate>
          <div className="z-10 mt-5 space-y-2">
            <Input
              name="name"
              placeholder="Who are you?"
              type="text"
              error={
                actionData?.errors?.name
                  ? {
                      isError: true,
                      message: "Please enter your name",
                    }
                  : undefined
              }
            />
            <Input
              name="giftOne"
              placeholder="Gift 1"
              type="text"
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
              error={
                actionData?.errors?.gifts?.includes("giftThree")
                  ? { message: "Please enter a gift", isError: true }
                  : undefined
              }
              className="w-full rounded border border-gray-500 text-lg"
            />
            <Input name="giftFour" placeholder="Gift 4" type="text" />

            <Input name="giftFive" placeholder="Gift 5" type="text" />
          </div>
          <div className="relative flex justify-end z-10">
            <img
              src="/assets/santa.svg"
              alt="santa"
              className="absolute top-[-140px] z-0 h-[150px] "
            />
            <button className="mt-3 items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-300 sm:px-8">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
