import { redirect } from 'next/navigation'

// Fallback dynamic product route.
// This file acted as a placeholder and was empty which breaks the build.
// For now, redirect unknown dynamic product routes back to /shop.

export default function Page() {
	// If you want to render dynamic product pages here, implement fetching
	// by `params.id` and render the product. Currently redirect to /shop.
	redirect('/shop')
}
