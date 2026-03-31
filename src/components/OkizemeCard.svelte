<script>
  import { Star } from 'lucide-svelte'
  let { item, onedit, ondelete, onupdate } = $props()

  function toggleStar() {
    onupdate({ ...item, starred: !item.starred })
  }
</script>

<div class="item-card" class:item-card--starred={item.starred}>
  <div class="card-header">
    <div class="oki-move">
      <span class="oki-consume">{item.consumeMove}</span>
      {#if item.frameAfter}
        <span class="meta-badge meta-badge--adv oki-frame">+{item.frameAfter}</span>
      {/if}
    </div>
    <button class="star-btn" class:active={item.starred} onclick={toggleStar}><Star size={16} fill={item.starred ? 'currentColor' : 'none'} /></button>
  </div>

  <div class="card-body">
    {#if item.actions?.length}
      <ul class="oki-actions">
        {#each item.actions as action, i (i)}
          <li class="oki-action">{action}</li>
        {/each}
      </ul>
    {/if}
    {#if item.notes}
      <p class="card-notes">{item.notes}</p>
    {/if}
  </div>

  <div class="card-actions">
    <button class="action-btn" onclick={() => onedit(item)}>編集</button>
    <button class="action-btn action-btn--danger" onclick={() => ondelete(item.id)}>削除</button>
  </div>
</div>
