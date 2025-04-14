import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { map, catchError } from "rxjs/operators"

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

export interface InitializeUploadResponse {
  sessionId: string
}

@Injectable({
  providedIn: "root",
})
export class UploadService {
  // Simulated chunk size: 1MB
  readonly CHUNK_SIZE = 1024 * 1024 * 5

  // Dummy API endpoints - replace these with your actual API endpoints
  private readonly API_BASE_URL = "http://localhost:5052/api"
  private readonly INITIALIZE_UPLOAD_ENDPOINT = `${this.API_BASE_URL}/VideoUpload/InitiateFileUploadSession`
  private readonly UPLOAD_CHUNK_ENDPOINT = `${this.API_BASE_URL}/VideoUpload/UploadFileChunk`
  private readonly COMPLETE_UPLOAD_ENDPOINT = `${this.API_BASE_URL}/VideoUpload/CompleteVideoUpload`
  private readonly UPDATE_METADATA_ENDPOINT = `${this.API_BASE_URL}/VideoMetadata/SaveNewVideoMetadata`

  constructor(private http: HttpClient) {}

  // Initialize upload and get session ID - simplified to only include file info
  initializeUpload(fileName: string, fileSize: number, totalChunks: number): Observable<any> {
    console.log("Initializing upload with params:", { fileName, fileSize, totalChunks })

    // Create form data for the request
    const videoUploadCommand = {
      fileName: fileName,
      fileSize: fileSize,
      totalChunks: totalChunks,
    }

    // Make the HTTP request
    return this.http.post<any>(this.INITIALIZE_UPLOAD_ENDPOINT, videoUploadCommand).pipe(
      catchError((error) => {
        console.error("Error initializing upload:", error)
        throw error
      }),
    )
  }

  // Update metadata and upload thumbnail in the same request - modified to match backend command
  updateMetadata(sessionId: string, metadata: UploadMetadata): Observable<any> {
    console.log(`Updating metadata for session ${sessionId}`)

    const formData = new FormData()

    // Add session ID - match the property name in SaveNewVideoInformationCommand
    formData.append("SessionId", sessionId)

    // Add metadata as JSON string - match the property name in SaveNewVideoInformationCommand
    const metadataJson = {
      name: metadata.name,
      description: metadata.description,
      isAdult: metadata.isAdult,
      tags: metadata.tags,
    }
    formData.append("Metadata", JSON.stringify(metadataJson))

    // Add thumbnail if available - match the property name in SaveNewVideoInformationCommand
    if (metadata.thumbnailFile) {
      formData.append("Thumbnail", metadata.thumbnailFile)
    }

    // Use a simple post request without progress tracking
    return this.http.post<any>(this.UPDATE_METADATA_ENDPOINT, formData).pipe(
      map((response) => {
        console.log("Metadata updated successfully", response)
        return response
      }),
      catchError((error) => {
        console.error("Error updating metadata:", error)
        throw error
      }),
    )
  }

  // Upload file chunk - modified to wait for complete response
  uploadChunk(sessionId: string, chunk: Blob, chunkNumber: number): Observable<boolean> {
    console.log(`Uploading chunk ${chunkNumber} for session ${sessionId}`)

    const formData = new FormData()
    formData.append("sessionId", sessionId)
    formData.append("partNumber", chunkNumber.toString())
    formData.append("chunk", chunk)

    // Use regular post request instead of HttpRequest with progress tracking
    return this.http.post<any>(this.UPLOAD_CHUNK_ENDPOINT, formData).pipe(
      map((response) => {
        console.log(`Chunk ${chunkNumber} uploaded successfully`, response)
        return true // Return true to indicate success
      }),
      catchError((error) => {
        console.error(`Error uploading chunk ${chunkNumber}:`, error)
        return of(false) // Return false to indicate failure
      }),
    )
  }

  // Modify the completeMultipartUpload method to not handle metadata
  completeMultipartUpload(sessionId: string): Observable<any> {
    console.log(`Completing multipart upload for session ${sessionId}`)

    // Complete the upload without metadata
    const completeUploadCommand = {
      sessionId: sessionId,
    }

    return this.http.post<any>(this.COMPLETE_UPLOAD_ENDPOINT, completeUploadCommand).pipe(
      map((response) => {
        console.log("Upload completed successfully", response)
        return response
      }),
      catchError((error) => {
        console.error("Error completing upload:", error)
        throw error
      }),
    )
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
