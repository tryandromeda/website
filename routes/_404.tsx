export default function Error404() {
  return (
    <>
      <head>
        <title>404 - Page not found</title>
      </head>
      <div class="px-4 py-8 mx-auto">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="Andromeda logo"
          />
          <h1 class="text-4xl font-bold header1">404 - Page not found</h1>
          <p class="my-4">
            The page you were looking for doesn't exist.
          </p>
          <a href="/" class="underline">Go back home</a>
        </div>
      </div>
    </>
  );
}
