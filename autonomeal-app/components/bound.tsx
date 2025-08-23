ydration
failed
because
the
server
rendered
HTML
didn
't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `
if (typeof window !== 'undefined')`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <HotReload assetPrefix="" globalError={[...]}>
      <AppDevOverlay state={{nextId:1, ...}} globalError={[...]}>
        <AppDevOverlayErrorBoundary globalError={[...]} onError={function bound dispatchSetState}>
          <ReplaySsrOnlyErrors>
          <DevRootHTTPAccessFallbackBoundary>
            <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
              <HTTPAccessFallbackErrorBoundary pathname="/" notFound={<NotAllowedRootHTTPFallbackError>} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <Head>
                    <link>
                    <RootLayout>
                      <html lang="en" className="__variable...">
                        <body
                          className="font-sans"
-                         data-new-gr-c-s-check-loaded="14.1250.0"
-                         data-gr-ext-installed=""
                        >
                    ...
        ...
app\layout.tsx (27:7) @ RootLayout


  25 |   return (
  26 |     <html lang="en" className={\`${dmSans.variable} antialiased\`}>
> 27 |       <body className="font-sans">{children}</body>
     |       ^
  28 |     </html>
  29 |   )
  30 | }
Call Stack
17

Show 15 ignore-listed frame(s)
body
<anonymous> (0:0)
RootLayout
app\layout.tsx (27:7)
