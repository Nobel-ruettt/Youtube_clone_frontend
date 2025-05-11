import { Injectable } from "@angular/core"
import {  HttpClient, HttpParams } from "@angular/common/http"
import  { Observable } from "rxjs"
import { map, catchError } from "rxjs/operators"
import  { VideoDetails } from "../models/video.model"

@Injectable({
  providedIn: "root",
})
export class WatchService {
  private readonly API_BASE_URL = "http://localhost:5052/api"
  private readonly VIDEO_DETAILS_ENDPOINT = `${this.API_BASE_URL}/VideoInformation/Video`

  constructor(private http: HttpClient) {}

  getVideoDetails(videoId: string): Observable<VideoDetails> {
    let params = new HttpParams()
    params = params.append("videoId", videoId)

    return this.http.get<any>(this.VIDEO_DETAILS_ENDPOINT, { params }).pipe(
      map((response) => {
        if (!response.isSuccess) {
          throw new Error("Failed to fetch video details")
        }

        const videoData = response.fieldValues["Item"];

        return {
          id: videoData.id,
          title: videoData.name,
          description: videoData.description,
          hlsUrl: videoData.videoPlaybackUrl,
          thumbnail: videoData.thumbnailUrl || "",
          uploadDate: new Date(videoData.uploadDate),
          views: videoData.views || 0,
          likes: videoData.likes || 0
        }
      }),
      catchError((error) => {
        console.error("Error fetching video details:", error)
        throw new Error("Failed to load video details")
      }),
    )
  }
}
