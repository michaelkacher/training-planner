<script lang="ts">
  let { message = "Loading..." }: { message?: string } = $props();
</script>

<div class="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
  <div class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" aria-hidden="true"></div>
  <p class="mt-4 text-gray-600 font-medium">{message}</p>
</div>
