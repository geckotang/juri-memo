export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 拡張子ありはアセットをそのまま返す
    if (url.pathname.includes('.')) {
      return env.ASSETS.fetch(request)
    }

    // SPAルートはすべて index.html を返す
    return env.ASSETS.fetch(new Request(new URL('/index.html', url.origin).toString()))
  }
}
