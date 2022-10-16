import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";
import * as React from "react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/lists/make");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = "shane@swalker.dev";
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/list/make");

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required", email: null } },
      { status: 400 }
    );
  }
  const authenticated = await verifyLogin(email, password);

  if (!authenticated) {
    return json({ errors: { password: "Invalid password" } }, { status: 400 });
  }

  return createUserSession({
    request,
    userId: authenticated.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
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

export default function Auth() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/lists/make";
  const actionData = useActionData<typeof action>();
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="relative h-full w-full">
      <div className="flex h-20 w-full items-center bg-red-500">
        <h1 className="ml-3 text-2xl font-bold text-white md:text-5xl">
          Magrini Secret Santa
        </h1>
      </div>
      <div className="flex h-full justify-center p-5">
        <Form
          method="post"
          noValidate
          className=" m-3 flex h-20 justify-center rounded-md bg-white p-5 align-middle"
        >
          <div className="flex">
            <Input
              className="w-[100%]"
              placeholder="Password"
              name="password"
              id="password"
              ref={passwordRef}
              type="password"
              error={
                actionData?.errors?.password
                  ? { isError: true, message: "Enter a valid password" }
                  : undefined
              }
              aria-describedby="password-error"
            />
            <Button type="submit" className="bg-red-500 text-white">
              Enter
            </Button>
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </Form>
      </div>
    </div>
  );
}
