<script>
	import {
		Search,
		Button,
		Card,
		Listgroup,
		Avatar,
		Dropdown,
		DropdownItem,
		Radio
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	export let data;
	let value = data.query || '';
</script>

<form class="flex gap-2 mt-2" action="/dashboard/add-account" method="GET">
	<Search name="search" size="lg" bind:value />
	<Button type="submit" color="light" class="!p-2.5">
		<Icon name="search-outline" class="w-5 h-5" />
	</Button>
</form>
{#if data.data?.length > 0}
	<Card class="my-4" padding="xl" size="full">
		<div class="flex justify-between items-center mb-4">
			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
				Pick your account
			</h5>
		</div>
		<Listgroup items={data.data} let:item class="border-0 dark:!bg-transparent">
			<div class="flex items-center space-x-4">
				<Avatar src={'data:image/png;base64, ' + item.logo} alt={item.name} class="flex-shrink-0" />
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
						{item.name}
					</p>
					<p class="text-sm text-gray-500 truncate dark:text-gray-400">
						{item.country_codes.join(',')}
					</p>
				</div>
			</div>
		</Listgroup>
	</Card>
{/if}
