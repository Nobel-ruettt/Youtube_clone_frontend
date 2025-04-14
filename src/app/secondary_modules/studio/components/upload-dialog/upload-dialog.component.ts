import { Component,  OnInit,  OnDestroy, HostListener } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators,  FormArray } from "@angular/forms"
import { Subscription } from "rxjs"
import  { UploadMetadata, UploadProgress, UploadService } from "../../services/upload.service"
import  { DialogService } from "../../services/dialog.service"

@Component({
  selector: "app-upload-dialog",
  templateUrl: "./upload-dialog.component.html",
  styleUrls: ["./upload-dialog.component.scss"],
})
export class UploadDialogComponent implements OnInit, OnDestroy {
  isOpen = false
  currentStep = 1
  uploadForm: FormGroup
  selectedThumbnail: File | null = null
  thumbnailPreview: string | null = null
  selectedVideoFile: File | null = null
  uploadProgress: UploadProgress | null = null
  sessionId = ""
  isUploading = false
  uploadError: string | null = null

  private subscriptions = new Subscription()

  constructor(
    private dialogService: DialogService,
    private uploadService: UploadService,
    private fb: FormBuilder,
  ) {
    this.uploadForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      description: ["", Validators.maxLength(5000)],
      isAdult: [false],
      tags: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.dialogService.dialogOpen$.subscribe((isOpen) => {
        this.isOpen = isOpen
        if (isOpen) {
          this.resetForm()
        }
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && !this.isUploading) {
      this.closeDialog()
    }
  }

  closeDialog(): void {
    if (this.isUploading) {
      if (confirm("Upload in progress. Are you sure you want to cancel?")) {
        this.dialogService.closeDialog()
      }
    } else {
      this.dialogService.closeDialog()
    }
  }

  resetForm(): void {
    this.currentStep = 1
    this.uploadForm.reset({
      name: "",
      description: "",
      isAdult: false,
    })
    this.clearTags()
    this.selectedThumbnail = null
    this.thumbnailPreview = null
    this.selectedVideoFile = null
    this.uploadProgress = null
    this.sessionId = ""
    this.isUploading = false
    this.uploadError = null
  }

  // Step 1: Form handling
  get tags(): FormArray {
    return this.uploadForm.get("tags") as FormArray
  }

  addTag(event: Event): void {
    event.preventDefault()
    const input = event.target as HTMLInputElement
    const value = input.value.trim()

    if (value && this.tags.value.indexOf(value) === -1 && this.tags.length < 10) {
      this.tags.push(this.fb.control(value))
      input.value = ""
    }
  }

  removeTag(index: number): void {
    this.tags.removeAt(index)
  }

  clearTags(): void {
    while (this.tags.length) {
      this.tags.removeAt(0)
    }
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.selectedThumbnail = input.files[0]

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        this.thumbnailPreview = reader.result as string
      }
      reader.readAsDataURL(this.selectedThumbnail)
    }
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.uploadForm.valid) {
        this.currentStep = 2
      } else {
        this.uploadForm.markAllAsTouched()
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1 && !this.isUploading) {
      this.currentStep--
    }
  }

  // Step 2: File upload
  onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.selectedVideoFile = input.files[0]
    }
  }

  startUpload(): void {
    if (!this.selectedVideoFile) {
      return
    }

    this.isUploading = true
    this.uploadError = null
    this.uploadProgress = {
      progress: 0,
      status: "pending",
      message: "Preparing upload...",
    }

    // Create chunks
    const chunks = this.uploadService.createChunks(this.selectedVideoFile)
    const totalChunks = chunks.length

    // First API call: Initialize upload with only file information
    this.uploadService
      .initializeUpload(this.selectedVideoFile.name, this.selectedVideoFile.size, totalChunks)
      .subscribe({
        next: (response) => {
          this.sessionId = response.fieldValues.SessionId
          this.uploadVideoChunks(this.sessionId, chunks)
        },
        error: (error) => {
          this.handleUploadError("Failed to initialize upload")
        },
      })
  }

  // Modify the uploadVideoChunks method to separate metadata saving
  private uploadVideoChunks(sessionId: string, chunks: Blob[]): void {
    let currentChunk = 0
    const totalChunks = chunks.length

    const uploadNextChunk = () => {
      if (currentChunk < totalChunks) {
        // Update progress display
        this.uploadProgress = {
          progress: (currentChunk / totalChunks) * 100,
          status: "uploading",
          message: `Uploading chunk ${currentChunk + 1} of ${totalChunks}...`,
        }

        // Upload the current chunk and wait for complete response
        this.uploadService.uploadChunk(sessionId, chunks[currentChunk], currentChunk + 1).subscribe({
          next: (success) => {
            if (success) {
              // Chunk uploaded successfully, move to next chunk
              currentChunk++

              // Update overall progress
              const overallProgress = (currentChunk / totalChunks) * 100
              this.uploadProgress = {
                progress: overallProgress,
                status: "uploading",
                message: `Uploaded ${currentChunk} of ${totalChunks} chunks (${Math.round(overallProgress)}%)`,
              }

              // Process next chunk
              uploadNextChunk()
            } else {
              this.handleUploadError(`Failed to upload chunk ${currentChunk + 1}`)
            }
          },
          error: (error) => {
            this.handleUploadError(`Failed to upload chunk ${currentChunk + 1}`)
          },
        })
      } else {
        // All chunks uploaded, complete the upload
        this.uploadProgress = {
          progress: 100,
          status: "processing",
          message: "Finalizing upload...",
        }

        // Call the completeMultipartUpload without metadata
        this.uploadService.completeMultipartUpload(sessionId).subscribe({
          next: (response) => {
            // Now that upload is complete, save metadata separately
            this.saveMetadata(sessionId)
          },
          error: (error) => {
            this.handleUploadError("Failed to complete upload")
          },
        })
      }
    }

    // Start uploading chunks
    uploadNextChunk()
  }

  // Simplified saveMetadata method without progress tracking
  private saveMetadata(sessionId: string): void {
    // Prepare metadata for the completion step
    const metadata: UploadMetadata = {
      name: this.uploadForm.get("name")?.value,
      description: this.uploadForm.get("description")?.value,
      isAdult: this.uploadForm.get("isAdult")?.value,
      tags: this.tags.value,
      thumbnailFile: this.selectedThumbnail || undefined,
    }

    this.uploadProgress = {
      progress: 100,
      status: "processing",
      message: "Saving video metadata...",
    }

    // Call the simplified updateMetadata method from the service
    this.uploadService.updateMetadata(sessionId, metadata).subscribe({
      next: (response) => {

        if(response.isSuccess == false){

          this.uploadProgress = {
            progress: 100,
            status: "complete",
            message: "Upload complete, but metadata update failed. You can edit details later.",
          }
        } else {
          console.log("Metadata saved successfully:", response)

          this.uploadProgress = {
            progress: 100,
            status: "complete",
            message: "Upload complete!",
          }
        }

        // Reset upload state after 3 seconds
        setTimeout(() => {
          this.isUploading = false
          this.dialogService.closeDialog()
        }, 3000)
      },
      error: (error) => {
        console.error("Error saving metadata:", error)
        this.uploadProgress = {
          progress: 100,
          status: "complete",
          message: "Upload complete, but metadata update failed. You can edit details later.",
        }

        // Still close the dialog after a delay
        setTimeout(() => {
          this.isUploading = false
          this.dialogService.closeDialog()
        }, 3000)
      },
    })
  }

  private handleUploadError(message: string): void {
    this.uploadError = message
    this.uploadProgress = {
      progress: 0,
      status: "error",
      message: message,
    }
    this.isUploading = false
  }

  // Retry upload after error
  retryUpload(): void {
    this.uploadError = null
    this.startUpload()
  }
}
