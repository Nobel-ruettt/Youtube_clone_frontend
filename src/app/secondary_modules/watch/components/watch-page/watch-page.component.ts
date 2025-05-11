import { Component,  OnInit,  OnDestroy } from "@angular/core"
import  { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { VideoDetails } from "../../models/video.model"
import { WatchService } from "../../services/watch.service"


@Component({
  selector: "app-watch-page",
  templateUrl: "./watch-page.component.html",
  styleUrls: ["./watch-page.component.scss"],
})
export class WatchPageComponent implements OnInit, OnDestroy {
  videoId = ""
  videoDetails: VideoDetails | null = null
  isLoading = true
  error: string | null = null
  private subscription = new Subscription()

  constructor(
    private route: ActivatedRoute,
    private watchService: WatchService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        this.videoId = params.get("id") || ""
        if (this.videoId) {
          this.loadVideoDetails()
        } else {
          this.error = "Video ID not provided"
          this.isLoading = false
        }
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  loadVideoDetails(): void {
    this.isLoading = true
    this.error = null

    this.subscription.add(
      this.watchService.getVideoDetails(this.videoId).subscribe({
        next: (details) => {
          this.videoDetails = details
          this.isLoading = false
        },
        error: (err) => {
          console.error("Error loading video details:", err)
          this.error = "Failed to load video details"
          this.isLoading = false
        },
      }),
    )
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M views"
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K views"
    }
    return views.toString() + " views"
  }
}
