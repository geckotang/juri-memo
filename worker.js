export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // アセットファイル（拡張子あり）はそのまま返す
    if (url.pathname.includes('.')) {
      return env.ASSETS.fetch(request)
    }

    // SPAルート → index.html にフォールバック
    const indexUrl = new URL('/index.html', url.origin)
    return env.ASSETS.fetch(new Request(indexUrl, request))
  }
}
