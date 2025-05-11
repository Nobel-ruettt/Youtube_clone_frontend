import { Component, type OnInit, Input } from "@angular/core"
import { RouteService } from "../../services/route.service.ts.service"
// Add import for RouteService


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false
  @Input() isLoggedIn = false // Add input for login state
  showAllSubscriptions = false

  mainNavItems = [
    { icon: "home", label: "Home", link: "/" },
    { icon: "explore", label: "Explore", link: "/explore" },
    { icon: "subscriptions", label: "Subscriptions", link: "/subscriptions" },
  ]

  libraryItems = [
    { icon: "video_library", label: "Library", link: "/library" },
    { icon: "history", label: "History", link: "/history" },
    { icon: "slideshow", label: "Your videos", link: "/your-videos" },
    { icon: "schedule", label: "Watch later", link: "/playlist?list=WL" },
    { icon: "thumb_up", label: "Liked videos", link: "/playlist?list=LL" },
  ]

  // Expanded to 20 subscriptions
  subscriptions = [
    { name: "Shunno", avatar: "C1", link: "/channel/1" },
    { name: "Channel 2", avatar: "C2", link: "/channel/2" },
    { name: "Channel 3", avatar: "C3", link: "/channel/3" },
    { name: "Channel 4", avatar: "C4", link: "/channel/4" },
    { name: "Channel 5", avatar: "C5", link: "/channel/5" },
    { name: "Channel 6", avatar: "C6", link: "/channel/6" },
    { name: "Channel 7", avatar: "C7", link: "/channel/7" },
    { name: "Channel 8", avatar: "C8", link: "/channel/8" },
    { name: "Channel 9", avatar: "C9", link: "/channel/9" },
    { name: "Channel 10", avatar: "C10", link: "/channel/10" },
    { name: "Channel 11", avatar: "C11", link: "/channel/11" },
    { name: "Channel 12", avatar: "C12", link: "/channel/12" },
    { name: "Channel 13", avatar: "C13", link: "/channel/13" },
    { name: "Channel 14", avatar: "C14", link: "/channel/14" },
    { name: "Channel 15", avatar: "C15", link: "/channel/15" },
    { name: "Channel 16", avatar: "C16", link: "/channel/16" },
    { name: "Channel 17", avatar: "C17", link: "/channel/17" },
    { name: "Channel 18", avatar: "C18", link: "/channel/18" },
    { name: "Channel 19", avatar: "C19", link: "/channel/19" },
    { name: "Channel 20", avatar: "C20", link: "/channel/20" },
  ]

  exploreItems = [
    { icon: "local_fire_department", label: "Trending", link: "/trending" },
    { icon: "music_note", label: "Music", link: "/music" },
    { icon: "movie", label: "Movies & TV", link: "/movies" },
    { icon: "stream", label: "Live", link: "/live" },
    { icon: "sports_esports", label: "Gaming", link: "/gaming" },
    { icon: "newspaper", label: "News", link: "/news" },
    { icon: "emoji_events", label: "Sports", link: "/sports" },
  ]

  footerLinks = [
    { label: "About", link: "/about" },
    { label: "Press", link: "/press" },
    { label: "Copyright", link: "/copyright" },
    { label: "Contact", link: "/contact" },
    { label: "Creators", link: "/creators" },
    { label: "Advertise", link: "/advertise" },
    { label: "Developers", link: "/developers" },
    { label: "Terms", link: "/terms" },
    { label: "Privacy", link: "/privacy" },
    { label: "Policy & Safety", link: "/policy" },
    { label: "How YouTube works", link: "/how-youtube-works" },
    { label: "Test new features", link: "/new" },
  ]

  // Add isStudioRoute property and studioNavItems
  isStudioRoute = false

  studioNavItems = [
    { icon: "video_library", label: "Videos", link: "/studio/videos", active: true },
    { icon: "hourglass_empty", label: "Processing Videos", link: "/studio/processing" },
    { icon: "playlist_play", label: "Playlists", link: "/studio/playlists" },
    { icon: "tune", label: "Channel Customization", link: "/studio/customization" },
  ]

  // Update the constructor to inject RouteService
  constructor(private routeService: RouteService) {}

  // Update ngOnInit to subscribe to route changes
  ngOnInit(): void {
    this.routeService.isStudioRoute$.subscribe((isStudio) => {
      this.isStudioRoute = isStudio
    })
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed
  }

  toggleSubscriptions(): void {
    this.showAllSubscriptions = !this.showAllSubscriptions
  }

  // Get visible subscriptions based on showAllSubscriptions state
  get visibleSubscriptions(): any[] {
    return this.showAllSubscriptions ? this.subscriptions : this.subscriptions.slice(0, 7) // Show only first 7 initially
  }

  // Check if we have more subscriptions to show
  get hasMoreSubscriptions(): boolean {
    return this.subscriptions.length > 7
  }
}

