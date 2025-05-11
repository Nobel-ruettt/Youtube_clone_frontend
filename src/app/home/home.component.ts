import { Component,  OnInit,  OnDestroy } from "@angular/core"
import  { Router } from "@angular/router"
import { Subscription } from "rxjs"
import  { HomeVideoService, HomeVideo } from "../services/home-video.service"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  videos: HomeVideo[] = []
  isLoading = false
  error: string | null = null
  private subscription = new Subscription()

  sortOptions = [
    { label: "Date (newest)", value: "date_desc" },
    { label: "Date (oldest)", value: "date_asc" },
    { label: "Views (high to low)", value: "views_desc" },
    { label: "Views (low to high)", value: "views_asc" },
    { label: "Alphabetical (A-Z)", value: "alpha_asc" },
    { label: "Alphabetical (Z-A)", value: "alpha_desc" },
  ]

  selectedSort = "date_desc"

  constructor(
    private homeVideoService: HomeVideoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadVideos()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  loadVideos(): void {
    this.isLoading = true
    this.error = null

    this.subscription.add(
      this.homeVideoService.getHomeVideos().subscribe({
        next: (videos) => {
          this.videos = videos || []
          this.sortVideos()
          this.isLoading = false
        },
        error: (err) => {
          this.error = err.message || "Failed to load videos"
          this.isLoading = false
          this.videos = [] // Clear videos on error
        },
      }),
    )
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement
    this.selectedSort = select.value
    this.sortVideos()
  }

  sortVideos(): void {
    if (!this.videos || this.videos.length === 0) return

    switch (this.selectedSort) {
      case "date_desc":
        this.videos.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
        break
      case "date_asc":
        this.videos.sort((a, b) => a.uploadDate.getTime() - b.uploadDate.getTime())
        break
      case "views_desc":
        this.videos.sort((a, b) => b.views - a.views)
        break
      case "views_asc":
        this.videos.sort((a, b) => a.views - b.views)
        break
      case "alpha_asc":
        this.videos.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "alpha_desc":
        this.videos.sort((a, b) => b.title.localeCompare(a.title))
        break
    }
  }

  formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M views"
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K views"
    }
    return views.toString() + " views"
  }

  formatDate(date: Date): string {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`
    } else {
      return `${Math.floor(diffDays / 365)} years ago`
    }
  }

  watchVideo(videoId: string): void {
    this.router.navigate(["/watch", videoId])
  }

  // Refresh videos
  refreshVideos(): void {
    this.loadVideos()
  }
}
