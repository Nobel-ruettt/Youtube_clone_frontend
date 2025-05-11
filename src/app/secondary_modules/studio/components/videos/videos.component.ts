import { Component,  OnInit,  OnDestroy } from "@angular/core"
import  { Router } from "@angular/router"
import { Subscription } from "rxjs"
import  { DialogService } from "../../services/dialog.service"
import  { VideoService, Video } from "../../services/video.service"

@Component({
  selector: "app-videos",
  templateUrl: "./videos.component.html",
  styleUrls: ["./videos.component.scss"],
})
export class VideosComponent implements OnInit, OnDestroy {
  videos: Video[] = []
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
  viewMode: "list" | "grid" = "grid" // Default to grid view

  constructor(
    private dialogService: DialogService,
    private videoService: VideoService,
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
      this.videoService.getUserVideos().subscribe({
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

  onSortChange(sort: string): void {
    this.selectedSort = sort
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

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  getYear(date: Date): number {
    return date.getFullYear()
  }

  formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M"
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K"
    }
    return views.toString()
  }

  deleteVideo(videoId: string): void {
    // In a real app, this would delete the video
    console.log("Deleting video:", videoId)
  }

  // Removed editVideo method

  uploadVideo(): void {
    // Open the upload dialog
    this.dialogService.openDialog()
  }

  // Toggle between list and grid view
  toggleViewMode(): void {
    this.viewMode = this.viewMode === "list" ? "grid" : "list"
  }

  // Refresh videos
  refreshVideos(): void {
    this.loadVideos()
  }

  watchVideo(videoId: string): void {
    this.router.navigate(["/watch", videoId])
  }
}
