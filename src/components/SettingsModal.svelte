<script>
  import { gistConfig, saveGistConfig, syncToGist, loadFromGist } from '../stores/notes.js'
  import { Settings, X, CheckCircle, XCircle, Upload, Download } from 'lucide-svelte'

  let { onclose } = $props()

  let pat = $state($gistConfig.pat)
  let gistId = $state($gistConfig.gistId)
  let syncing = $state(false)
  let message = $state('')
  let messageType = $state('ok')

  function save() {
    saveGistConfig(pat, gistId)
    message = '設定を保存しました'
    messageType = 'ok'
  }

  async function syncUp() {
    syncing = true
    message = ''
    try {
      await syncToGist()
      gistId = $gistConfig.gistId
      message = `Gistに保存しました（ID: ${$gistConfig.gistId}）`
      messageType = 'ok'
    } catch (e) {
      message = e.message
      messageType = 'error'
    } finally {
      syncing = false
    }
  }

  async function syncDown() {
    syncing = true
    message = ''
    try {
      const result = await loadFromGist()
      message = result === 'updated' ? 'Gistから最新データを取得しました' : 'すでに最新です'
      messageType = 'ok'
    } catch (e) {
      message = e.message
      messageType = 'error'
    } finally {
      syncing = false
    }
  }
</script>

<div class="modal-overlay" onclick={(e) => e.target === e.currentTarget && onclose()}>
  <div class="modal-box">
    <div class="modal-header">
      <h3 class="modal-title"><Settings size={18} /> 設定 / GitHub Gist 同期</h3>
      <button class="modal-close" onclick={onclose}><X size={18} /></button>
    </div>

    <div class="modal-body">
      <p class="settings-desc">GitHub Personal Access Token（gist権限）とGist IDを設定するとデバイス間で同期できます。</p>

      <label class="form-label">GitHub PAT</label>
      <input bind:value={pat} class="form-input" type="password" placeholder="ghp_xxxxxxxxxxxx" />

      <label class="form-label">Gist ID（初回は空のままで自動作成）</label>
      <input bind:value={gistId} class="form-input" placeholder="（自動作成される場合は空欄）" />

      <div class="settings-actions">
        <button class="btn-primary" onclick={save}>設定を保存</button>
      </div>

      <hr class="settings-divider" />

      <div class="sync-section">
        <button class="btn-secondary" disabled={syncing} onclick={syncUp}>
          {#if !syncing}<Upload size={16} />{/if}
          {syncing ? '同期中...' : 'Gistに保存'}
        </button>
        <button class="btn-secondary" disabled={syncing} onclick={syncDown}>
          {#if !syncing}<Download size={16} />{/if}
          {syncing ? '同期中...' : 'Gistから読み込み'}
        </button>
      </div>
      {#if message}
        <p class="sync-message {messageType}">
          {#if messageType === 'ok'}<CheckCircle size={15} />{:else}<XCircle size={15} />{/if}
          {message}
        </p>
      {/if}
    </div>
  </div>
</div>
