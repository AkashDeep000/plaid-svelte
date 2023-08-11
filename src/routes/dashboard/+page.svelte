<script>
  import AddAccounts from '$lib/components/AddAccounts/index.svelte';
  import BankAccountList from '$lib/components/BankAccountList/index.svelte';
  import { Button } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';
  export let data
  //console.log(data)
</script>

<div>
  <AddAccounts />
  <BankAccountList data={data.data} />

</div>