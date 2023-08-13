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
	import toast, { Toaster } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';

	export let data;

	const deleteAccount = async (institutionId) => {
		try {
			console.log(institutionId);
			const response = await fetch('/api/plaid/save-accounts', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ institutionId })
			});
			console.log(response);
			if (!response.ok) throw new Error(response.statusText);
			invalidateAll();
		} catch (e) {
			console.log(e);
			throw new Error(e);
		}
	};
</script>

{#if data?.length > 0}
	<Card class="my-2" padding="xl" size="full">
		<div class="flex justify-between items-center mb-4">
			<h5 class="text-lg font-bold leading-none text-gray-800 dark:text-gray-100">
				Your linked banks
			</h5>
		</div>
		<Listgroup items={data} let:item class="border-0 dark:!bg-transparent">
			<div class="flex items-center space-x-4">
				<Avatar
					src={item.logo ? 'data:image/png;base64, ' + item.logo : './bank-icon.png'}
					alt={item.name}
					class="flex-shrink-0"
				/>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
						{item.name}
					</p>
					<p class="text-sm text-gray-500 truncate dark:text-gray-400">
						{item.institutionId}
					</p>
				</div>
				<div>
					<Icon name="dots-vertical-outline" id={item.institutionId} class="dark:text-white" />
					<Dropdown triggeredBy={'#' + item.institutionId}>
						<DropdownItem
							on:click={() =>
								toast.promise(deleteAccount(item.institutionId), {
									loading: 'Remove bank account...',
									success: 'Bank account removed!',
									error: 'Failed when proccesing'
								})}>Remove Account</DropdownItem
						>
					</Dropdown>
				</div>
			</div>
		</Listgroup>
		<Toaster />
	</Card>
{/if}
