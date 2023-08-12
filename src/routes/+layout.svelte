<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header/index.svelte';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	// NProgress css
	import 'nprogress/nprogress.css';

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
</script>

<Header />
<div class="p-2 md:px-[10%]">
	<slot />
</div>
