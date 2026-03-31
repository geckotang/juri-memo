<script>
  import { data, addItem, updateItem, deleteItem, updateFreetext, addSection, updateSection, deleteSection, reorderSection } from '../stores/notes.js'
  import ComboCard from './ComboCard.svelte'
  import OkizemeCard from './OkizemeCard.svelte'
  import MatchupCard from './MatchupCard.svelte'
  import FreetextView from './FreetextView.svelte'
  import ItemEditModal from './ItemEditModal.svelte'
  import { Pencil, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte'

  let { categoryId, sectionId, onselectsection } = $props()

  let showModal = $state(false)
  let editingItem = $state(null)
  let isNew = $state(false)
  let freetextEditingAll = $state(false)

  const category = $derived($data.categories.find(c => c.id === categoryId))
  const section = $derived(
    sectionId && category?.sections
      ? category.sections.find(s => s.id === sectionId)
      : null
  )

  const filteredItems = $derived(section?.items ?? [])

  function openAddModal() {
    editingItem = null
    isNew = true
    showModal = true
  }

  function openEditModal(item) {
    editingItem = item
    isNew = false
    showModal = true
  }

  function saveItem(form) {
    if (isNew) {
      addItem(categoryId, sectionId, form)
    } else {
      updateItem(categoryId, sectionId, form.id, form)
    }
    showModal = false
  }

  function handleUpdate(item) {
    updateItem(categoryId, sectionId, item.id, item)
  }

  function handleDelete(itemId) {
    if (!confirm('削除しますか？')) return
    deleteItem(categoryId, sectionId, itemId)
  }

  let editingSectionId = $state(null)
  let editingSectionName = $state('')
  let editingSectionAdvantage = $state('')
  let sectionInputEl = $state(null)

  $effect(() => {
    if (editingSectionId && sectionInputEl) sectionInputEl.focus()
  })

  function handleAddSection() {
    const name = prompt('セクション名を入力してください')
    if (!name) return
    const secId = addSection(categoryId, name)
    onselectsection({ categoryId, sectionId: secId })
  }

  function startRenameSection(sec) {
    editingSectionId = sec.id
    editingSectionName = sec.name
    editingSectionAdvantage = sec.advantageValue ?? ''
  }

  function saveRenameSection() {
    const name = editingSectionName.trim()
    if (name) updateSection(categoryId, editingSectionId, { name, advantageValue: editingSectionAdvantage.trim() || null })
    editingSectionId = null
  }

  function cancelRenameSection() {
    editingSectionId = null
  }

  function handleDeleteSection(secId) {
    if (!confirm('セクションを削除しますか？\n（含まれるアイテムもすべて削除されます）')) return
    deleteSection(categoryId, secId)
  }

  function handleMoveSection(secId, direction) {
    reorderSection(categoryId, secId, direction)
  }
</script>

<div class="content-view">
  {#if !category}
    <div class="content-empty">カテゴリを選択してください</div>

  {:else if category.type === 'freetext'}
    <div class="content-header">
      <h2 class="content-title">{category.name}</h2>
      {#if !freetextEditingAll}
        <button class="btn-secondary btn--sm" onclick={() => (freetextEditingAll = true)}>
          <Pencil size={13} />
          全体を編集
        </button>
      {/if}
    </div>
    <FreetextView
      content={category.content}
      categoryId={category.id}
      bind:editingAll={freetextEditingAll}
      onsave={(val) => updateFreetext(category.id, val)}
    />

  {:else if category.sections}
    <div class="content-header">
      <div class="content-breadcrumb">
        <span>{category.name}</span>
        {#if section}
          <span> › {section.name}</span>
        {/if}
      </div>
      <div class="content-header-actions">
        {#if !section}
          <button class="btn-secondary btn--sm" onclick={handleAddSection}><Plus size={14} /> セクション追加</button>
        {:else}
          <button class="btn-primary btn--sm" onclick={openAddModal}><Plus size={14} /> 追加</button>
        {/if}
      </div>
    </div>

    {#if !section}
      <div class="section-list">
        {#if !category.sections.length}
          <div class="content-empty">セクションがありません</div>
        {/if}
        {#each category.sections as sec, i (sec.id)}
          {#if editingSectionId === sec.id}
            <div class="section-card section-card--editing">
              <input
                bind:this={sectionInputEl}
                bind:value={editingSectionName}
                class="section-rename-input"
                placeholder="セクション名"
                onkeydown={(e) => {
                  if (e.key === 'Enter' && !e.isComposing) saveRenameSection()
                  if (e.key === 'Escape') cancelRenameSection()
                }}
              />
              {#if category.type === 'okizeme'}
                <input
                  bind:value={editingSectionAdvantage}
                  class="section-rename-input section-rename-input--sub"
                  placeholder="〆フレーム（例: 36）"
                  onkeydown={(e) => {
                    if (e.key === 'Enter' && !e.isComposing) saveRenameSection()
                    if (e.key === 'Escape') cancelRenameSection()
                  }}
                />
              {/if}
              <div class="section-rename-actions">
                <button class="btn-primary btn--sm" onclick={saveRenameSection}>保存</button>
                <button class="btn-secondary btn--sm" onclick={cancelRenameSection}>キャンセル</button>
              </div>
            </div>
          {:else}
            <div class="section-card-wrap">
              <button
                class="section-card"
                onclick={() => onselectsection({ categoryId: category.id, sectionId: sec.id })}
              >
                {#if sec.advantageValue}
                  <span class="section-card-adv">+{sec.advantageValue}</span>
                {/if}
                <span class="section-card-name">{sec.name}</span>
                <span class="section-card-count">{sec.items?.length ?? 0}件</span>
                <span class="section-card-star">
                  {(sec.items ?? []).filter(s => s.starred || s.important).length > 0 ? '★' : ''}
                </span>
              </button>
              <div class="section-card-actions">
                <button class="section-action-btn" onclick={() => handleMoveSection(sec.id, -1)} disabled={i === 0} title="上へ"><ChevronUp size={14} /></button>
                <button class="section-action-btn" onclick={() => handleMoveSection(sec.id, 1)} disabled={i === category.sections.length - 1} title="下へ"><ChevronDown size={14} /></button>
                <button class="section-action-btn" onclick={() => startRenameSection(sec)} title="名前を変更"><Pencil size={13} /></button>
                <button class="section-action-btn section-action-btn--danger" onclick={() => handleDeleteSection(sec.id)} title="削除"><Trash2 size={13} /></button>
              </div>
            </div>
          {/if}
        {/each}
      </div>

    {:else}
      <div class="item-list">
        {#if !filteredItems.length}
          <div class="content-empty">アイテムがありません</div>
        {/if}

        {#if category.type === 'combo'}
          {#each filteredItems as item (item.id)}
            <ComboCard
              {item}
              onedit={openEditModal}
              ondelete={handleDelete}
              onupdate={handleUpdate}
              {onselectsection}
            />
          {/each}

        {:else if category.type === 'okizeme'}
          {#each filteredItems as item (item.id)}
            <OkizemeCard
              {item}
              onedit={openEditModal}
              ondelete={handleDelete}
              onupdate={handleUpdate}
            />
          {/each}

        {:else if category.type === 'matchup'}
          {#each filteredItems as item (item.id)}
            <MatchupCard
              {item}
              onedit={openEditModal}
              ondelete={handleDelete}
            />
          {/each}
        {/if}
      </div>
    {/if}
  {/if}

  {#if section}
    <button class="fab" onclick={openAddModal}><Plus size={22} /></button>
  {/if}

  <ItemEditModal
    open={showModal}
    type={category?.type}
    item={editingItem}
    {isNew}
    onclose={() => (showModal = false)}
    onsave={saveItem}
  />
</div>
