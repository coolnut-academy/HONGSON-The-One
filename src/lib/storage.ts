// Firebase Storage Helper Functions
// ============================================
// Handles image uploads for app icons

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./firebase";

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Upload an image file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder path in storage (default: 'app-icons')
 * @returns Promise with the download URL of the uploaded image
 */
export async function uploadImage(file: File, folder: string = "app-icons"): Promise<string> {
    try {
        // Generate a unique filename with timestamp
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `${timestamp}_${sanitizedName}`;

        // Create a reference to the file location
        const storageRef = ref(storage, `${folder}/${fileName}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file, {
            contentType: file.type,
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log("Image uploaded successfully:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image. Please try again.");
    }
}

/**
 * Delete an image from Firebase Storage by its URL
 * @param imageUrl - The download URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    try {
        // Only delete if it's a Firebase Storage URL
        if (!imageUrl.includes("firebasestorage.googleapis.com") &&
            !imageUrl.includes("firebasestorage.app")) {
            console.log("Not a Firebase Storage URL, skipping delete");
            return;
        }

        // Create a reference from the URL
        const imageRef = ref(storage, imageUrl);

        // Delete the file
        await deleteObject(imageRef);
        console.log("Image deleted successfully");
    } catch (error) {
        // Don't throw error if file doesn't exist
        console.warn("Error deleting image (may not exist):", error);
    }
}

export { storage };
