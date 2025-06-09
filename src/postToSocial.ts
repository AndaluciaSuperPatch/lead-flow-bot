// src/utils/postToSocial.ts
export const postToSocial = async ({
  title,
  content,
  imageUrl,
}: {
  title?: string
  content: string
  imageUrl?: string
}) => {
  try {
    const response = await fetch("https://app.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        Authorization: "Bearer 25E4B7E8-DD5C4CA6-BFB4C3AD-F33C75B5, // reemplaza esto con tu API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: content,
        platforms: ["facebook", "instagram", "linkedin", "tiktok"],
        title,
        mediaUrls: imageUrl ? [imageUrl] : [],
      }),
    });

    const data = await response.json();
    console.log("✅ Publicación realizada:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al publicar:", error);
    throw error;
  }
};
