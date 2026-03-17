import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define the pages that should be publicly accessible
const isPublicRoute = createRouteMatcher([
    '/',
    '/search(.*)',
    '/trending',
    '/product/(.*)',
    '/api/(.*) ',
    '/sign-in(.*)',
    '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    // If the route is NOT public, force unauthenticated users to sign in
    if (!isPublicRoute(req)) await auth.protect()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
