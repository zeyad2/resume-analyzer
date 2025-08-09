export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
  }
  
  // Use the worker that matches the installed pdfjs-dist version
  // Vite will turn this into a static URL we can point the worker to
  import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

  let pdfjsLib: any = null;
  let isLoading = false;
  let loadPromise: Promise<any> | null = null;
  
  async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;
  
    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
      // Set worker to the exact version-bundled URL to avoid version mismatch
      try {
        lib.GlobalWorkerOptions.workerSrc = (pdfWorkerSrc as unknown as string) || 
          "https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.worker.mjs";
      } catch (_err) {
        // Fallbacks: CDN (matching package.json), then public file if present
        try {
          lib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.worker.mjs";
        } catch {
          try {
            lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
          } catch {
            // last resort: let pdf.js attempt its default behavior
          }
        }
      }
      pdfjsLib = lib;
      isLoading = false;
      return lib;
    });
  
    return loadPromise;
  }
  
  function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png",
        1.0
      );
    });
  }
  
  async function ensureBlobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob | null> {
    const direct = await canvasToPngBlob(canvas);
    if (direct) return direct;
    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (_err) {
      return null;
    }
  }
  
  export async function convertPdfToImage(
    file: File
  ): Promise<PdfConversionResult> {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return {
          imageUrl: "",
          file: null,
          error: "PDF conversion must run in a browser context",
        };
      }
  
      if (!file || file.type !== "application/pdf") {
        return {
          imageUrl: "",
          file: null,
          error: "Unsupported file type. Please upload a PDF.",
        };
      }

      const lib = await loadPdfJs();
  
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
  
      // Use a conservative scale to avoid exceeding canvas limits on large pages
      const viewport = page.getViewport({ scale: 2.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
  
      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
      }
  
      await page.render({ canvasContext: context!, viewport }).promise;

      const blob = await ensureBlobFromCanvas(canvas);
      if (!blob) {
        return {
          imageUrl: "",
          file: null,
          error: "Failed to create image blob",
        };
      }

      const originalName = file.name.replace(/\.pdf$/i, "");
      const imageFile = new File([blob], `${originalName}.png`, {
        type: "image/png",
      });

      return {
        imageUrl: URL.createObjectURL(blob),
        file: imageFile,
      };
    } catch (err) {
      return {
        imageUrl: "",
        file: null,
        error: `Failed to convert PDF: ${err}`,
      };
    }
  }