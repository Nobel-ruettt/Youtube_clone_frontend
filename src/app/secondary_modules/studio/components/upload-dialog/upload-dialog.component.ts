import { Component, OnInit,  OnDestroy, HostListener } from "@angular/core"
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms"
import { Subscription } from "rxjs"
import { DialogService } from "../../services/dialog.service"
import { UploadMetadata, UploadProgress, UploadService } from "../../services/upload.service"

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
  uploadId: string | null = null
  isUploading = false

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

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
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
    this.uploadId = null
    this.isUploading = false
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
    this.uploadProgress = {
      progress: 0,
      status: "pending",
      message: "Preparing upload...",
    }

    // Step 1: Initialize upload with metadata
    const metadata: UploadMetadata = {
      name: this.uploadForm.get("name")?.value,
      description: this.uploadForm.get("description")?.value,
      isAdult: this.uploadForm.get("isAdult")?.value,
      tags: this.tags.value,
      thumbnailFile: this.selectedThumbnail || undefined,
    }

    this.uploadService.initializeUpload(metadata).subscribe((uploadId) => {
      this.uploadId = uploadId

      // Step 2: Upload thumbnail if available
      if (this.selectedThumbnail) {
        this.uploadProgress = {
          progress: 0,
          status: "uploading",
          message: "Uploading thumbnail...",
        }

        this.uploadService.uploadThumbnail(uploadId, this.selectedThumbnail).subscribe(() => {
          this.uploadVideoChunks(uploadId)
        })
      } else {
        this.uploadVideoChunks(uploadId)
      }
    })
  }

  private uploadVideoChunks(uploadId: string): void {
    if (!this.selectedVideoFile) {
      return
    }

    const chunks = this.uploadService.createChunks(this.selectedVideoFile)
    let currentChunk = 0

    const uploadNextChunk = () => {
      if (currentChunk < chunks.length) {
        this.uploadService
          .uploadChunk(uploadId, chunks[currentChunk], currentChunk, chunks.length)
          .subscribe((progress) => {
            this.uploadProgress = progress
            currentChunk++
            uploadNextChunk()
          })
      } else {
        // All chunks uploaded, complete the upload
        this.uploadService.completeUpload(uploadId).subscribe((progress) => {
          this.uploadProgress = {
            progress: 100,
            status: "complete",
            message: "Upload complete!",
          }

          // Reset upload state after 3 seconds
          setTimeout(() => {
            this.isUploading = false
            this.dialogService.closeDialog()
          }, 3000)
        })
      }
    }

    // Start uploading chunks
    uploadNextChunk()
  }
}

