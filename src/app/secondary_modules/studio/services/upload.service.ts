import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import { delay } from "rxjs/operators"

export interface UploadMetadata {
  name: string
  description: string
  isAdult: boolean
  tags: string[]
  thumbnailFile?: File
}

export interface UploadProgress {
  progress: number
  status: "pending" | "uploading" | "processing" | "complete" | "error"
  message?: string
}

@Injectable({
  providedIn: "root",
})
export class UploadService {
  // Simulated chunk size: 1MB
  private readonly CHUNK_SIZE = 1024 * 1024

  constructor() {}

  // Initialize upload and get upload ID
  initializeUpload(metadata: UploadMetadata): Observable<string> {
    console.log("Initializing upload with metadata:", metadata)
    // Simulate API call to initialize upload
    return of(`upload-${Date.now()}`).pipe(delay(800))
  }

  // Upload thumbnail
  uploadThumbnail(uploadId: string, file: File): Observable<UploadProgress> {
    console.log(`Uploading thumbnail for upload ${uploadId}`)
    // Simulate thumbnail upload
    return of({ progress: 100, status: "complete" } as UploadProgress).pipe(delay(1500))
  }

  // Upload file chunk
  uploadChunk(uploadId: string, chunk: Blob, chunkIndex: number, totalChunks: number): Observable<UploadProgress> {
    console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks} for upload ${uploadId}`)
    // Simulate chunk upload with varying delays based on chunk index
    const progress = ((chunkIndex + 1) / totalChunks) * 100
    return of({
      progress,
      status: "uploading",
      message: `Uploading chunk ${chunkIndex + 1} of ${totalChunks}`,
    } as UploadProgress).pipe(delay(800 + Math.random() * 1200))
  }

  // Complete upload
  completeUpload(uploadId: string): Observable<UploadProgress> {
    console.log(`Completing upload ${uploadId}`)
    // Simulate processing after upload
    return of({
      progress: 100,
      status: "processing",
      message: "Processing video...",
    } as UploadProgress).pipe(delay(2000))
  }

  // Helper method to split file into chunks
  createChunks(file: File): Blob[] {
    const chunks: Blob[] = []
    let start = 0

    while (start < file.size) {
      const end = Math.min(start + this.CHUNK_SIZE, file.size)
      chunks.push(file.slice(start, end))
      start = end
    }

    return chunks
  }
}

