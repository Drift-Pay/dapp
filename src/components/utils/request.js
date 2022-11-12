const userAuth = (address, message, signature) => {
  return {
    address,
    message,
    signature,
  };
};

export { userAuth };
