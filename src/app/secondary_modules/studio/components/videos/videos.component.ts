import { Component, type OnInit } from "@angular/core"
import { DialogService } from "../../services/dialog.service"

@Component({
  selector: "app-videos",
  templateUrl: "./videos.component.html",
  styleUrls: ["./videos.component.scss"],
})
export class VideosComponent implements OnInit {
  videos = [
    {
      id: "vid1",
      thumbnail: "/assets/thumbnails/video1.jpg",
      title: "Getting Started with Angular",
      description: "Learn the basics of Angular framework",
      visibility: "Public",
      uploadDate: new Date(2023, 5, 15),
      views: 1245,
      likes: 87,
      comments: 23,
      duration: "12:34",
    },
    {
      id: "vid2",
      thumbnail: "/assets/thumbnails/video2.jpg",
      title: "Advanced CSS Techniques",
      description: "Master modern CSS layouts and animations",
      visibility: "Public",
      uploadDate: new Date(2023, 6, 22),
      views: 3456,
      likes: 210,
      comments: 45,
      duration: "18:22",
    },
    {
      id: "vid3",
      thumbnail: "/assets/thumbnails/video3.jpg",
      title: "JavaScript Promises Explained",
      description: "Understanding asynchronous JavaScript",
      visibility: "Private",
      uploadDate: new Date(2023, 7, 10),
      views: 0,
      likes: 0,
      comments: 0,
      duration: "15:47",
    },
  ]

  filterOptions = [
    { label: "All", value: "all" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Unlisted", value: "unlisted" },
  ]

  sortOptions = [
    { label: "Date (newest)", value: "date_desc" },
    { label: "Date (oldest)", value: "date_asc" },
    { label: "Views (high to low)", value: "views_desc" },
    { label: "Views (low to high)", value: "views_asc" },
    { label: "Alphabetical (A-Z)", value: "alpha_asc" },
    { label: "Alphabetical (Z-A)", value: "alpha_desc" },
  ]

  selectedFilter = "all"
  selectedSort = "date_desc"
  searchQuery = ""

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  onFilterChange(filter: string): void {
    this.selectedFilter = filter
    // In a real app, this would filter the videos
  }

  onSortChange(sort: string): void {
    this.selectedSort = sort
    // In a real app, this would sort the videos
  }

  onSearch(): void {
    // In a real app, this would search the videos
    console.log("Searching for:", this.searchQuery)
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
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

  editVideo(videoId: string): void {
    // In a real app, this would navigate to edit page
    console.log("Editing video:", videoId)
  }

  uploadVideo(): void {
    // Open the upload dialog
    this.dialogService.openDialog()
  }
}

