ddEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });

async function handleRequest(request) {
    const url = new URL(request.url);
    if (url.pathname === "/auth") {
        return handleAuth(request);
      }
    return new Response("Not Found", { status: 404 });
  }

async function handleAuth(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return new Response("Unauthorized", { status: 401 });
      }

    // Validate the token with your method of choice (e.g., JWT, OAuth)
    const isValid = await validateToken(token);

      if (!isValid) {
        return new Response("Unauthorized", { status: 401 });
      }

    return new Response("Authorized", { status: 200 });
  }

async function validateToken(token) {
    // Add your token validation logic here
    // For example, fetching from an external service
    return true;
  }
}
  }
  }
}
  }
}
})