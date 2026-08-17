"use client";

/**
 * Signs the current user out via a real (native) form submission to /api/auth/signout.
 *
 * next-auth/react's signOut(), and a fetch()-then-navigate approach, both leave a valid session
 * cookie in place: they trigger a SessionProvider session refetch that can race the browser's
 * application of the signout response's Set-Cookie header, so the freshly-loaded /login page
 * ends up "touching"/re-issuing a session instead of seeing it cleared. A native form POST lets
 * the browser handle the redirect + cookie-clearing + navigation as a single atomic sequence
 * (exactly as it does for a plain HTML form), which avoids the race entirely.
 */
export async function logout(callbackUrl = "/login") {
  const csrfRes = await fetch("/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/auth/signout";
  form.style.display = "none";

  const csrfField = document.createElement("input");
  csrfField.name = "csrfToken";
  csrfField.value = csrfToken;
  form.appendChild(csrfField);

  const callbackField = document.createElement("input");
  callbackField.name = "callbackUrl";
  callbackField.value = callbackUrl;
  form.appendChild(callbackField);

  document.body.appendChild(form);
  form.submit();
}
