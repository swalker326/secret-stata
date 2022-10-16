import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { deleteList, getList, updateList } from "~/models/list.server";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import { Input } from "~/components/Input";
import { Button } from "~/components/Button";
import { useState } from "react";

export async function loader({ request, params }: LoaderArgs) {
  await requireUserId(request);
  const id = params.listId;
  invariant(params.listId, "noteId not found");

  const list = await getList({ id: params.listId });
  if (!list) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ list, id });
}

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  invariant(params.listId, "noteId not found");
  const giftOne = formData.get("gift-0");
  const giftTwo = formData.get("gift-1");
  const giftThree = formData.get("gift-2");
  const action = formData.get("action");
  if (!giftOne || !giftTwo || !giftThree) {
    return json({ error: "Please fill out all fields" }, { status: 400 });
  }
  if (action === "delete") {
    await deleteList({ id: params.listId });
    return redirect("/lists/view");
  }
  const update = await updateList({
    id: params.listId,
    gifts: [giftOne.toString(), giftTwo.toString(), giftThree.toString()],
  });
  console.log("update :", update); ////eslint disable line ##DEBUG
  return redirect(`/lists/${params.listId}`);
};

export default function ListDetails() {
  const { list } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [formAction, setFormAction] = useState<"update" | "delete">("update");
  return (
    <div className="flex w-full flex-col items-center rounded-md">
      <div className="rounded-md bg-white p-5">
        <h3 className="text-4xl">{list.name}</h3>
        <Form reloadDocument method="post" className="m-auto space-y-3">
          {list.gifts.map((gift, i) => {
            return <Input key={i} name={`gift-${i}`} defaultValue={gift} />;
          })}
          <input type="hidden" name="action" value={formAction} />
          <div className="flex justify-between">
            <Button onClick={() => setFormAction("update")}>Update</Button>
            <Button onClick={() => setFormAction("delete")} variant="red">
              Delete
            </Button>
          </div>
          {actionData?.error && (
            <div className="text-red-500">Error: {actionData.error}</div>
          )}
        </Form>
      </div>
    </div>
  );
}
