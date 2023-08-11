<script>
  import { Button, Spinner } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';
  import toast, { Toaster } from 'svelte-french-toast';
  import { invalidateAll } from '$app/navigation';


  let isLoadingLinkToken = false;

  const linkAccount = async (publicToken) => {
  try {
  const response = await fetch('/api/plaid/save-accounts', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify({ publicToken }),
  });
  if (!response.ok) throw new Error(response.statusText);
  invalidateAll()
  } catch (e) {
  console.log(e)
  throw new Error(e)
  }
  }

  const handleAddAccount = async () => {
  isLoadingLinkToken = true;
  const linkTokenRes = await fetch('/api/plaid/link-token');
  const linkToken = await linkTokenRes.json();
  console.log(linkToken);
  const handler = Plaid.create({
  token: linkToken.linkToken,
  onSuccess: async (publicToken, metadata) => {
  // send public_token to server
  toast.promise(
  linkAccount(publicToken),
  {
  loading: 'Adding new bank account...',
  success: 'Bank account added!',
  error: 'Failed when proccesing',
  }
  )
  },
  onEvent: (eventName, metadata) => {
  console.log('Event:', eventName);
  //  console.log("Metadata:", metadata);
  },
  onExit: (error, metadata) => {
  console.log(error, metadata);
  }
  });
  handler.open();
  isLoadingLinkToken = false;
  };
</script>

<svelte:head>
  <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>

<div>
  <Toaster />
  <Button on:click={handleAddAccount} class="w-full text-md" color="light">
    {#if !isLoadingLinkToken}
    <Icon class="my-2 mr-6" name="plus-solid" />
    {:else}
    <Spinner class="my-2 mr-6" size="6" />
    {/if}

    Add new accounts
  </Button>
</div>