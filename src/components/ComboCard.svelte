<script>
  import { data } from '../stores/notes.js'
  import { Star, ChevronRight, ExternalLink } from 'lucide-svelte'
  let { item, onedit, ondelete, onupdate, onselectsection } = $props()

  function toggleStar() {
    onupdate({ ...item, starred: !item.starred })
  }

  const okizemeTarget = $derived.by(() => {
    const okizeme = $data.categories.find(c => c.id === 'okizeme')
    if (!okizeme?.sections) return null
    if (item.okizemeRef) {
      const sec = okizeme.sections.find(s => s.id === item.okizemeRef)
      return sec ? { categoryId: 'okizeme', sectionId: sec.id, name: sec.name } : null
    }
    if (!item.advantage) return null
    const sec = okizeme.sections.find(s =>
      s.advantageValue ? s.advantageValue === item.advantage : s.name.startsWith('+' + item.advantage)
    )
    return sec ? { categoryId: 'okizeme', sectionId: sec.id, name: sec.name } : null
  })

  function tagClass(tag) {
    if (tag.startsWith('ストック')) return 'tag--stock'
    if (tag === '中央') return 'tag--center'
    if (tag === '端') return 'tag--corner'
    if (tag === 'パニカン') return 'tag--panic'
    if (tag === '壁ドン') return 'tag--wall'
    if (tag === 'SA1' || tag === 'SA3') return 'tag--sa'
    return 'tag--default'
  }
</script>

<div class="item-card" class:item-card--starred={item.starred}>
  <div class="card-header">
    <div class="card-tags">
      {#each item.tags as tag (tag)}
        <span class="tag {tagClass(tag)}">{tag}</span>
      {/each}
    </div>
    <button class="star-btn" class:active={item.starred} onclick={toggleStar}><Star size={16} fill={item.starred ? 'currentColor' : 'none'} /></button>
  </div>

  <div class="card-body">
    <div class="combo-route">
      <span class="combo-starter">{item.starter}</span>
      {#if item.starter && item.route}
        <span class="combo-arrow"><ChevronRight size={14} /></span>
      {/if}
      <span class="combo-route-text">{item.route}</span>
    </div>
    <div class="card-meta">
      {#if item.damage}
        <span class="meta-badge meta-badge--dmg">{item.damage.toLocaleString()}</span>
      {/if}
      {#if item.advantage}
        {#if okizemeTarget && onselectsection}
          <button
            class="meta-badge meta-badge--adv meta-badge--link"
            onclick={() => onselectsection(okizemeTarget)}
            title="起き攻め: {okizemeTarget.name}"
          >+{item.advantage}<ExternalLink size={11} /></button>
        {:else}
          <span class="meta-badge meta-badge--adv">+{item.advantage}</span>
        {/if}
      {/if}
    </div>
    {#if item.notes}
      <p class="card-notes">{item.notes}</p>
    {/if}
  </div>

  <div class="card-actions">
    <button class="action-btn" onclick={() => onedit(item)}>編集</button>
    <button class="action-btn action-btn--danger" onclick={() => ondelete(item.id)}>削除</button>
  </div>
</div>
