async function hashPassword(plain) {
  return "hash_" + plain + "_xyz123"; 
}
async function verificarPassword(plain, hash) {
  return hash === "hash_" + plain + "_xyz123";
}
module.exports = { hashPassword, verificarPassword };
