 
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