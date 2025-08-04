// Image module declarations for static assets
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

// Repo assets module declarations
declare module "@repo/assets/images/*" {
  const src: string;
  export default src;
}

declare module "@repo/assets/fonts/*" {
  const src: string;
  export default src;
}
