<script lang="ts">
  let { message, onDismiss }: { message: string; onDismiss?: () => void } =
    $props();
</script>

<div
  class="card-interactive bg-rose-50 border-rose-100 mb-4"
  role="alert"
  aria-live="assertive"
>
  <div class="flex items-start gap-3">
    <svg
      class="w-6 h-6 text-rose-700 flex-shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="flex-1">
      <h3 class="text-sm font-semibold text-rose-800">Error</h3>
      <p class="text-sm text-rose-700 mt-1">{message}</p>
    </div>
    {#if onDismiss}
      <button
        onclick={onDismiss}
        class="text-rose-600 hover:text-rose-800 transition-colors p-1 rounded-md focus-ring"
        aria-label="Dismiss error"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>
