 
 export const formatRoleName = (role) =>{
  //console.log('role', role);
  return (
    role.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
 }

 export const formatRoleName2 = (role) => {
  // Remove the "kiongozi_" prefix if it exists
  const cleanedRole = role.replace(/^kiongozi_/, '');

  // Format the role name
  return cleanedRole
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const Share = async (post) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: `https://nishauri.com/postViewer/${post._id}`,
      });
      //console.log("Post shared successfully");
    } else {
      alert("Web Share API not supported on this browser.");
    }
  } catch (error) {
    console.error("Error sharing post:", error);
  }
};