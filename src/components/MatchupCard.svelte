<script>
  import { Star, Pin, ArrowRight } from 'lucide-svelte'
  let { item, onedit, ondelete } = $props()
</script>

<div class="item-card" class:item-card--important={item.important}>
  <div class="card-header">
    {#if item.important}
      <span class="important-badge"><Star size={13} fill="currentColor" /> 重要</span>
    {/if}
    <div class="card-actions" style="margin-left:auto">
      <button class="action-btn" onclick={() => onedit(item)}>編集</button>
      <button class="action-btn action-btn--danger" onclick={() => ondelete(item.id)}>削除</button>
    </div>
  </div>
  <div class="card-body">
    <div class="matchup-situation"><Pin size={13} /> {item.situation}</div>
    <div class="matchup-response"><ArrowRight size={13} /> {item.response}</div>
    {#if item.notes}
      <p class="card-notes">{item.notes}</p>
    {/if}
  </div>
</div>
