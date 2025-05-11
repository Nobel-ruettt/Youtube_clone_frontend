import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, throwError } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"

export interface HomeVideo {
  id: string
  thumbnail: string
  title: string
  description: string
  uploadDate: Date
  views: number
  duration: string
}

@Injectable({
  providedIn: "root",
})
export class HomeVideoService {
  private readonly API_BASE_URL = "http://localhost:5052/api"
  private readonly GET_VIDEOS_ENDPOINT = `${this.API_BASE_URL}/VideoInformation/AllVideos`

  constructor(private http: HttpClient) {}

  getHomeVideos(): Observable<HomeVideo[]> {
    return this.http.get<any>(this.GET_VIDEOS_ENDPOINT).pipe(
      map((response) => {
        let videos = []

        // Transform the API response to match our HomeVideo interface
        if (response.isSuccess) {
          videos = response.fieldValues["Items"] as any[]
        }

        return videos.map((item) => ({
          id: item.id,
          thumbnail: item.thumbnailUrl || "/assets/thumbnails/default.jpg",
          title: item.name,
          description: item.description,
          uploadDate: new Date(item.uploadDate),
          views: item.viewCount || 0,
          duration: item.duration || "00:00",
        }))
      }),
      catchError((error) => {
        console.error("Error fetching home videos:", error)
        return throwError(() => new Error("Failed to fetch videos. Please try again later."))
      }),
      tap((videos) => {
        console.log("Fetched home videos:", videos)
      }),
    )
  }
}
