export class VideoHelper {
  /**
   * Check whether a video element has audio
   * @param videoElem : video element
   * @returns boolean
   */
  static async hasAudio(videoElem: any) {
    return videoElem.mozHasAudio || videoElem.webkitAudioDecodedByteCount > 0 || Boolean(videoElem.audioTracks && videoElem.audioTracks.length);
  }
}
