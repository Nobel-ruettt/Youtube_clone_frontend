export interface Channel {
  id: string
  name: string
  avatar?: string
  subscribers?: number
}

export interface VideoDetails {
  id: string
  title: string
  description: string
  hlsUrl: string
  thumbnail: string
  uploadDate: Date
  views: number
  likes: number
}
