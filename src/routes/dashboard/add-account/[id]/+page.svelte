<script>
	import { onMount } from 'svelte';
	export let data;
	onMount(() => {
		alert('ok start');
		const handler = Plaid.create({
			token: data.linkToken,
			onSuccess: async (publicToken, metadata) => {
				alert('onSuccess');
			},
			onEvent: (eventName, metadata) => {
				console.log('Event:', eventName);
				console.log('Metadata:', metadata);
			},
			onExit: (error, metadata) => {
				console.log(error, metadata);
			}
		});

		handler.open();
	});
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>
