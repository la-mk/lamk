export interface Media {
  _id: string;
  height: number;
  width: number;
  size: number;
  mimeType: "image/jpeg" | "image/png";
  defaultUrl?: string;
}
