export function isYouTubeURL(url: string | undefined) {
    const youtubeRegex = /(?:https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/;
    return url ? youtubeRegex.test(url) : false;
  }