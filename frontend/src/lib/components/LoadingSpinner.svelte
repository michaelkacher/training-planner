<script lang="ts">
  let { message = "Loading..." }: { message?: string } = $props();
</script>

<div
  class="flex flex-col items-center justify-center py-8"
  role="status"
  aria-live="polite"
>
  <svg
    class="w-12 h-12 animate-spin text-primary"
    viewBox="0 0 50 50"
    aria-hidden="true"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke-width="6"
      stroke="#e6e6e6"
      fill="none"
    />
    <path
      d="M45 25a20 20 0 00-6.7-15"
      stroke-width="6"
      stroke="url(#g)"
      stroke-linecap="round"
      fill="none"
    ></path>
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0%" stop-color="var(--primary)" />
        <stop offset="100%" stop-color="var(--accent)" />
      </linearGradient>
    </defs>
  </svg>
  <p class="mt-3 text-sm text-slate-600 font-medium">{message}</p>
</div>
