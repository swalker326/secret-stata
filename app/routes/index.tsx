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
import { validateUsername } from "~/utils";
import * as React from "react";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect(`/${userId}`);
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const password = formData.get("password");

  if (!validateUsername(name)) {
    return json(
      { errors: { name: "Name is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required", name: null } },
      { status: 400 }
    );
  }

  if (password.length < 5) {
    return json(
      { errors: { password: "Password is too short", name: null } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(name, password);

  if (!user) {
    return json(
      { errors: { name: "Invalid name or password", password: null } },
      { status: 400 }
    );
  }
  const isAdmin = user.name === "admin@swalker.dev";

  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo: isAdmin ? "/admin" : `/user`,
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
  const redirectTo = searchParams.get("redirectTo") || "/user";
  const actionData = useActionData<typeof action>();
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);

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
      <div className="flex justify-center p-5">
        <div className="md:w-1/2 rounded-md bg-white p-10">
          <Form method="post" className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  ref={nameRef}
                  id="name"
                  required
                  autoFocus={true}
                  name="name"
                  type="name"
                  autoComplete="name"
                  aria-invalid={actionData?.errors?.name ? true : undefined}
                  aria-describedby="name-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                />
                {actionData?.errors?.name && (
                  <div className="pt-1 text-red-700" id="name-error">
                    {actionData.errors.name}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                />
                {actionData?.errors?.password && (
                  <div className="pt-1 text-red-700" id="password-error">
                    {actionData.errors.password}
                  </div>
                )}
              </div>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
              type="submit"
              className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Log in
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
