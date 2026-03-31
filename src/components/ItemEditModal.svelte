<script>
  import { data, addComboTag, deleteComboTag } from '../stores/notes.js'
  import { X, Plus } from 'lucide-svelte'
  let { open, type, item, isNew, onclose, onsave } = $props()

  let form = $state(buildDefault())
  let newTagInput = $state('')
  let showTagInput = $state(false)
  let tagInputEl = $state(null)

  $effect(() => {
    if (showTagInput && tagInputEl) tagInputEl.focus()
  })

  $effect(() => {
    if (open) form = buildDefault()
  })

  function buildDefault() {
    if (item && !isNew) {
      return { ...item, actions: [...(item.actions ?? [])], tags: [...(item.tags ?? [])] }
    }
    if (type === 'combo')   return { starter: '', route: '', damage: null, advantage: '', okizemeRef: '', tags: [], notes: '', starred: false }
    if (type === 'okizeme') return { consumeMove: '', frameAfter: '', actions: [], notes: '', starred: false }
    if (type === 'matchup') return { situation: '', response: '', notes: '', important: false }
    return { starred: false }
  }

  function toggleTag(tag) {
    const idx = form.tags.indexOf(tag)
    if (idx >= 0) form.tags.splice(idx, 1)
    else form.tags.push(tag)
    form.tags = [...form.tags]
  }

  function handleAddTag() {
    const name = newTagInput.trim()
    if (!name) return
    addComboTag(name)
    if (!form.tags.includes(name)) form.tags = [...form.tags, name]
    newTagInput = ''
    showTagInput = false
  }

  function handleDeleteTag(tag) {
    deleteComboTag(tag)
    form.tags = form.tags.filter(t => t !== tag)
  }

  function handleActionsInput(e) {
    form.actions = e.target.value.split('\n').filter(Boolean)
  }

  function submit() {
    onsave({ ...form })
  }
</script>

<!-- スマホのみ半透明バックドロップ -->
<div
  class="drawer-backdrop"
  class:drawer-backdrop--visible={open}
  onclick={onclose}
></div>

<aside class="edit-drawer" class:edit-drawer--open={open}>
  <div class="edit-drawer-header">
    <h3 class="edit-drawer-title">{isNew ? '追加' : '編集'}</h3>
    <button class="edit-drawer-close" onclick={onclose} title="閉じる"><X size={18} /></button>
  </div>

  <div class="edit-drawer-body">
    {#if type === 'combo'}
      <label class="form-label">始動技</label>
      <input bind:value={form.starter} class="form-input" placeholder="例: 前大P" />

      <label class="form-label">コンボルート</label>
      <textarea bind:value={form.route} class="form-textarea" placeholder="例: OD風波 > 引き大 > 五黄殺" rows="4"></textarea>

      <div class="form-row">
        <div class="form-col">
          <label class="form-label">ダメージ</label>
          <input bind:value={form.damage} class="form-input" type="number" placeholder="例: 3200" />
        </div>
        <div class="form-col">
          <label class="form-label">〆フレーム</label>
          <input bind:value={form.advantage} class="form-input" placeholder="例: 36" />
        </div>
      </div>

      <label class="form-label">起き攻めセクション（任意）</label>
      <select bind:value={form.okizemeRef} class="form-input">
        <option value="">自動（〆フレームで判定）</option>
        {#each ($data.categories.find(c => c.id === 'okizeme')?.sections ?? []) as sec (sec.id)}
          <option value={sec.id}>{sec.advantageValue ? `+${sec.advantageValue} ${sec.name}` : sec.name}</option>
        {/each}
      </select>

      <label class="form-label">タグ</label>
      <div class="tag-picker">
        {#each $data.comboTags as tag (tag)}
          <span class="tag-pick-wrapper">
            <button
              class="tag-pick-btn"
              class:active={form.tags.includes(tag)}
              onclick={() => toggleTag(tag)}
            >{tag}</button>
            <button
              class="tag-pick-delete"
              onclick={() => handleDeleteTag(tag)}
              title="タグを削除"
            ><X size={10} /></button>
          </span>
        {/each}

        {#if showTagInput}
          <input
            bind:this={tagInputEl}
            bind:value={newTagInput}
            class="tag-add-input"
            placeholder="タグ名..."
            onkeydown={(e) => {
              if (e.key === 'Enter' && !e.isComposing) handleAddTag()
              if (e.key === 'Escape') showTagInput = false
            }}
          />
          <button class="tag-pick-btn" onclick={handleAddTag}>追加</button>
          <button class="tag-pick-btn" onclick={() => (showTagInput = false)}>キャンセル</button>
        {:else}
          <button class="tag-pick-btn tag-pick-btn--add" onclick={() => (showTagInput = true)}>
            <Plus size={12} /> タグを追加
          </button>
        {/if}
      </div>

      <label class="form-label">備考</label>
      <textarea bind:value={form.notes} class="form-textarea" rows="3"></textarea>

    {:else if type === 'okizeme'}
      <label class="form-label">消費技</label>
      <input bind:value={form.consumeMove} class="form-input" placeholder="例: 弱風波消費" />

      <label class="form-label">消費後有利F</label>
      <input bind:value={form.frameAfter} class="form-input" placeholder="例: 5" />

      <label class="form-label">起き攻め行動（1行1つ）</label>
      <textarea
        value={form.actions?.join('\n')}
        oninput={handleActionsInput}
        class="form-textarea"
        rows="5"
        placeholder="例: 中P&#10;投げ&#10;しゃがみ弱K"
      ></textarea>

      <label class="form-label">備考</label>
      <textarea bind:value={form.notes} class="form-textarea" rows="3"></textarea>

    {:else if type === 'matchup'}
      <label class="form-label">状況・技名</label>
      <input bind:value={form.situation} class="form-input" placeholder="例: サイコスパーク" />

      <label class="form-label">対処法</label>
      <textarea bind:value={form.response} class="form-textarea" rows="4" placeholder="例: ガードして強天穿輪"></textarea>

      <label class="form-label">備考</label>
      <textarea bind:value={form.notes} class="form-textarea" rows="3"></textarea>

      <label class="form-check">
        <input bind:checked={form.important} type="checkbox" />
        <span>重要（★）</span>
      </label>
    {/if}
  </div>

  <div class="edit-drawer-footer">
    <label class="form-check">
      <input bind:checked={form.starred} type="checkbox" />
      <span>★ お気に入り</span>
    </label>
    <div class="drawer-footer-btns">
      <button class="btn-secondary" onclick={onclose}>キャンセル</button>
      <button class="btn-primary" onclick={submit}>保存</button>
    </div>
  </div>
</aside>
