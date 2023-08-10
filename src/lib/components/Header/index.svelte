<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import {
		Navbar,
		NavBrand,
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownDivider,
		DropdownItem,
		DarkMode,
		Button,
		Spinner
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	let isLoadingAuth = false;
	const signInFn = () => {
		console.log('login clicked');
		isLoadingAuth = true;
		signIn('github');
	};
</script>

<Navbar>
	<NavBrand class="text-2xl font-bold" href="/">Plaid</NavBrand>
	<div class="flex items-center md:order-2 gap-2">
		<DarkMode />
		<div class="">
			{#if $page.data.session}
				<Avatar class="border" id="avatar-menu" src={$page.data.session?.user?.image} />
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownHeader>
						<span class="block text-sm">{$page.data.session?.user.name}</span>
						<span class="block text-sm">{$page.data.session?.user?.email}</span>
					</DropdownHeader>
					<DropdownItem><a href="/dashboard">Dashboard</a></DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={() => signOut()}>Sign out</DropdownItem>
				</Dropdown>
			{:else}
				<Button color="alternative" class="" on:click={() => signInFn()}>
					{#if !isLoadingAuth}
						<Icon class="mr-2" name="github-solid" />
					{:else}
						<Spinner class="mr-2" size="4" />
					{/if}
					<p>Signin</p>
				</Button>
			{/if}
		</div>
	</div>
</Navbar>
