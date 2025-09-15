import { HttpError, PageProps } from "fresh";

export default function ErrorPage(props: PageProps) {
  const error = props.error; // Contains the thrown Error or HttpError

  if (error instanceof HttpError) {
    const status = error.status; // HTTP status code

    // Render a 404 not found page
    if (status === 404) {
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

    // Handle other HTTP errors
    return (
      <>
        <head>
          <title>{status} - Error</title>
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
            <h1 class="text-4xl font-bold header1">{status} - Error</h1>
            <p class="my-4">
              Something went wrong. Please try again later.
            </p>
            <a href="/" class="underline">Go back home</a>
          </div>
        </div>
      </>
    );
  }

  // Handle generic errors
  return (
    <>
      <head>
        <title>500 - Internal Server Error</title>
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
          <h1 class="text-4xl font-bold header1">
            500 - Internal Server Error
          </h1>
          <p class="my-4">
            An unexpected error occurred. Please try again later.
          </p>
          <a href="/" class="underline">Go back home</a>
        </div>
      </div>
    </>
  );
}
