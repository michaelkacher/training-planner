<script lang="ts">
  let { message, onDismiss }: { message: string; onDismiss?: () => void } = $props();
</script>

<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" role="alert">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/>
    </svg>
    <div class="flex-1">
      <h3 class="text-sm font-semibold text-red-800">Error</h3>
      <p class="text-sm text-red-700 mt-1">{message}</p>
    </div>
    {#if onDismiss}
      <button
        onclick={onDismiss}
        class="text-red-400 hover:text-red-600 transition-colors"
        aria-label="Dismiss error"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
        </svg>
      </button>
    {/if}
  </div>
</div>
