import {
  Component,
  Input,
   OnInit,
   OnDestroy,
  ViewChild,
   ElementRef,
   AfterViewInit,
} from "@angular/core"
import Hls from "hls.js"

export interface VideoQuality {
  label: string
  level: number
  height: number
}

@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() videoUrl = ""
  @Input() autoplay = false
  @Input() poster = ""
  @ViewChild("videoPlayer") videoPlayerRef!: ElementRef<HTMLVideoElement>

  videoElement!: HTMLVideoElement
  hls: Hls | null = null
  isPlaying = false
  isMuted = false
  currentTime = 0
  duration = 0
  volume = 1
  isFullscreen = false
  showControls = true
  hideControlsTimeout: any
  qualities: VideoQuality[] = []
  currentQuality: VideoQuality | null = null
  showQualityMenu = false
  loadingVideo = true
  videoError = false
  errorMessage = ""

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.videoElement = this.videoPlayerRef.nativeElement
    this.initPlayer()

    // Add event listeners
    this.videoElement.addEventListener("timeupdate", this.onTimeUpdate.bind(this))
    this.videoElement.addEventListener("loadedmetadata", this.onLoadedMetadata.bind(this))
    this.videoElement.addEventListener("play", () => (this.isPlaying = true))
    this.videoElement.addEventListener("pause", () => (this.isPlaying = false))
    this.videoElement.addEventListener("volumechange", this.onVolumeChange.bind(this))
    this.videoElement.addEventListener("ended", this.onVideoEnded.bind(this))
    this.videoElement.addEventListener("waiting", () => (this.loadingVideo = true))
    this.videoElement.addEventListener("canplay", () => (this.loadingVideo = false))
    this.videoElement.addEventListener("error", this.onVideoError.bind(this))

    // Auto-hide controls
    this.videoElement.addEventListener("mousemove", this.showControlsTemporarily.bind(this))
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy()
    }

    // Remove event listeners
    if (this.videoElement) {
      this.videoElement.removeEventListener("timeupdate", this.onTimeUpdate.bind(this))
      this.videoElement.removeEventListener("loadedmetadata", this.onLoadedMetadata.bind(this))
      this.videoElement.removeEventListener("volumechange", this.onVolumeChange.bind(this))
      this.videoElement.removeEventListener("ended", this.onVideoEnded.bind(this))
      this.videoElement.removeEventListener("error", this.onVideoError.bind(this))
      this.videoElement.removeEventListener("mousemove", this.showControlsTemporarily.bind(this))
    }

    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout)
    }
  }

  initPlayer(): void {
    if (!this.videoUrl) {
      this.videoError = true
      this.errorMessage = "No video URL provided"
      return
    }

    if (Hls.isSupported()) {
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })

      this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        this.loadingVideo = false
        this.setupQualityLevels(data.levels)

        if (this.autoplay) {
          this.videoElement.play().catch((e) => {
            console.error("Autoplay prevented:", e)
          })
        }
      })

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error:", data)
              this.hls?.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error:", data)
              this.hls?.recoverMediaError()
              break
            default:
              this.videoError = true
              this.errorMessage = "Failed to load video"
              this.hls?.destroy()
              break
          }
        }
      })

      this.hls.loadSource(this.videoUrl)
      this.hls.attachMedia(this.videoElement)
    } else if (this.videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari, which has native HLS support
      this.videoElement.src = this.videoUrl
      this.videoElement.addEventListener("loadedmetadata", () => {
        if (this.autoplay) {
          this.videoElement.play().catch((e) => {
            console.error("Autoplay prevented:", e)
          })
        }
      })
    } else {
      this.videoError = true
      this.errorMessage = "HLS is not supported in this browser"
    }
  }

  setupQualityLevels(levels: any[]): void {
    if (!levels || levels.length === 0) return

    this.qualities = levels.map((level, index) => ({
      label: level.height ? `${level.height}p` : `Quality ${index + 1}`,
      level: index,
      height: level.height || 0,
    }))

    // Sort by height (highest first)
    this.qualities.sort((a, b) => b.height - a.height)

    // Add auto quality option
    this.qualities.unshift({
      label: "Auto",
      level: -1,
      height: 0,
    })

    this.currentQuality = this.qualities[0] // Default to Auto
  }

  onTimeUpdate(): void {
    this.currentTime = this.videoElement.currentTime
  }

  onLoadedMetadata(): void {
    this.duration = this.videoElement.duration
    this.loadingVideo = false
  }

  onVolumeChange(): void {
    this.volume = this.videoElement.volume
    this.isMuted = this.videoElement.muted
  }

  onVideoEnded(): void {
    this.isPlaying = false
  }

  onVideoError(): void {
    this.videoError = true
    this.errorMessage = "Error playing video"
    this.loadingVideo = false
  }

  togglePlay(): void {
    if (this.videoElement.paused) {
      this.videoElement.play()
    } else {
      this.videoElement.pause()
    }
    this.isPlaying = !this.videoElement.paused
  }

  toggleMute(): void {
    this.videoElement.muted = !this.videoElement.muted
    this.isMuted = this.videoElement.muted
  }

  setVolume(event: Event): void {
    const input = event.target as HTMLInputElement
    this.videoElement.volume = +input.value
    this.volume = +input.value
    this.isMuted = this.volume === 0
    this.videoElement.muted = this.isMuted
  }

  seekTo(event: Event): void {
    const input = event.target as HTMLInputElement
    const seekTime = +input.value
    this.videoElement.currentTime = seekTime
    this.currentTime = seekTime
  }

  toggleFullscreen(): void {
    const videoContainer = document.querySelector(".video-container") as HTMLElement

    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen()
      }
      this.isFullscreen = true
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      this.isFullscreen = false
    }
  }

  showControlsTemporarily(): void {
    this.showControls = true
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout)
    }
    this.hideControlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.showControls = false
      }
    }, 3000)
  }

  toggleQualityMenu(): void {
    this.showQualityMenu = !this.showQualityMenu
  }

  setQuality(quality: VideoQuality): void {
    if (!this.hls) return

    this.currentQuality = quality
    this.showQualityMenu = false

    if (quality.level === -1) {
      // Auto quality
      this.hls.currentLevel = -1
    } else {
      this.hls.currentLevel = quality.level
    }
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    return [h, m, s]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  }
}
