<script>
	import { Card, Dropdown, DropdownItem, Checkbox, Button, Search, Avatar } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	export let data;
	const maxTime = new Date();
	const maxDate = maxTime.toISOString().split('T')[0];
	const minTime = new Date(maxTime.setFullYear(maxTime.getFullYear() - 2));
	const minDate = minTime.toISOString().split('T')[0];

	let startDate = minDate;
	let endDate = maxDate;
	let banksIdArray = [];
	const selectAllBanks = (data) => {
		data.forEach((bank) => {
			banksIdArray.push(bank.institutionId);
		});
	};
	$: {
		selectAllBanks(data);
	}
</script>

<Card class="" size="full">
	<p class="py-2 text-lg text-gray-800 dark:text-gray-200">Select a date range :</p>
	<div class="w-full grid md:grid-cols-[1fr_auto_1fr] md:items-center">
		<div class="relative max-w-sm">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
				<svg
					class="w-4 h-4 text-gray-500 dark:text-gray-400"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
					/>
				</svg>
			</div>
			<input
				datepicker
				type="date"
				bind:value={startDate}
				min={minDate}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Select date"
			/>
		</div>

		<Icon name="dots-vertical-outline" class="m-1 text-gray-400 dark:text-gray-600 md:rotate-90" />

		<div class="relative max-w-sm">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
				<svg
					class="w-4 h-4 text-gray-500 dark:text-gray-400"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
					/>
				</svg>
			</div>
			<input
				datepicker
				type="date"
				bind:value={endDate}
				max={maxDate}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Select end date"
			/>
		</div>
	</div>

	<p class="mt-2 py-2 text-lg text-gray-800 dark:text-gray-200">Select a accounts :</p>
	<div class="grid grid-cols-2 gap-2 w-full md:grid-cols-3">
		{#each data as item}
			<Checkbox custom bind:group={banksIdArray} value={item.institutionId}>
				<div
					class={`flex items-center space-x-4 font-normal p-2 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-primary-600 hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 ${
						banksIdArray.indexOf(item.institutionId) > -1
							? '!text-gray-600 !dark:text-gray-300 !border-primary-600'
							: ''
					}`}
				>
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
				</div>
			</Checkbox>
		{/each}
	</div>
	<Button class="mt-4">Download CSV (WIP)</Button>
</Card>