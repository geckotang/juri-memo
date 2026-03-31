<script>
  import AppSidebar from './components/AppSidebar.svelte'
  import ContentView from './components/ContentView.svelte'
  import SettingsModal from './components/SettingsModal.svelte'
  import { Menu, Settings } from 'lucide-svelte'

  function parsePath() {
    const parts = window.location.pathname.replace(/^\//, '').split('/')
    return { categoryId: parts[0] || 'combos', sectionId: parts[1] || null }
  }

  const _init = parsePath()
  let drawerOpen = $state(false)
  let activeCategoryId = $state(_init.categoryId)
  let activeSectionId = $state(_init.sectionId)
  let showSettings = $state(false)

  $effect(() => {
    function onPopState() {
      const { categoryId, sectionId } = parsePath()
      activeCategoryId = categoryId
      activeSectionId = sectionId
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  })

  function onSelect({ categoryId, sectionId }) {
    const path = sectionId ? `/${categoryId}/${sectionId}` : `/${categoryId}`
    history.pushState({}, '', path)
    drawerOpen = false
  }
</script>

<div class="app-root">
  {#if drawerOpen}
    <div class="drawer-overlay" onclick={() => (drawerOpen = false)}></div>
  {/if}

  <AppSidebar
    open={drawerOpen}
    activeCategoryId={activeCategoryId}
    activeSectionId={activeSectionId}
    onselect={onSelect}
    onclose={() => (drawerOpen = false)}
    onsettings={() => (showSettings = true)}
  />

  <div class="app-main">
    <header class="app-header">
      <button class="hamburger" onclick={() => (drawerOpen = !drawerOpen)}><Menu size={20} /></button>
      <span class="app-title">JURI MEMO</span>
      <div class="header-right">
        <button class="icon-btn" title="設定" onclick={() => (showSettings = true)}><Settings size={18} /></button>
      </div>
    </header>

    <main class="app-content">
      <ContentView
        categoryId={activeCategoryId}
        sectionId={activeSectionId}
        onselectsection={onSelect}
      />
    </main>
  </div>

  {#if showSettings}
    <SettingsModal onclose={() => (showSettings = false)} />
  {/if}
</div>
