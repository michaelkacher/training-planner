<script lang="ts">
  let { message = '' } = $props();
</script>

{#if message}
  <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
    <div class="flex items-center">
      <span class="mr-2">⚠️</span>
      <p>{message}</p>
    </div>
  </div>
{/if}
