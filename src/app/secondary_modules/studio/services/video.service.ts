import { Injectable } from "@angular/core"
import  { HttpClient, HttpParams } from "@angular/common/http"
import {  Observable, of, throwError } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"

export interface Video {
  id: string
  thumbnail: string
  title: string
  description: string
  uploadDate: Date
  views: number
  likes: number
  comments: number
  duration: string
}

@Injectable({
  providedIn: "root",
})
export class VideoService {
  private readonly API_BASE_URL = "http://localhost:5052/api"
  private readonly GET_VIDEOS_ENDPOINT = `${this.API_BASE_URL}/VideoInformation/StudioVideos`

  constructor(private http: HttpClient) {}

  getUserVideos(): Observable<Video[]> {

    // Convert to HttpParams
    let params = new HttpParams();
    params = params.append("userName", "testUser");

    return this.http.get<any>(this.GET_VIDEOS_ENDPOINT, { params }).pipe(
      map((response) => {

        let videos = [];

        // Transform the API response to match our Video interface
        if(response.isSuccess) {
          videos = response.fieldValues["Items"] as any[];
        }

        return videos.map((item) => ({
          id: item.id,
          thumbnail: item.thumbnailUrl || "/assets/thumbnails/default.jpg",
          title: item.name,
          description: item.description,
          uploadDate: new Date(item.uploadDate),
          views: item.viewCount || 0,
          likes: item.likeCount || 0,
          comments: item.commentCount || 0,
          duration: item.duration || "00:00",
        }))
      }),
      catchError((error) => {
        console.error("Error fetching videos:", error)
        // For demo purposes, return mock data if the API fails
        return throwError(() => new Error("Failed to fetch videos. Please try again later."))
      }),
      tap((videos) => {
        console.log("Fetched videos:", videos)
      }),
    )
  }
}
