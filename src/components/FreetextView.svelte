<script>
  import { Pencil } from 'lucide-svelte'
  import { unified } from 'unified'
  import remarkParse from 'remark-parse'
  import remarkGfm from 'remark-gfm'
  import remarkRehype from 'remark-rehype'
  import rehypeSlug from 'rehype-slug'
  import rehypeStringify from 'rehype-stringify'

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)

  let { content = '', categoryId, editingAll = $bindable(false), onsave } = $props()

  let editingIndex = $state(-1)
  let draft = $state('')
  let draftAll = $state('')
  let activeId = $state('')
  let contentEl = $state(null)

  const sections = $derived(splitSections(content ?? ''))

  // 見出しと本文を分けてレンダリング
  const renderedSections = $derived(
    sections.map(s => ({
      heading: s.heading ? String(processor.processSync(s.heading)) : '',
      body: s.body.trim() ? String(processor.processSync(s.body)) : '',
    }))
  )

  const toc = $derived.by(() =>
    renderedSections.flatMap(({ heading }) =>
      [...heading.matchAll(/<h([1-3])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)]
        .map(([, level, id, inner]) => ({
          level: parseInt(level),
          id,
          text: inner.replace(/<[^>]+>/g, '').trim(),
        }))
    )
  )

  function splitSections(md) {
    const lines = md.split('\n')
    const result = []
    let current = null
    for (const line of lines) {
      if (/^#{1,3} /.test(line)) {
        if (current !== null) result.push(current)
        current = { heading: line, body: '' }
      } else {
        if (current === null) current = { heading: null, body: '' }
        current.body += line + '\n'
      }
    }
    if (current !== null) result.push(current)
    return result
  }

  function joinSections(sects) {
    return sects.map(s => (s.heading ? s.heading + '\n' : '') + s.body).join('')
  }

  function startEdit(i) {
    editingIndex = i
    draft = sections[i].body.trimEnd()
  }

  function save(i) {
    const updated = sections.map((s, idx) =>
      idx === i ? { ...s, body: draft ? draft + '\n' : '' } : s
    )
    onsave(joinSections(updated))
    editingIndex = -1
  }

  function cancel() {
    editingIndex = -1
  }

  $effect(() => {
    if (editingAll) draftAll = content ?? ''
  })

  function saveAll() {
    onsave(draftAll)
    editingAll = false
  }

  function cancelAll() {
    editingAll = false
  }

  $effect(() => {
    if (!contentEl || toc.length === 0) return
    const headings = [...contentEl.querySelectorAll('h1[id], h2[id], h3[id]')]
    if (!headings.length) return
    const scrollRoot = contentEl.closest('.app-content')
    if (!scrollRoot) return

    function updateActive() {
      const threshold = scrollRoot.getBoundingClientRect().top + 80
      let current = headings[0].id
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= threshold) current = h.id
        else break
      }
      activeId = current
    }

    scrollRoot.addEventListener('scroll', updateActive, { passive: true })
    updateActive()
    return () => scrollRoot.removeEventListener('scroll', updateActive)
  })

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
</script>

<div class="freetext-view">
  {#if editingAll}
    <textarea bind:value={draftAll} class="freetext-textarea"></textarea>
    <div class="freetext-actions">
      <button class="btn-primary" onclick={saveAll}>保存</button>
      <button class="btn-secondary" onclick={cancelAll}>キャンセル</button>
    </div>
  {:else}
  <div class="freetext-layout">
    <div class="freetext-content" bind:this={contentEl}>
      {#each sections as section, i}
        <div class="freetext-section">
          {#if editingIndex === i}
            <!-- 編集モード: 見出しは固定、本文のみ編集 -->
            {#if section.heading}
              <div class="markdown-body freetext-heading-only">
                {@html renderedSections[i].heading}
              </div>
            {/if}
            <textarea
              bind:value={draft}
              class="freetext-textarea freetext-textarea--section"
            ></textarea>
            <div class="freetext-section-footer">
              <button class="btn-primary btn--sm" onclick={() => save(i)}>保存</button>
              <button class="btn-secondary btn--sm" onclick={cancel}>キャンセル</button>
            </div>
          {:else}
            <!-- 表示モード: 見出し横に編集ボタン -->
            {#if section.heading}
              <div class="freetext-section-header">
                <div class="markdown-body freetext-heading-only">
                  {@html renderedSections[i].heading}
                </div>
                {#if editingIndex === -1}
                  <button class="freetext-edit-btn" onclick={() => startEdit(i)} title="編集">
                    <Pencil size={13} />
                    編集
                  </button>
                {/if}
              </div>
            {:else if editingIndex === -1}
              <!-- 見出しなしセクション（前文など）の編集ボタン -->
              <div class="freetext-section-footer">
                <button class="freetext-edit-btn" onclick={() => startEdit(i)} title="編集">
                  <Pencil size={13} />
                  編集
                </button>
              </div>
            {/if}
            <div class="markdown-body">{@html renderedSections[i].body}</div>
          {/if}
        </div>
      {/each}
    </div>

    {#if toc.length > 0}
      <nav class="freetext-toc">
        <p class="toc-heading">目次</p>
        <ul class="toc-list">
          {#each toc as item (item.id)}
            <li>
              <button
                class="toc-item toc-item--h{item.level}"
                class:toc-item--active={activeId === item.id}
                onclick={() => scrollToId(item.id)}
              >
                {item.text}
              </button>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </div>
  {/if}
</div>
