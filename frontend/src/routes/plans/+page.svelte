<script lang="ts">
  import { onMount } from 'svelte';
  import type { TrainingPlan } from '$lib/types';

  // For now, using a hardcoded athlete ID. In a real app, this would come from authentication
  const ATHLETE_ID = 'default-athlete-123';

  let plans = $state<TrainingPlan[]>([]);
  let isLoading = $state(true);
  let errorMessage = $state<string | null>(null);
  let selectedPlan = $state<TrainingPlan | null>(null);
  let showActivateModal = $state(false);
  let planToActivate = $state<TrainingPlan | null>(null);
  let activationStartDate = $state<string>('');
  let isActivating = $state(false);

  onMount(async () => {
    await fetchPlans();
  });

  async function fetchPlans() {
    isLoading = true;
    errorMessage = null;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/training-plans?athlete_id=${ATHLETE_ID}`);

      if (!response.ok) {
        throw new Error('Failed to fetch training plans');
      }

      plans = await response.json();
    } catch (error) {
      console.error('Error fetching plans:', error);
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getDaysRemaining(endDate?: string): number | null {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getProgressPercentage(startDate?: string, endDate?: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }

  function viewPlanDetails(plan: TrainingPlan) {
    selectedPlan = plan;
  }

  function closeModal() {
    selectedPlan = null;
  }

  function getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function showActivateDialog(plan: TrainingPlan) {
    planToActivate = plan;
    activationStartDate = getTodayString();
    showActivateModal = true;
  }

  function closeActivateModal() {
    showActivateModal = false;
    planToActivate = null;
    activationStartDate = '';
  }

  async function deactivatePlan(planId: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/training-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: false })
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate plan');
      }

      await fetchPlans();
      closeModal();
    } catch (error) {
      console.error('Error deactivating plan:', error);
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    }
  }

  async function activatePlanWithDate() {
    if (!planToActivate || !activationStartDate) {
      errorMessage = 'Please select a start date';
      return;
    }

    isActivating = true;

    try {
      // Calculate end date based on original plan duration
      const originalStart = planToActivate.start_date ? new Date(planToActivate.start_date) : null;
      const originalEnd = planToActivate.end_date ? new Date(planToActivate.end_date) : null;

      let durationDays = 28; // Default 4 weeks
      if (originalStart && originalEnd) {
        durationDays = Math.ceil((originalEnd.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24));
      }

      const startDate = new Date(activationStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);

      // Update the plan with new dates and activate it
      const updateResponse = await fetch(`http://localhost:3000/api/v1/training-plans/${planToActivate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update plan dates');
      }

      // Activate the plan
      const activateResponse = await fetch(`http://localhost:3000/api/v1/training-plans/${planToActivate.id}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!activateResponse.ok) {
        throw new Error('Failed to activate plan');
      }

      await fetchPlans();
      closeActivateModal();
      closeModal();
    } catch (error) {
      console.error('Error activating plan:', error);
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      isActivating = false;
    }
  }

  async function deletePlan(planId: string) {
    if (!confirm('Are you sure you want to delete this training plan?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/training-plans/${planId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      await fetchPlans();
      closeModal();
    } catch (error) {
      console.error('Error deleting plan:', error);
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    }
  }

  $effect(() => {
    if (errorMessage) {
      setTimeout(() => {
        errorMessage = null;
      }, 5000);
    }
  });
</script>

<div class="container">
  <header>
    <div>
      <h1>My Training Plans</h1>
      <p class="subtitle">View and manage your active and past training programs</p>
    </div>
    <div class="header-actions">
      <a href="/templates" class="btn-primary">Browse Templates</a>
      <a href="/workouts" class="btn-secondary">My Workouts</a>
    </div>
  </header>

  {#if errorMessage}
    <div class="error-banner">{errorMessage}</div>
  {/if}

  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading your training plans...</p>
    </div>
  {:else if plans.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <h2>No Training Plans Yet</h2>
      <p>Start your fitness journey by choosing a pre-configured training plan!</p>
      <a href="/templates" class="btn-primary">Browse Training Templates</a>
    </div>
  {:else}
    <div class="plans-section">
      <h2>Active Plans</h2>
      <div class="plans-grid">
        {#each plans.filter(p => p.is_active) as plan (plan.id)}
          <div class="plan-card active">
            <div class="plan-header">
              <div>
                <h3>{plan.name}</h3>
                <span class="status-badge active">Active</span>
              </div>
              <span class="phase-badge">{plan.phase_type}</span>
            </div>

            {#if plan.description}
              <p class="plan-description">{plan.description}</p>
            {/if}

            <div class="plan-dates">
              <div class="date-item">
                <span class="label">Start Date:</span>
                <span class="value">{formatDate(plan.start_date)}</span>
              </div>
              <div class="date-item">
                <span class="label">End Date:</span>
                <span class="value">{formatDate(plan.end_date)}</span>
              </div>
            </div>

            {#if plan.start_date && plan.end_date}
              <div class="progress-section">
                <div class="progress-header">
                  <span>Progress</span>
                  {#if getDaysRemaining(plan.end_date) !== null}
                    {@const daysLeft = getDaysRemaining(plan.end_date)}
                    <span class="days-remaining">
                      {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? 'Ends today' : 'Completed'}
                    </span>
                  {/if}
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: {getProgressPercentage(plan.start_date, plan.end_date)}%"></div>
                </div>
              </div>
            {/if}

            <div class="plan-actions">
              <button class="btn-view" onclick={() => viewPlanDetails(plan)}>View Details</button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    {#if plans.filter(p => !p.is_active).length > 0}
      <div class="plans-section">
        <h2>Inactive Plans</h2>
        <div class="plans-grid">
          {#each plans.filter(p => !p.is_active) as plan (plan.id)}
            <div class="plan-card">
              <div class="plan-header">
                <div>
                  <h3>{plan.name}</h3>
                  <span class="status-badge inactive">Inactive</span>
                </div>
                <span class="phase-badge">{plan.phase_type}</span>
              </div>

              {#if plan.description}
                <p class="plan-description">{plan.description}</p>
              {/if}

              <div class="plan-dates">
                <div class="date-item">
                  <span class="label">Start Date:</span>
                  <span class="value">{formatDate(plan.start_date)}</span>
                </div>
                <div class="date-item">
                  <span class="label">End Date:</span>
                  <span class="value">{formatDate(plan.end_date)}</span>
                </div>
              </div>

              <div class="plan-actions">
                <button class="btn-view" onclick={() => viewPlanDetails(plan)}>View Details</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

{#if selectedPlan}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeModal}>×</button>

      <div class="modal-header">
        <div>
          <h2>{selectedPlan.name}</h2>
          <div class="modal-meta">
            <span class="status-badge {selectedPlan.is_active ? 'active' : 'inactive'}">
              {selectedPlan.is_active ? 'Active' : 'Inactive'}
            </span>
            <span class="phase-badge">{selectedPlan.phase_type}</span>
          </div>
        </div>
      </div>

      <div class="modal-body">
        {#if selectedPlan.description}
          <div class="section">
            <h3>Description</h3>
            <p>{selectedPlan.description}</p>
          </div>
        {/if}

        <div class="section">
          <h3>Plan Details</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Start Date</span>
              <span class="detail-value">{formatDate(selectedPlan.start_date)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">End Date</span>
              <span class="detail-value">{formatDate(selectedPlan.end_date)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phase Type</span>
              <span class="detail-value">{selectedPlan.phase_type}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value">{selectedPlan.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>

        {#if selectedPlan.start_date && selectedPlan.end_date}
          {@const daysLeft = getDaysRemaining(selectedPlan.end_date)}
          {@const progress = getProgressPercentage(selectedPlan.start_date, selectedPlan.end_date)}
          <div class="section">
            <h3>Progress</h3>
            <div class="progress-info">
              <div class="progress-stat">
                <span class="stat-label">Days Remaining</span>
                <span class="stat-value">{daysLeft !== null ? (daysLeft > 0 ? daysLeft : 'Completed') : 'N/A'}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-label">Completion</span>
                <span class="stat-value">{progress.toFixed(0)}%</span>
              </div>
            </div>
            <div class="progress-bar large">
              <div class="progress-fill" style="width: {progress}%"></div>
            </div>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        {#if selectedPlan.is_active}
          <button class="btn-warning" onclick={() => deactivatePlan(selectedPlan.id)}>
            Deactivate Plan
          </button>
        {:else}
          <button class="btn-primary" onclick={() => showActivateDialog(selectedPlan)}>
            Activate Plan
          </button>
        {/if}
        <button class="btn-danger" onclick={() => deletePlan(selectedPlan.id)}>
          Delete Plan
        </button>
        <button class="btn-secondary" onclick={closeModal}>Close</button>
      </div>
    </div>
  </div>
{/if}

{#if showActivateModal && planToActivate}
  <div class="modal-overlay" onclick={closeActivateModal}>
    <div class="activate-modal" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeActivateModal}>×</button>

      <div class="activate-modal-header">
        <h2>Activate Training Plan</h2>
        <p class="activate-subtitle">{planToActivate.name}</p>
      </div>

      <div class="activate-modal-body">
        <p class="activate-info">Choose when you'd like to start this training plan. The end date will be calculated based on the plan's duration.</p>

        <div class="date-selector">
          <label for="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            bind:value={activationStartDate}
            min={getTodayString()}
            required
          />
        </div>

        {#if activationStartDate}
          {@const startDate = new Date(activationStartDate)}
          {@const originalStart = planToActivate.start_date ? new Date(planToActivate.start_date) : null}
          {@const originalEnd = planToActivate.end_date ? new Date(planToActivate.end_date) : null}
          {@const durationDays = originalStart && originalEnd ? Math.ceil((originalEnd.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24)) : 28}
          {@const endDate = new Date(startDate)}
          {endDate.setDate(endDate.getDate() + durationDays)}

          <div class="date-preview">
            <div class="preview-item">
              <span class="preview-label">Plan Duration:</span>
              <span class="preview-value">{durationDays} days ({Math.ceil(durationDays / 7)} weeks)</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">End Date:</span>
              <span class="preview-value">{formatDate(endDate.toISOString().split('T')[0])}</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="activate-modal-footer">
        <button class="btn-secondary" onclick={closeActivateModal} disabled={isActivating}>
          Cancel
        </button>
        <button class="btn-primary" onclick={activatePlanWithDate} disabled={!activationStartDate || isActivating}>
          {isActivating ? 'Activating...' : 'Activate Plan'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    color: black;
    font-size: 1.1rem;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-block;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #667eea;
    border: 2px solid #667eea;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
  }

  .btn-warning {
    background: #fbbf24;
    color: #78350f;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-warning:hover {
    background: #f59e0b;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .error-banner {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #666;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f0f0f0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h2 {
    color: #333;
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
  }

  .empty-state p {
    color: #666;
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }

  .plans-section {
    margin-bottom: 3rem;
  }

  .plans-section h2 {
    color: #333;
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .plan-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 2px solid #e0e0e0;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  }

  .plan-card.active {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  .plan-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .plan-header > div {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .plan-card h3 {
    color: #333;
    font-size: 1.3rem;
    margin: 0;
  }

  .status-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.active {
    background: #10b981;
    color: white;
  }

  .status-badge.inactive {
    background: #9ca3af;
    color: white;
  }

  .phase-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .plan-description {
    color: #666;
    line-height: 1.6;
    margin: 1rem 0;
  }

  .plan-dates {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .date-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  .date-item .label {
    color: #666;
    font-weight: 600;
  }

  .date-item .value {
    color: #333;
  }

  .progress-section {
    margin: 1.5rem 0;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .progress-header > span:first-child {
    color: #333;
  }

  .days-remaining {
    color: #667eea;
  }

  .progress-bar {
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar.large {
    height: 12px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  .plan-actions {
    margin-top: 1.5rem;
  }

  .btn-view {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-view:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }

  .modal {
    background: white;
    border-radius: 16px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-close {
    position: sticky;
    top: 1rem;
    right: 1rem;
    float: right;
    background: #f0f0f0;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
  }

  .modal-close:hover {
    background: #e0e0e0;
  }

  .modal-header {
    padding: 2rem 2rem 1rem 2rem;
  }

  .modal-header h2 {
    color: #333;
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  .modal-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .modal-body {
    padding: 0 2rem 2rem 2rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section h3 {
    color: #667eea;
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
  }

  .section p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-label {
    color: #666;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .progress-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .progress-stat {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-label {
    color: #666;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .stat-value {
    color: #667eea;
    font-size: 2rem;
    font-weight: 700;
  }

  .modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    flex-wrap: wrap;
    position: sticky;
    bottom: 0;
    background: white;
  }

  /* Activation Modal Styles */
  .activate-modal {
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 100%;
    position: relative;
  }

  .activate-modal-header {
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .activate-modal-header h2 {
    color: #333;
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
  }

  .activate-subtitle {
    color: #667eea;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  .activate-modal-body {
    padding: 2rem;
  }

  .activate-info {
    color: #666;
    line-height: 1.6;
    margin: 0 0 2rem 0;
  }

  .date-selector {
    margin-bottom: 2rem;
  }

  .date-selector label {
    display: block;
    color: #333;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .date-selector input[type="date"] {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .date-selector input[type="date"]:focus {
    outline: none;
    border-color: #667eea;
  }

  .date-preview {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%);
    padding: 1.5rem;
    border-radius: 12px;
    border: 2px solid #667eea;
  }

  .preview-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
  }

  .preview-item:not(:last-child) {
    border-bottom: 1px solid #d0d5dd;
  }

  .preview-label {
    color: #666;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .preview-value {
    color: #667eea;
    font-weight: 700;
    font-size: 1rem;
  }

  .activate-modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    background: white;
    border-radius: 0 0 16px 16px;
  }

  .activate-modal-footer button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-actions {
      flex-direction: column;
    }

    .plans-grid {
      grid-template-columns: 1fr;
    }

    .modal-overlay {
      padding: 1rem;
    }

    .modal {
      max-height: 95vh;
    }

    .modal-footer {
      flex-direction: column;
    }

    .modal-footer button {
      width: 100%;
    }
  }
</style>
