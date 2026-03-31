<script>
  import { data } from '../stores/notes.js'
  import { X, Settings, ChevronRight, ChevronDown, Swords, RefreshCw, Target, FileText, CheckSquare } from 'lucide-svelte'

  let { open, activeCategoryId, activeSectionId, onselect, onclose, onsettings } = $props()

  let expandedCats = $state(new Set())

  function selectCategory(cat) {
    if (cat.sections?.length) {
      if (expandedCats.has(cat.id)) {
        expandedCats.delete(cat.id)
      } else {
        expandedCats.add(cat.id)
      }
      expandedCats = new Set(expandedCats)
    }
    onselect({ categoryId: cat.id, sectionId: null })
  }

  function selectSection(cat, sec) {
    expandedCats.add(cat.id)
    expandedCats = new Set(expandedCats)
    onselect({ categoryId: cat.id, sectionId: sec.id })
  }


</script>

<aside class="sidebar" class:sidebar--open={open}>
  <div class="sidebar-header">
    <span class="sidebar-title">JURI MEMO</span>
    <button class="sidebar-close" onclick={onclose}><X size={18} /></button>
  </div>

  <nav class="sidebar-nav">
    {#each $data.categories as cat (cat.id)}
      <div class="nav-group">
        <button
          class="nav-cat"
          class:nav-cat--active={activeCategoryId === cat.id && !activeSectionId}
          onclick={() => selectCategory(cat)}
        >
          <span class="nav-cat-icon">
            {#if cat.type === 'combo'}<Swords size={15} />
            {:else if cat.type === 'okizeme'}<RefreshCw size={15} />
            {:else if cat.type === 'matchup'}<Target size={15} />
            {:else if cat.type === 'checklist'}<CheckSquare size={15} />
            {:else}<FileText size={15} />
            {/if}
          </span>
          <span class="nav-cat-name">{cat.name}</span>
          {#if cat.sections?.length}
            <span class="nav-chevron">
              {#if expandedCats.has(cat.id)}<ChevronDown size={14} />{:else}<ChevronRight size={14} />{/if}
            </span>
          {/if}
        </button>

        {#if cat.sections && expandedCats.has(cat.id)}
          <div class="nav-sections">
            {#each cat.sections as sec (sec.id)}
              <button
                class="nav-section"
                class:nav-section--active={activeSectionId === sec.id}
                onclick={() => selectSection(cat, sec)}
              >
                {sec.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <button class="footer-btn" onclick={onsettings}><Settings size={16} /> 設定</button>
  </div>
</aside>
